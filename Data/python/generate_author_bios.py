import pyodbc
import textwrap

conn_str = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=mssql.cs.ksu.edu;"
    "DATABASE=cis560_f25_team11;"
    "UID=aayushrai;"
    "PWD=!nsecurepassw0rd;"
    "Encrypt=yes;"
    "TrustServerCertificate=yes;"
)

conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

print("Connected to SQL Server.")

# ---------- LOAD AUTHOR METADATA ----------

# This query is basically what you just tested, plus Description
query = """
;WITH AuthorStats AS (
    SELECT
        a.AuthorID,
        a.FirstName,
        a.LastName,
        COUNT(DISTINCT b.BookID) AS BookCount
    FROM Authors a
    LEFT JOIN Books b ON b.AuthorID = a.AuthorID
    GROUP BY a.AuthorID, a.FirstName, a.LastName
),
AuthorGenres AS (
    SELECT
        a.AuthorID,
        g.Name AS GenreName,
        COUNT(*) AS GenreBookCount,
        ROW_NUMBER() OVER (
            PARTITION BY a.AuthorID
            ORDER BY COUNT(*) DESC
        ) AS rn
    FROM Authors a
    JOIN Books b ON b.AuthorID = a.AuthorID
    JOIN Genres g ON g.GenreID = b.GenreID
    GROUP BY a.AuthorID, g.Name
),
SampleTitles AS (
    SELECT
        a.AuthorID,
        STRING_AGG(b.Title, ', ') WITHIN GROUP (ORDER BY b.BookID) AS SampleTitles
    FROM Authors a
    JOIN Books b ON b.AuthorID = a.AuthorID
    GROUP BY a.AuthorID
)
SELECT
    s.AuthorID,
    s.FirstName,
    s.LastName,
    s.BookCount,
    ag.GenreName AS DominantGenre,
    t.SampleTitles,
    a.Description
FROM AuthorStats s
LEFT JOIN AuthorGenres ag
    ON ag.AuthorID = s.AuthorID
   AND ag.rn = 1
LEFT JOIN SampleTitles t
    ON t.AuthorID = s.AuthorID
JOIN Authors a
    ON a.AuthorID = s.AuthorID
WHERE a.Description IS NULL OR LTRIM(RTRIM(a.Description)) = '';
"""

cursor.execute(query)
rows = cursor.fetchall()
print(f"Found {len(rows)} authors needing descriptions.")

if not rows:
    conn.close()
    print("Nothing to do.")
    raise SystemExit


# ---------- BIO GENERATION LOGIC ----------

def pick_short_titles(sample_titles: str, max_titles: int = 2):
    if not sample_titles:
        return []
    parts = [p.strip() for p in sample_titles.split(",") if p.strip()]
    return parts[:max_titles]


def genre_label(genre_name: str):
    # Normalize / fallbacks
    if not genre_name:
        return "fiction"
    g = genre_name.lower()
    if "fantasy" in g:
        return "fantasy"
    if "science fiction" in g:
        return "science fiction"
    if "horror" in g:
        return "horror"
    if "mystery" in g:
        return "mystery"
    if "romance" in g:
        return "romance"
    if "non-fiction" in g or "nonfiction" in g:
        return "non-fiction"
    return genre_name.lower()


def build_bio(first_name, last_name, book_count, dominant_genre, sample_titles):
    full_name = f"{first_name} {last_name}".strip()
    if not full_name:
        full_name = "This author"

    g = genre_label(dominant_genre)
    titles = pick_short_titles(sample_titles)

    # Sentence 1 – who they are
    s1 = f"{full_name} is a {g} author whose work has reached readers across generations."

    # Sentence 2 – lifelong connection to stories
    s2 = (
        f"From an early love of stories, {full_name.split()[0]} developed a voice "
        f"that blends imagination, emotion, and a strong sense of character."
    )

    # Sentence 3 – body of work
    if book_count and book_count > 1:
        s3 = (
            f"Over the course of {book_count} books, they have explored recurring themes "
            f"of identity, choice, and the quiet moments that change people's lives."
        )
    else:
        s3 = (
            "Even with a relatively small body of published work, their writing leaves "
            "a lasting impression through careful attention to detail and atmosphere."
        )

    # Sentence 4 – titles hook
    if titles:
        if len(titles) == 1:
            s4 = (
                f"Readers are often introduced to {full_name} through works like "
                f"\"{titles[0]}\", which showcases their style and storytelling voice."
            )
        else:
            s4 = (
                f"Many readers discover {full_name} through books such as "
                f"\"{titles[0]}\" and \"{titles[1]}\", which highlight their range and imagination."
            )
    else:
        s4 = (
            "Their stories are known for memorable scenes, vivid imagery, "
            "and characters who feel grounded and human."
        )

    # Sentence 5 – emotional / thematic focus, genre-specific
    if g == "fantasy":
        s5 = (
            "Their fantasy worlds balance magic with human vulnerability, focusing less on spectacle "
            "and more on the choices people make when faced with the unknown."
        )
    elif g == "science fiction":
        s5 = (
            "In science fiction, their work often looks past technology itself and toward the people "
            "living with its consequences, asking what progress truly costs."
        )
    elif g == "horror":
        s5 = (
            "Their horror tends to favor slow-building tension, everyday settings, and the sense that "
            "something familiar has quietly gone wrong."
        )
    elif g == "mystery":
        s5 = (
            "Their mysteries emphasize atmosphere and motive as much as clues, inviting readers to pay "
            "attention to the small details everyone else overlooks."
        )
    elif g == "romance":
        s5 = (
            "In romance, they explore the connection between vulnerability and strength, showing how love "
            "can be both unsettling and deeply healing."
        )
    elif g == "non-fiction":
        s5 = (
            "Their non-fiction blends clear structure with accessible language, aiming to make complex ideas "
            "feel practical, relevant, and grounded in real life."
        )
    else:
        s5 = (
            "Across their work, they return to questions of belonging, purpose, and how people reinvent "
            "themselves when life does not go as planned."
        )

    # Sentence 6 – relationship with readers
    s6 = (
        f"Whether read casually or studied closely, {full_name}'s writing invites readers to slow down, "
        "notice small details, and see familiar experiences from a slightly different angle."
    )

    bio = " ".join([s1, s2, s3, s4, s5, s6])
    # Just to be safe, wrap/strip whitespace
    return " ".join(bio.split())


updated = 0

for row in rows:
    author_id      = row.AuthorID
    first_name     = row.FirstName or ""
    last_name      = row.LastName or ""
    book_count     = row.BookCount or 0
    dominant_genre = row.DominantGenre or ""
    sample_titles  = row.SampleTitles or ""

    bio = build_bio(first_name, last_name, book_count, dominant_genre, sample_titles)

    cursor.execute(
        "UPDATE Authors SET Description = ? WHERE AuthorID = ?;",
        bio,
        author_id
    )
    updated += 1

conn.commit()
conn.close()

print(f"Done. Wrote descriptions for {updated} authors.")

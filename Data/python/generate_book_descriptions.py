import pyodbc
from datetime import datetime

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

# ---------- LOAD BOOKS THAT NEED DESCRIPTIONS ----------

query = """
SELECT
    b.BookID,
    b.Title,
    b.Description,
    b.PublicationDate,
    g.Name      AS GenreName,
    a.FirstName AS AuthorFirst,
    a.LastName  AS AuthorLast
FROM Books b
LEFT JOIN Genres g  ON g.GenreID  = b.GenreID
LEFT JOIN Authors a ON a.AuthorID = b.AuthorID
WHERE
    b.Description IS NULL
    OR LTRIM(RTRIM(b.Description)) = ''
    OR b.Description LIKE 'Description not available yet for "%".';
"""

cursor.execute(query)
rows = cursor.fetchall()
print(f"Found {len(rows)} books needing descriptions.")

if not rows:
    conn.close()
    print("No books to update. Exiting.")
    raise SystemExit


# ---------- HELPERS ----------

def genre_phrase(genre_name: str) -> str:
    if not genre_name:
        return "fiction"
    g = genre_name.lower()
    if "fantasy" in g:
        return "a fantasy story"
    if "science fiction" in g:
        return "a science fiction tale"
    if "horror" in g:
        return "a horror story"
    if "mystery" in g:
        return "a mystery full of questions"
    if "romance" in g:
        return "a romance about connection and second chances"
    if "non-fiction" in g or "nonfiction" in g:
        return "a non-fiction book that explores real-world ideas"
    return f"a {genre_name.lower()} story"


def year_from_date(dt) -> str | None:
    if dt is None:
        return None
    try:
        # pyodbc usually gives a datetime/date object already
        return str(dt.year)
    except Exception:
        return None


def build_book_description(title: str, author_first: str, author_last: str,
                           genre_name: str, pub_date) -> str:
    title = (title or "").strip()
    full_author = f"{(author_first or '').strip()} {(author_last or '').strip()}".strip()
    if not full_author:
        full_author = "the author"

    genre_text = genre_phrase(genre_name or "")
    year = year_from_date(pub_date)

    # Sentence 1 – basic intro
    if year:
        s1 = f"\"{title}\" is {genre_text}, originally published around {year}."
    else:
        s1 = f"\"{title}\" is {genre_text} that invites readers into a carefully crafted world."

    # Sentence 2 – what it focuses on (people/choices/setting)
    s2 = (
        f"In this book, {full_author} focuses on characters facing difficult choices, "
        f"small details that build atmosphere, and moments that quietly shift the course of a life."
    )

    # Sentence 3 – tone / pace
    s3 = (
        "The story balances slower reflective scenes with more intense sections, "
        "giving readers time to sit with ideas before the next turn in the plot."
    )

    # Sentence 4 – emotional / thematic angle
    if "non-fiction" in (genre_name or "").lower():
        s4 = (
            "Rather than relying on abstract theory, the book keeps its ideas grounded, "
            "using clear language and concrete examples that feel practical and approachable."
        )
    else:
        s4 = (
            "Themes of identity, belonging, and the impact of everyday decisions appear throughout, "
            "making the narrative feel personal even when the setting is distant from everyday life."
        )

    # Sentence 5 – why someone might pick it up
    s5 = (
        f"Readers who enjoy character-driven stories with a strong sense of mood will find "
        f"\"{title}\" especially engaging, whether they read it quickly in a few sittings "
        "or return to it slowly over time."
    )

    desc = " ".join([s1, s2, s3, s4, s5])
    # clean up any weird extra spaces
    return " ".join(desc.split())


# ---------- GENERATE AND UPDATE ----------

updated = 0

for row in rows:
    book_id      = row.BookID
    title        = row.Title or ""
    desc_current = row.Description or ""
    pub_date     = row.PublicationDate
    genre_name   = row.GenreName or ""
    a_first      = row.AuthorFirst or ""
    a_last       = row.AuthorLast or ""

    new_desc = build_book_description(title, a_first, a_last, genre_name, pub_date)

    cursor.execute(
        "UPDATE Books SET Description = ? WHERE BookID = ?;",
        new_desc,
        book_id
    )
    updated += 1

conn.commit()
conn.close()

print(f"Done. Wrote descriptions for {updated} books.")

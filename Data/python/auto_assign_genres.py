import pyodbc
import pandas as pd

# ---------- DB CONNECTION ----------
conn_str = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=mssql.cs.ksu.edu;"
    "DATABASE=cis560_f25_team11;"
    "UID=aayushrai;"
    "PWD=!nsecurepassw0rd;"   # DO NOT commit this to Git, keep it local only
    "Encrypt=no;"
)

conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

print("Connected to SQL Server.")


# ---------- LOAD GENRES ----------
genres_df = pd.read_sql("SELECT GenreID, Name FROM Genres;", conn)
print("Genres table:")
print(genres_df)

# Map genre name -> GenreID
genre_name_to_id = {row["Name"]: row["GenreID"] for _, row in genres_df.iterrows()}

# Ensure we have the 6 expected genres (must match DB names exactly)
required_genres = ["Fantasy", "Horror", "Mystery", "Non-Fiction", "Romance", "Science Fiction"]
missing = [g for g in required_genres if g not in genre_name_to_id]
if missing:
    raise ValueError(f"Missing genres in DB: {missing}")


# ---------- CURRENT GENRE COUNTS ----------
counts_df = pd.read_sql("""
    SELECT g.GenreID, g.Name, COUNT(*) AS BookCount
    FROM Books b
    JOIN Genres g ON b.GenreID = g.GenreID
    GROUP BY g.GenreID, g.Name;
""", conn)

current_counts = {row["GenreID"]: row["BookCount"] for _, row in counts_df.iterrows()}

# Initialize missing genres with 0
for gname, gid in genre_name_to_id.items():
    current_counts.setdefault(gid, 0)

print("Current genre counts (before assignment):", current_counts)


# ---------- LOAD BOOKS WITH NULL GenreID ----------
books_df = pd.read_sql("""
    SELECT BookID, Title, Publisher, Description
    FROM Books
    WHERE GenreID IS NULL;
""", conn)

print(f"Found {len(books_df)} books with NULL GenreID.")

if books_df.empty:
    print("No books to assign. Exiting.")
    conn.close()
    raise SystemExit


# ---------- KEYWORD-BASED HEURISTICS ----------
keyword_map = {
    "Fantasy": [
        "fantasy", "dragon", "wizard", "sword", "magic", "chronicles", "ring",
        "kingdom", "castle", "mage"
    ],
    "Horror": [
        "horror", "ghost", "haunted", "vampire", "nightmare", "darkness",
        "the dead", "zombie", "fear", "blood", "scary"
    ],
    "Mystery": [
        "mystery", "murder", "detective", "case of", "crime", "whodunit",
        "investigation", "secret", "clue", "file", "private eye"
    ],
    "Non-Fiction": [
        "history", "biography", "memoir", "guide", "how to", "essays",
        "theory", "introduction", "business", "politics", "economics",
        "science of", "art of", "life of"
    ],
    "Romance": [
        "romance", "love", "lover", "heart", "kiss", "wedding",
        "bride", "brides", "affair", "desire", "passion", "valentine"
    ],
    "Science Fiction": [
        "science fiction", "sci-fi", "sci fi", "space", "star", "galaxy",
        "universe", "planet", "robot", "android", "alien",
        "time travel", "cyber", "future", "dystopia"
    ]
}


def guess_genre_name(title, publisher, description):
    text = ((title or "") + " " + (publisher or "") + " " + (description or "")).lower()
    for genre_name, words in keyword_map.items():
        for w in words:
            if w in text:
                return genre_name
    return None


# First pass: keyword-based assignment
assigned = {}  # BookID -> GenreID
unassigned_book_ids = []

for _, row in books_df.iterrows():
    book_id = row["BookID"]
    title = row["Title"]
    publisher = row["Publisher"]
    description = row["Description"]

    gname = guess_genre_name(title, publisher, description)
    if gname is not None:
        gid = genre_name_to_id[gname]
        assigned[book_id] = gid
        current_counts[gid] = current_counts.get(gid, 0) + 1
    else:
        unassigned_book_ids.append(book_id)

print(f"After keyword pass: assigned {len(assigned)} books, {len(unassigned_book_ids)} remain unassigned.")
print("Genre counts (after keyword pass, before balancing):", current_counts)


# ---------- BALANCE TO ENSURE >= 20 PER GENRE ----------
MIN_PER_GENRE = 20  # tweak if needed

def genres_needing_books():
    return [
        gid for gid in current_counts
        if current_counts[gid] < MIN_PER_GENRE
    ]


# 1) Ensure each genre has at least MIN_PER_GENRE
while unassigned_book_ids and genres_needing_books():
    for gid in genres_needing_books():
        if not unassigned_book_ids:
            break
        book_id = unassigned_book_ids.pop(0)
        assigned[book_id] = gid
        current_counts[gid] += 1

print("Genre counts after enforcing minimums:", current_counts)
print(f"Unassigned leftovers after min enforcement: {len(unassigned_book_ids)}")


# 2) Distribute remaining unassigned books evenly
if unassigned_book_ids:
    genre_ids_sorted = sorted(current_counts.keys(), key=lambda g: current_counts[g])
    gi = 0
    for book_id in unassigned_book_ids:
        gid = genre_ids_sorted[gi % len(genre_ids_sorted)]
        assigned[book_id] = gid
        current_counts[gid] += 1
        gi += 1

print("Final genre counts after full assignment:", current_counts)


# ---------- WRITE ASSIGNMENTS BACK TO DB ----------
print(f"Writing {len(assigned)} GenreID assignments to Books...")

for book_id, gid in assigned.items():
    cursor.execute(
        "UPDATE Books SET GenreID = ? WHERE BookID = ?;",
        gid, book_id
    )

conn.commit()
conn.close()

print("Done. All NULL GenreID books have been assigned.")

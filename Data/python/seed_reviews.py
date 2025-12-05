import pyodbc
import random
from datetime import datetime, timedelta

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


# ---------- LOAD BOOKS + GENRES + AUTHORS ----------

cursor.execute("""
    SELECT 
        b.BookID,
        b.Title,
        g.Name      AS GenreName,
        a.FirstName AS AuthorFirst,
        a.LastName  AS AuthorLast
    FROM Books b
    LEFT JOIN Genres g  ON g.GenreID  = b.GenreID
    LEFT JOIN Authors a ON a.AuthorID = b.AuthorID;
""")
books = cursor.fetchall()
print(f"Loaded {len(books)} books.")


# ---------- LOAD EXISTING USER IDs ----------

cursor.execute("SELECT UserID FROM Users;")
user_rows = cursor.fetchall()
user_ids = [r.UserID for r in user_rows]

if not user_ids:
    conn.close()
    raise RuntimeError("No users found in Users table; cannot assign UserID in reviews.")

print(f"Loaded {len(user_ids)} users for assigning reviews.")


# ---------- HELPER FUNCTIONS ----------

def pick_rating():
    """
    Skew toward 3–5 stars:
    5: 35%
    4: 35%
    3: 20%
    2: 8%
    1: 2%
    """
    r = random.random()
    if r < 0.02:
        return 1
    elif r < 0.10:
        return 2
    elif r < 0.30:
        return 3
    elif r < 0.65:
        return 4
    else:
        return 5


def random_past_date(years_back=5):
    """Random datetime within the last `years_back` years."""
    now = datetime.now()
    days_back = random.randint(0, years_back * 365)
    return now - timedelta(days=days_back, seconds=random.randint(0, 86400))


def short_genre_blurb(genre, rating, title):
    g = (genre or "").lower()
    stars = "★" * rating + "☆" * (5 - rating)

    # Base opening depending on rating
    if rating >= 5:
        intro = f"{stars} Absolutely loved \"{title}\"."
    elif rating == 4:
        intro = f"{stars} \"{title}\" was a really solid read."
    elif rating == 3:
        intro = f"{stars} \"{title}\" was decent overall."
    elif rating == 2:
        intro = f"{stars} I struggled with parts of \"{title}\"."
    else:
        intro = f"{stars} \"{title}\" didn’t really work for me."

    # Genre-specific sentence
    if "fantasy" in g:
        middle = (
            " The world-building and magic system stood out the most, "
            "and the story leans heavily on atmosphere and character moments."
        )
    elif "science fiction" in g:
        middle = (
            " I liked the way it used future tech and big ideas to raise questions "
            "about people, responsibility, and what progress actually costs."
        )
    elif "horror" in g:
        middle = (
            " The tension builds slowly, and a lot of the horror comes from small, "
            "unsettling details rather than just jump scares."
        )
    elif "mystery" in g:
        middle = (
            " The mystery kept me guessing, with clues and misdirection that made "
            "the payoff feel earned by the end."
        )
    elif "romance" in g:
        middle = (
            " The romance is more about the characters learning to be honest and vulnerable "
            "than just big dramatic gestures."
        )
    elif "non-fiction" in g or "nonfiction" in g:
        middle = (
            " The ideas are presented in a clear way, with enough real examples to make "
            "the concepts feel practical and grounded."
        )
    else:
        middle = (
            " The writing focuses a lot on the characters and the small choices that quietly "
            "change the direction of their lives."
        )

    # Closing sentence depends on rating
    if rating >= 4:
        closing = (
            " I would definitely recommend it, especially to readers who like taking their time "
            "with a story and noticing the little details."
        )
    elif rating == 3:
        closing = (
            " I don’t think it will be everyone’s favorite, but there are enough strong moments "
            "that I’m glad I picked it up."
        )
    elif rating == 2:
        closing = (
            " There were a few interesting ideas, but the pacing and some character decisions "
            "made it hard for me to fully connect with it."
        )
    else:
        closing = (
            " For me it just didn’t click, but someone who connects more with the style and pacing "
            "might have a totally different experience."
        )

    return intro + middle + closing


# ---------- SEED REVIEWS ----------

# Optional: only seed if Reviews is empty
cursor.execute("SELECT COUNT(*) FROM Reviews;")
existing_count = cursor.fetchone()[0]
print(f"Existing reviews in table: {existing_count}")

if existing_count > 0:
    print("Warning: Reviews table is not empty. "
          "You may want to DELETE FROM Comments; and DELETE FROM Reviews; before seeding.")
    # If you want to hard-stop when there are already reviews, uncomment:
    # conn.close()
    # raise SystemExit

inserted = 0

for book in books:
    book_id = book.BookID
    title = book.Title or "this book"
    genre = book.GenreName or ""

    # Max reviews per book cannot exceed number of users
    max_reviews_for_book = min(5, len(user_ids))

    # How many reviews for this book?
    num_reviews = random.randint(1, max_reviews_for_book)

    # Pick DISTINCT users for this book (avoids violating UNIQUE (UserID, BookID))
    review_users = random.sample(user_ids, num_reviews)

    for user_id in review_users:
        rating = pick_rating()
        review_text = short_genre_blurb(genre, rating, title)
        review_date = random_past_date(5)

        cursor.execute("""
            INSERT INTO Reviews (BookID, UserID, Rating, Content, ReviewDate)
            VALUES (?, ?, ?, ?, ?);
        """, book_id, user_id, rating, review_text, review_date)

        inserted += 1

conn.commit()
conn.close()

print(f"Done. Inserted {inserted} reviews.")

import pandas as pd
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
CSV_PATH = BASE_DIR / "data" / "books.csv"
CURATED_PATH = BASE_DIR / "data" / "books_curated.csv"

print(f"Loading full CSV from: {CSV_PATH}")

df = pd.read_csv(
    CSV_PATH,
    sep=";",
    encoding="latin-1",
    on_bad_lines="skip",
    dtype=str
)

# Normalize column names like before
df = df.rename(
    columns={
        "Book-Title": "BookTitle",
        "Book-Author": "BookAuthor",
        "Year-Of-Publication": "YearOfPublication",
        "Image-URL-S": "ImageUrlS",
        "Image-URL-M": "ImageUrlM",
        "Image-URL-L": "ImageUrlL",
    }
)

# Clean up basic stuff
df["BookAuthor"] = df["BookAuthor"].fillna("").str.strip()
df["BookTitle"] = df["BookTitle"].fillna("").str.strip()
df["ISBN"] = df["ISBN"].fillna("").str.strip()

# Drop clearly useless rows
df = df[
    (df["BookAuthor"] != "") &
    (df["BookTitle"] != "") &
    (df["ISBN"] != "")
]

print(f"Total usable rows after cleanup: {len(df)}")

# Count books per author
author_counts = df["BookAuthor"].value_counts()
eligible_authors = author_counts[author_counts >= 5]

print(f"Authors with at least 5 books: {len(eligible_authors)}")

# Choose up to 100 authors with the most books
TOP_N_AUTHORS = 100
selected_authors = eligible_authors.head(TOP_N_AUTHORS).index.tolist()

print(f"Selected {len(selected_authors)} authors for curated dataset.")

curated_df = df[df["BookAuthor"].isin(selected_authors)].copy()

print(f"Curated rows (books for those authors): {len(curated_df)}")

# Optionally limit max books per author (e.g., 15) to keep size reasonable
MAX_BOOKS_PER_AUTHOR = 8

curated_limited = (
    curated_df
    .groupby("BookAuthor", group_keys=False)
    .head(MAX_BOOKS_PER_AUTHOR)
)

print(f"Curated rows after capping at {MAX_BOOKS_PER_AUTHOR} per author: {len(curated_limited)}")

curated_limited.to_csv(CURATED_PATH, index=False)
print(f"Saved curated dataset to: {CURATED_PATH}")

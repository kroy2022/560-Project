import pandas as pd
import pyodbc

# ---------- CONFIG ----------
CSV_PATH = "../data/books_curated.csv"
N_BOOKS = 500  # how many books you want to import (you can change this)
# ----------------------------

print("Loading CSV...")
df = pd.read_csv(
    CSV_PATH,
#    sep=";",              # IMPORTANT: semicolon-separated
    encoding="latin-1",
    on_bad_lines="skip"   # skip any truly messed up lines
)

print("Columns in CSV:", list(df.columns))


# Keep only the columns we care about
expected_cols = [
    "ISBN",
    "BookTitle",
    "BookAuthor",
    "YearOfPublication",
    "Publisher",
    "ImageUrlS",
    "ImageUrlM",
    "ImageUrlL"
]

missing = [c for c in expected_cols if c not in df.columns]
if missing:
    raise ValueError(f"Missing expected columns in CSV: {missing}")

# Rename to match SQL table columns
df = df.rename(columns={
    "ISBN": "ISBN",
    "Book-Title": "BookTitle",
    "Book-Author": "BookAuthor",
    "Year-Of-Publication": "YearOfPublication",
    "Publisher": "Publisher",
    "Image-URL-S": "ImageUrlS",
    "Image-URL-M": "ImageUrlM",
    "Image-URL-L": "ImageUrlL"
   # "Book id": "BookIdOriginal"
})

# Coerce YearOfPublication to numeric (INT) with nulls allowed
df["YearOfPublication"] = pd.to_numeric(df["YearOfPublication"], errors="coerce")

# Take a random sample of N_BOOKS rows so we don't import all 270k
#df_sample = df.sample(n=min(N_BOOKS, len(df)), random_state=42).reset_index(drop=True)
df_sample = df

print(f"Full CSV rows: {len(df)}")
print(f"Sampled rows to import later: {len(df_sample)}")
print("Sample of the data:")
print(df_sample.head())

# ---------- INSERT SAMPLE INTO KaggleBooksRaw ----------

conn_str = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=mssql.cs.ksu.edu;"
    "DATABASE=cis560_f25_team11;"
    "UID=aayushrai;"
    "PWD=!nsecurepassw0rd;"
    "Encrypt=no;"
)

print("\nConnecting to SQL Server to insert data...")
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

insert_sql = """
    INSERT INTO dbo.KaggleBooksRaw
        (ISBN, BookTitle, BookAuthor, YearOfPublication,
         Publisher, ImageUrlS, ImageUrlM, ImageUrlL)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
"""

rows_inserted = 0

for _, row in df_sample.iterrows():
    cursor.execute(
        insert_sql,
        row["ISBN"],
        row["BookTitle"],
        row["BookAuthor"],
        int(row["YearOfPublication"]) if pd.notna(row["YearOfPublication"]) else None,
        row["Publisher"],
        row["ImageUrlS"],
        row["ImageUrlM"],
        row["ImageUrlL"]
    )
    rows_inserted += 1

conn.commit()
conn.close()

print(f"Done. Inserted {rows_inserted} rows into dbo.KaggleBooksRaw.")


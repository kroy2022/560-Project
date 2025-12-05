import pyodbc
import requests
import time
from io import BytesIO
from PIL import Image

# ---------- CONFIG ----------
# IMPORTANT: use a DIRECT image URL (ending in .jpg/.png), ideally something you host.
PLACEHOLDER_URL = "https://your-cdn-or-static-site.com/book-placeholder.jpg"

conn_str = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=mssql.cs.ksu.edu;"
    "DATABASE=cis560_f25_team11;"
    "UID=aayushrai;"
    "PWD=!nsecurepassw0rd;"   
    "Encrypt=no;"
)

# ---------- HELPERS ----------

def is_good_image(url):
    """Return True if URL looks like a real, non-tiny image."""
    if not url:
        return False

    try:
        resp = requests.get(url, timeout=6, allow_redirects=True)
        if resp.status_code != 200:
            return False

        content_type = resp.headers.get("Content-Type", "").lower()
        if "image" not in content_type:
            return False

        # Optional: filter out very tiny files by size
        content_len = resp.headers.get("Content-Length")
        if content_len is not None:
            try:
                if int(content_len) < 3000:  # < 3 KB = probably junk
                    return False
            except ValueError:
                pass

        img = Image.open(BytesIO(resp.content))
        w, h = img.size

        # Filter out clearly tiny/placeholder images
        if w < 120 or h < 120:
            return False

        return True
    except Exception:
        return False


def open_library_url(isbn):
    return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"


# ---------- MAIN ----------

conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

cursor.execute("""
    SELECT BookID, ISBN, CoverImage
    FROM Books
    WHERE ISBN IS NOT NULL
      AND LTRIM(RTRIM(ISBN)) <> ''
""")

rows = cursor.fetchall()
print(f"Found {len(rows)} books with ISBN to validate.")

kept = 0
replaced_with_openlib = 0
set_placeholder = 0

for book_id, isbn, cover in rows:
    isbn = (isbn or "").strip()
    cover = (cover or "").strip()

    if not isbn:
        continue

    # 1) Check current CoverImage if present
    has_good_cover = False
    if cover:
        if is_good_image(cover):
            kept += 1
            has_good_cover = True

    # 2) If no good current cover, try Open Library
    new_cover = None
    if not has_good_cover:
        ol_url = open_library_url(isbn)
        if is_good_image(ol_url):
            new_cover = ol_url
            replaced_with_openlib += 1
            has_good_cover = True

    # 3) If still no good cover, use placeholder
    if not has_good_cover:
        new_cover = PLACEHOLDER_URL
        set_placeholder += 1

    # 4) Write back if we changed something
    if new_cover is not None and new_cover != cover:
        cursor.execute(
            "UPDATE Books SET CoverImage = ? WHERE BookID = ?;",
            new_cover, book_id
        )

    # Be polite to remote servers
    time.sleep(0.1)

conn.commit()
conn.close()

print("Done validating covers.")
print(f"Kept existing cover for {kept} books.")
print(f"Replaced with Open Library cover for {replaced_with_openlib} books.")
print(f"Set placeholder cover for {set_placeholder} books.")

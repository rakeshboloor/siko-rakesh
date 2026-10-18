import sqlite3

conn = sqlite3.connect('siko.db')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [t[0] for t in cursor.fetchall()]
print(f"Total tables: {len(tables)}")
for t in tables:
    try:
        count = cursor.execute(f'SELECT COUNT(1) FROM "{t}"').fetchone()[0]
        print(f"  - {t}: {count} rows")
    except Exception as e:
        print(f"  - {t}: error {e}")
conn.close()

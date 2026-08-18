from flask import Flask, jsonify, send_from_directory, request
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "visit_counter.db"
STATIC_DIR = BASE_DIR  # 你的 index.html、assets、site.js、style.css 所在目录

app = Flask(__name__, static_folder=str(STATIC_DIR), static_url_path="")

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS counters (
            name TEXT PRIMARY KEY,
            value INTEGER NOT NULL DEFAULT 0
        )
    """)
    cur.execute("""
        INSERT OR IGNORE INTO counters (name, value)
        VALUES ('site_pv', 0)
    """)
    conn.commit()
    conn.close()

@app.route("/api/visit-count", methods=["GET"])
def get_visit_count():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT value FROM counters WHERE name = 'site_pv'")
    row = cur.fetchone()
    conn.close()
    value = row["value"] if row else 0
    return jsonify({"count": value})

@app.route("/api/visit-count/increment", methods=["POST"])
def increment_visit_count():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("BEGIN IMMEDIATE")
    cur.execute("""
        UPDATE counters
        SET value = value + 1
        WHERE name = 'site_pv'
    """)
    cur.execute("SELECT value FROM counters WHERE name = 'site_pv'")
    row = cur.fetchone()
    conn.commit()
    conn.close()
    return jsonify({"count": row["value"]})

@app.route("/")
def root():
    return send_from_directory(STATIC_DIR, "index.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(STATIC_DIR, path)

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
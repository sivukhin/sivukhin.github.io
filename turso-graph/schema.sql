CREATE TABLE IF NOT EXISTS points (
    id TEXT PRIMARY KEY,
    x REAL,
    y REAL,
    color TEXT,
    size REAL
);

CREATE TABLE IF NOT EXISTS edges (
    id TEXT PRIMARY KEY,
    a TEXT,
    b TEXT
)
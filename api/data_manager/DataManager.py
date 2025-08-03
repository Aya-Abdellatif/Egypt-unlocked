import sqlite3


class DataManager:
    def __init__(self, database_name: str):
        self.database_name = database_name
        self.conn = sqlite3.connect(f"{database_name}.db")
        self.conn.row_factory = sqlite3.Row

        # Create the database if not already created
        cursor = self.conn.cursor()

        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                score INTEGER NOT NULL DEFAULT 0,
            )
        """)        

        # Create visited places table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS visited_places (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                place_name TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

    def get_visited_places(self, user_id: int):
        self.conn.cursor.execute("""
            SELECT *
            FROM visited_places
            WHERE user_id = ?
        """, (user_id,))

        rows = self.conn.cursor.fetchall()
        return rows
    
    def increment_user_score(self, user_id: int, score: int):
        """
        Increments the value of `score` for the user with id `user_id`
        """

        self.conn.cursor.execute("""
            UPDATE users
            SET score = score + ?
            WHERE id = ?
        """, (score, user_id))

    def add_new_user(self, username: str, password: str):
        self.conn.cursor.execute("""
            INSERT INTO users(username, password) VALUES(?, ?)
        """, (username, password))
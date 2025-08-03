import sqlite3
import bcrypt

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
                score INTEGER NOT NULL DEFAULT 0
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

    def _hash_password(self, password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    def _verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

    def get_visited_places(self, user_id: int):
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT *
            FROM visited_places
            WHERE user_id = ?
        """, (user_id,))

        rows = cursor.fetchall()
        return rows
    
    def increment_user_score(self, user_id: int, score: int):
        """
        Increments the value of `score` for the user with id `user_id`
        """
        cursor = self.conn.cursor()
        cursor.execute("""
            UPDATE users
            SET score = score + ?
            WHERE id = ?
        """, (score, user_id))
        self.conn.commit()

    def add_new_user(self, username: str, password: str):
        """Add a new user with hashed password"""
        hashed_password = self._hash_password(password)
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO users(username, password) VALUES(?, ?)
        """, (username, hashed_password))
        self.conn.commit()
    
    def verify_user_credentials(self, username: str, password: str) -> bool:
        """Verify user credentials by checking username and password hash"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT password FROM users WHERE username = ?
        """, (username,))
        
        result = cursor.fetchone()
        if result:
            stored_hash = result['password']
            return self._verify_password(password, stored_hash)
        return False
    
    def get_user_by_username(self, username: str):
        """Get user information by username"""
        cursor = self.conn.cursor()
        cursor.execute("""
            SELECT id, username, score FROM users WHERE username = ?
        """, (username,))
        return cursor.fetchone()
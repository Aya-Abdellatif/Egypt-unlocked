import sqlite3
import bcrypt
from typing import Optional


class DataManager:
    def __init__(self, database_name: str):
        """Initialize the data manager, connect to the SQLite database, and ensure required tables exist.

        Args:
            database_name (str): Base name of the database ('.db' is appended).
        """
        self.database_name = database_name
        conn = self._get_conn()

        # Enable foreign key constraints (needed for ON DELETE CASCADE to work)
        conn.execute("PRAGMA foreign_keys = ON")

        # Create the database if not already created
        cursor = conn.cursor()

        # Create users table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                score INTEGER NOT NULL DEFAULT 0
            )
        """
        )

        # Create visited places table
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS visited_places (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                place_name TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """
        )

        conn.commit()

    def _hash_password(self, password: str) -> str:
        """Hash a plain-text password using bcrypt.

        Args:
            password (str): The plain-text password to hash.

        Returns:
            str: The bcrypt hashed password, decoded to a UTF-8 string.
        """
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed.decode("utf-8")

    def _verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify a plain-text password against a stored bcrypt hash.

        Args:
            password (str): The plain-text password provided by the user.
            hashed_password (str): The stored bcrypt hash to verify against.

        Returns:
            bool: True if the password matches the hash, False otherwise.
        """
        return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

    def get_visited_places(self, user_id: int) -> list[sqlite3.Row]:
        """Retrieve all visited places for a given user.

        Args:
            user_id (int): ID of the user.

        Returns:
            list[sqlite3.Row]: List of rows representing visited places.
        """
        cursor = self._get_conn()
        cursor.execute(
            """
            SELECT *
            FROM visited_places
            WHERE user_id = ?
        """,
            (user_id,),
        )

        rows = cursor.fetchall()
        return rows

    def increment_user_score(self, user_id: int, score: int) -> None:
        """Increment the score for a specific user.

        Args:
            user_id (int): ID of the user whose score will be incremented.
            score (int): Amount to add to the existing score.
        """
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE users
            SET score = score + ?
            WHERE id = ?
        """,
            (score, user_id),
        )
        conn.commit()

    def add_new_user(self, username: str, password: str) -> None:
        """Add a new user to the database with a hashed password.

        Args:
            username (str): Desired username (must be unique).
            password (str): Plain-text password to hash and store.
        """
        hashed_password = self._hash_password(password)
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO users(username, password) VALUES(?, ?)
        """,
            (username, hashed_password),
        )
        self.conn.commit()

    def verify_user_credentials(self, username: str, password: str) -> bool:
        """Check if given username and password match a stored user.

        Args:
            username (str): Username to look up.
            password (str): Plain-text password to verify.

        Returns:
            bool: True if credentials are valid, False otherwise.
        """
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT password FROM users WHERE username = ?
        """,
            (username,),
        )

        result = cursor.fetchone()
        if result:
            stored_hash = result["password"]
            return self._verify_password(password, stored_hash)
        return False

    def get_user_by_username(self, username: str) -> Optional[sqlite3.Row]:
        """Fetch user information (excluding password) by username.

        Args:
            username (str): Username to query.

        Returns:
            Optional[sqlite3.Row]: Row containing id, username, and score if found; otherwise None.
        """
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT id, username, score FROM users WHERE username = ?
        """,
            (username,),
        )
        return cursor.fetchone()

    def get_leaderboard(self) -> list[sqlite3.Row]:
        """Retrieve all users ordered by descending score.

        Returns:
            list[sqlite3.Row]: List of username and score pairs sorted highest first.
        """
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT username, score
            FROM users
            ORDER BY score DESC
        """,
        )

        rows = cursor.fetchall()
        return rows

    def _get_conn(self) -> sqlite3.Connection:
        """Create and return a new SQLite database connection.
        The connection uses `sqlite3.Row` as the row factory to allow
        accessing columns by name.

        Returns:
            sqlite3.Connection: A new connection to the database.
        """
        conn = sqlite3.connect(f"{self.database_name}.db")
        conn.row_factory = sqlite3.Row
        return conn

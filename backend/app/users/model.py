from datetime import datetime

from app.extensions import bcrypt, db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        nullable=False,
        default="client"
    )

    created_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    def set_password(self, password):
        """Hash and store the user's password."""
        self.password_hash = (
            bcrypt
            .generate_password_hash(password)
            .decode("utf-8")
        )

    def check_password(self, password):
        """Check a plain-text password against the stored hash."""
        return bcrypt.check_password_hash(
            self.password_hash,
            password
        )

    def __repr__(self):
        return f"<User {self.email}>"
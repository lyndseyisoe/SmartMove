"""add password reset tokens

Revision ID: e46b8c0d3a71
Revises: d35f7a9e1b62
"""
from alembic import op
import sqlalchemy as sa

revision = "e46b8c0d3a71"
down_revision = "d35f7a9e1b62"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table("password_reset_tokens", sa.Column("id", sa.Integer(), nullable=False), sa.Column("user_id", sa.Integer(), nullable=False), sa.Column("token_hash", sa.String(length=128), nullable=False), sa.Column("expires_at", sa.DateTime(), nullable=False), sa.Column("used_at", sa.DateTime(), nullable=True), sa.Column("created_at", sa.DateTime(), nullable=False), sa.PrimaryKeyConstraint("id"))
    op.create_index("ix_password_reset_tokens_user_id", "password_reset_tokens", ["user_id"])
    op.create_index("ix_password_reset_tokens_token_hash", "password_reset_tokens", ["token_hash"], unique=True)


def downgrade():
    op.drop_index("ix_password_reset_tokens_token_hash", table_name="password_reset_tokens")
    op.drop_index("ix_password_reset_tokens_user_id", table_name="password_reset_tokens")
    op.drop_table("password_reset_tokens")

"""create messages table

Revision ID: 9a2c1d4e7b10
Revises: 7832194f63f3
"""

from alembic import op
import sqlalchemy as sa


revision = "9a2c1d4e7b10"
down_revision = "7832194f63f3"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "messages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("booking_id", sa.Integer(), nullable=False),
        sa.Column("sender_id", sa.Integer(), nullable=False),
        sa.Column("recipient_id", sa.Integer(), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("read_at", sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_messages_booking_id", "messages", ["booking_id"])
    op.create_index("ix_messages_sender_id", "messages", ["sender_id"])
    op.create_index("ix_messages_recipient_id", "messages", ["recipient_id"])


def downgrade():
    op.drop_index("ix_messages_recipient_id", table_name="messages")
    op.drop_index("ix_messages_sender_id", table_name="messages")
    op.drop_index("ix_messages_booking_id", table_name="messages")
    op.drop_table("messages")

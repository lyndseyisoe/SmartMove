"""store quote inputs on bookings

Revision ID: d35f7a9e1b62
Revises: c24e6b9f8a51
"""
from alembic import op
import sqlalchemy as sa

revision = "d35f7a9e1b62"
down_revision = "c24e6b9f8a51"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("bookings") as batch_op:
        batch_op.add_column(sa.Column("quote_distance_km", sa.Float(), nullable=True))
        batch_op.add_column(sa.Column("estimated_hours", sa.Float(), nullable=True))
        batch_op.add_column(sa.Column("item_count", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("floor_number", sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column("has_elevator", sa.Boolean(), nullable=True))


def downgrade():
    with op.batch_alter_table("bookings") as batch_op:
        batch_op.drop_column("has_elevator")
        batch_op.drop_column("floor_number")
        batch_op.drop_column("item_count")
        batch_op.drop_column("estimated_hours")
        batch_op.drop_column("quote_distance_km")

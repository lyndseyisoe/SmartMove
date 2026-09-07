"""add mover profile and pricing fields

Revision ID: b13f5a8d2c44
Revises: 9a2c1d4e7b10
"""

from alembic import op
import sqlalchemy as sa


revision = "b13f5a8d2c44"
down_revision = "9a2c1d4e7b10"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("users") as batch_op:
        batch_op.add_column(sa.Column("company_name", sa.String(length=120), nullable=True))
        batch_op.add_column(sa.Column("phone", sa.String(length=40), nullable=True))
        batch_op.add_column(sa.Column("bio", sa.Text(), nullable=True))
        batch_op.add_column(sa.Column("service_area", sa.String(length=160), nullable=True))
        batch_op.add_column(sa.Column("pricing_type", sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column("price_per_hour", sa.Numeric(10, 2), nullable=True))
        batch_op.add_column(sa.Column("price_per_distance", sa.Numeric(10, 2), nullable=True))


def downgrade():
    with op.batch_alter_table("users") as batch_op:
        batch_op.drop_column("price_per_distance")
        batch_op.drop_column("price_per_hour")
        batch_op.drop_column("pricing_type")
        batch_op.drop_column("service_area")
        batch_op.drop_column("bio")
        batch_op.drop_column("phone")
        batch_op.drop_column("company_name")

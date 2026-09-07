"""add booking amounts and payments

Revision ID: c24e6b9f8a51
Revises: b13f5a8d2c44
"""
from alembic import op
import sqlalchemy as sa

revision = "c24e6b9f8a51"
down_revision = "b13f5a8d2c44"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("bookings") as batch_op:
        batch_op.add_column(sa.Column("quoted_amount", sa.Numeric(10, 2), nullable=True))
    op.create_table("payments", sa.Column("id", sa.Integer(), nullable=False), sa.Column("booking_id", sa.Integer(), nullable=False), sa.Column("user_id", sa.Integer(), nullable=False), sa.Column("phone_number", sa.String(length=20), nullable=False), sa.Column("amount", sa.Numeric(10, 2), nullable=False), sa.Column("checkout_request_id", sa.String(length=100), nullable=True), sa.Column("merchant_request_id", sa.String(length=100), nullable=True), sa.Column("receipt_number", sa.String(length=100), nullable=True), sa.Column("status", sa.String(length=20), nullable=False), sa.Column("result_code", sa.Integer(), nullable=True), sa.Column("result_description", sa.String(length=255), nullable=True), sa.Column("created_at", sa.DateTime(), nullable=False), sa.Column("updated_at", sa.DateTime(), nullable=False), sa.PrimaryKeyConstraint("id"))
    op.create_index("ix_payments_booking_id", "payments", ["booking_id"])
    op.create_index("ix_payments_user_id", "payments", ["user_id"])
    op.create_index("uq_payments_checkout_request_id", "payments", ["checkout_request_id"], unique=True)


def downgrade():
    op.drop_index("uq_payments_checkout_request_id", table_name="payments")
    op.drop_index("ix_payments_user_id", table_name="payments")
    op.drop_index("ix_payments_booking_id", table_name="payments")
    op.drop_table("payments")
    with op.batch_alter_table("bookings") as batch_op:
        batch_op.drop_column("quoted_amount")

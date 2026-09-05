"""add mover approval status

Revision ID: 49662b13e0ea
Revises: 7c5d77ad8826
Create Date: 2026-09-05 09:46:27.549269

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '49662b13e0ea'
down_revision = '7c5d77ad8826'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                'mover_approval_status',
                sa.VARCHAR(length=20),
                nullable=False,
                server_default='pending'
            )
        )
        batch_op.alter_column('mover_approval_status', server_default=None)


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('mover_approval_status')

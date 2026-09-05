"""remove obsolete mover approval status

Revision ID: edd1800c12e0
Revises: 7c5d77ad8826
Create Date: 2026-09-05 09:46:27.549269

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'edd1800c12e0'
down_revision = '49662b13e0ea'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('mover_approval_status')


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column(
                'mover_approval_status',
                sa.VARCHAR(length=20),
                autoincrement=False,
                nullable=False
            )
        )

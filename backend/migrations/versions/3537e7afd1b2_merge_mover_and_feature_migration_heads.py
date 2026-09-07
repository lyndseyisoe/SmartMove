"""merge mover and feature migration heads

Revision ID: 3537e7afd1b2
Revises: 2b797757badf, dd5ec7f9e34c
Create Date: 2026-09-01 22:17:18.237581

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3537e7afd1b2'
down_revision = ('2b797757badf', 'dd5ec7f9e34c')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass

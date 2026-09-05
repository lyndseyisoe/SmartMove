"""add mover approval status, reviews, and notifications

Revision ID: 7c5d77ad8826
Revises: 3537e7afd1b2
Create Date: 2026-09-04 06:03:59.694408

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7c5d77ad8826'
down_revision = '3537e7afd1b2'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('notifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('type', sa.String(length=40), nullable=False),
    sa.Column('title', sa.String(length=150), nullable=False),
    sa.Column('body', sa.Text(), nullable=True),
    sa.Column('booking_id', sa.Integer(), nullable=True),
    sa.Column('read_at', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_notifications_booking_id'), ['booking_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_notifications_created_at'), ['created_at'], unique=False)
        batch_op.create_index(batch_op.f('ix_notifications_user_id'), ['user_id'], unique=False)

    op.create_table('reviews',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('booking_id', sa.Integer(), nullable=False),
    sa.Column('client_id', sa.Integer(), nullable=False),
    sa.Column('mover_id', sa.Integer(), nullable=False),
    sa.Column('rating', sa.Integer(), nullable=False),
    sa.Column('comment', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.CheckConstraint('rating >= 1 AND rating <= 5', name='ck_reviews_rating_range'),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_reviews_booking_id'), ['booking_id'], unique=True)
        batch_op.create_index(batch_op.f('ix_reviews_client_id'), ['client_id'], unique=False)
        batch_op.create_index(batch_op.f('ix_reviews_mover_id'), ['mover_id'], unique=False)

    # server_default lets this apply cleanly against a database that
    # already has rows (existing accounts are grandfathered in as
    # approved); the default is dropped afterwards since the model
    # itself supplies "approved" for new rows going forward.
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(length=20), nullable=False, server_default='approved'))
        batch_op.add_column(sa.Column('rejection_reason', sa.String(length=255), nullable=True))

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('status', server_default=None)


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('rejection_reason')
        batch_op.drop_column('status')

    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_reviews_mover_id'))
        batch_op.drop_index(batch_op.f('ix_reviews_client_id'))
        batch_op.drop_index(batch_op.f('ix_reviews_booking_id'))

    op.drop_table('reviews')
    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_notifications_user_id'))
        batch_op.drop_index(batch_op.f('ix_notifications_created_at'))
        batch_op.drop_index(batch_op.f('ix_notifications_booking_id'))

    op.drop_table('notifications')

"""a1 auth tokens + token_version + role constraint

Revision ID: 5bac0e19f704
Revises: 739b3f298b03
Create Date: 2026-07-13

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5bac0e19f704'
down_revision: Union[str, None] = '739b3f298b03'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'auth_tokens',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('purpose', sa.String(length=20), nullable=False),
        sa.Column('token_hash', sa.String(length=64), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('used_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_auth_tokens_token_hash'), 'auth_tokens', ['token_hash'])
    op.create_index(op.f('ix_auth_tokens_user_id'), 'auth_tokens', ['user_id'])

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('token_version', sa.Integer(), nullable=False, server_default='0'))
        batch_op.create_check_constraint(
            'ck_users_role', "role IN ('employer', 'recruiter', 'candidate', 'admin')"
        )


def downgrade() -> None:
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('ck_users_role', type_='check')
        batch_op.drop_column('token_version')

    op.drop_index(op.f('ix_auth_tokens_user_id'), table_name='auth_tokens')
    op.drop_index(op.f('ix_auth_tokens_token_hash'), table_name='auth_tokens')
    op.drop_table('auth_tokens')

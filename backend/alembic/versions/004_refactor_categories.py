"""refactor categories

Revision ID: 004_refactor_categories
Revises: 003_category_images
Create Date: 2026-04-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '004_refactor_categories'
down_revision: Union[str, None] = '003_category_images'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.rename_table('categorias_imagens', 'categorias')

    with op.batch_alter_table('categorias') as batch_op:
        batch_op.alter_column('categoria', new_column_name='nome_categoria', existing_type=sa.String(100))

    with op.batch_alter_table('produtos') as batch_op:
        batch_op.create_foreign_key('fk_produto_categoria', 'categorias', ['categoria_produto'], ['nome_categoria'])

def downgrade() -> None:
    with op.batch_alter_table('produtos') as batch_op:
        batch_op.drop_constraint('fk_produto_categoria', type_='foreignkey')

    with op.batch_alter_table('categorias') as batch_op:
        batch_op.alter_column('nome_categoria', new_column_name='categoria', existing_type=sa.String(100))

    op.rename_table('categorias', 'categorias_imagens')
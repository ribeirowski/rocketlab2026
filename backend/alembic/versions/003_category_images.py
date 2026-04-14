"""add categorias_imagens table

Revision ID: 003_category_images
Revises: 828900b17b7b
Create Date: 2026-04-14

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "003_category_images"
down_revision: Union[str, None] = "828900b17b7b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        "categorias_imagens",
        sa.Column("categoria", sa.String(100), primary_key=True),
        sa.Column("url_imagem", sa.String(500), nullable=False),
    )

def downgrade() -> None:
    op.drop_table("categorias_imagens")
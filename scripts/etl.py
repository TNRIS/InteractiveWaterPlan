import sqlalchemy as sa

import db_config

mssql_connect_string = 'mssql+pymssql://{user}:{password}@{host}'.format(**db_config.__dict__)
mssql_engine = sa.create_engine(mssql_connect_string, connect_args={'database': db_config.db_name})
mssql_metadata = sa.MetaData(bind=mssql_engine)

sqlite_file = '../application/server/cache/cache.db'
sqlite_engine = sa.create_engine('sqlite:///' + sqlite_file)
sqlite_metadata = sa.MetaData(bind=sqlite_engine)

only_tables = [
    'EntityCoordinates',
    'vwMapEntityNeedsAsPctOfDemand',
    'vwMapEntitySummary',
    'vwMapExistingWugSupply',
    'vwMapWugDemand',
    'vwMapWugNeeds',
    'vwMapWugPopulation',
    'vwMapWugNeedsA1',
]


def _copy_column(column):
    copied = column.copy()
    if hasattr(copied.type, 'collation'):
        copied.type.collation = None
    return copied


mssql_metadata.reflect(only=only_tables, views=True)
for mssql_table in mssql_metadata.tables.values():
    # translate
    sqlite_columns = [_copy_column(col) for col in mssql_table.columns]
    sqlite_table = sa.Table(mssql_table.name, sqlite_metadata, *sqlite_columns)
    sqlite_table.create()
    # extract
    mssql_rows = mssql_engine.execute(mssql_table.select()).fetchall()
    # load
    sqlite_engine.execute(sqlite_table.insert(), mssql_rows)

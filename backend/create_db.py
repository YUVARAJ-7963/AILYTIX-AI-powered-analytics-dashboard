import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DB_NAME = 'ailytix'
DB_USER = 'postgres'
DB_PASSWORD = 'yuvar0890'
DB_HOST = 'localhost'
DB_PORT = 7963

def create_database_if_not_exists():
    con = psycopg2.connect(dbname='postgres', user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    cur.execute(f"SELECT 1 FROM pg_database WHERE datname='{DB_NAME}'")
    exists = cur.fetchone()
    if not exists:
        cur.execute(f'CREATE DATABASE {DB_NAME}')
        print(f"Database '{DB_NAME}' created.")
    else:
        print(f"Database '{DB_NAME}' already exists.")
    cur.close()
    con.close()

if __name__ == '__main__':
    create_database_if_not_exists() 
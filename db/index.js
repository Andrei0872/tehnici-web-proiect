import pg from 'pg';
const { Pool } = pg;

const REMOTE_DB_URL = process.env.REMOTE_DB_URL || process.env.DATABASE_URL;
const isRemoteDBUrlUsed = !!REMOTE_DB_URL;

const connConfig = !isRemoteDBUrlUsed 
  ? {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
  }
  : { connectionString: REMOTE_DB_URL, ssl: { rejectUnauthorized: false } };

export const init = async () => {
  const pool = new Pool(connConfig);

  try {
    const client = await pool.connect();

    console.log('[DB]: Successfully connected.');

    return client;
  } catch (err) {
    console.log(err.message);

    return null;
  }
};
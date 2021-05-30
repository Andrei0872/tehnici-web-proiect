import pg from 'pg';
const { Pool } = pg;

const connConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
};

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
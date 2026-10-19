import pg from 'pg';
import { config } from './config.js';

// Số nguyên 64-bit (messages.id, count(*)) trả về dạng chuỗi theo mặc định của `pg`.
pg.types.setTypeParser(20, (v) => Number(v));

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => console.error('[db] lỗi kết nối rảnh:', err.message));

export const query = (text, params) => pool.query(text, params);

/** Chạy hàm trong một transaction; tự COMMIT/ROLLBACK. */
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function checkDb() {
  await pool.query('SELECT 1');
}
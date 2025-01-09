/* eslint-disable no-undef */
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    connectionLimit: 10,
});

console.log('Database pool initialized');
console.log(pool);

// SHOW TABLES 쿼리 실행 및 출력
/*
pool.query('SHOW TABLES', (error, results, fields) => {
    if (error) {
        console.error('Error executing query:', error);
        return;
    }
    console.log('Tables in the database:', results);
});
*/'mysql2/promise'

export default pool;

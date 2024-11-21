import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/likes.json');

export async function getAllLikes() {
    try {
        const data = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('좋아요 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function getLikesStatus(postId, userId) {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query(
            `SELECT * FROM Likes WHERE postId = ? AND userId = ?;`,
            [postId, userId],
        );
        connection.release();
        return rows.length > 0;
    } catch (error) {
        console.error('좋아요 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postLike(postId, userId) {
    try {
        const connection = await pool.getConnection();
        await connection.query(
            `INSERT INTO Likes (postId, userId) VALUES (?, ?);`,
            [postId, userId],
        );
        connection.release();
    } catch (error) {
        console.error('좋아요 추가 에러: ', error);
        throw error;
    }
}

export async function deleteLike(postId, userId) {
    try {
        const connection = await pool.getConnection();
        await connection.query(
            `DELETE FROM Likes WHERE postId = ? AND userId = ?;`,
            [postId, userId],
        );
        connection.release();
    } catch (error) {
        console.error('좋아요 추가 에러: ', error);
        throw error;
    }
}

export async function writeLike(likes) {
    try {
        await fs.writeFile(dataPath, JSON.stringify(likes, null, 2));
    } catch (error) {
        console.error('좋아요 추가 도중 에러: ', error);
        throw error;
    }
}

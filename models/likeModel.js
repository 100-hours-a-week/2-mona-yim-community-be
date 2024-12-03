import pool from '../db.js';

export async function getLikesStatus(postId, userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const rows = await connection.query(
            `SELECT * FROM Likes WHERE postId = ? AND userId = ?;`,
            [postId, userId],
        );
        return rows.length > 0;
    } catch (error) {
        console.error('좋아요 데이터 읽는 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function postLike(postId, userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `INSERT IGNORE INTO Likes (postId, userId) VALUES (?, ?);`,
            [postId, userId],
        );
    } catch (error) {
        console.error('좋아요 추가 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function deleteLike(postId, userId) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `DELETE FROM Likes WHERE postId = ? AND userId = ?;`,
            [postId, userId],
        );
    } catch (error) {
        console.error('좋아요 삭제 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

import pool from '../db.js';

export async function getLikesStatus(postId, userId) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM Likes WHERE postId = ? AND userId = ?;`,
            [postId, userId],
        );
        return rows.length > 0;
    } catch (error) {
        console.error('좋아요 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postLike(postId, userId) {
    try {
        await pool.query(
            `INSERT IGNORE INTO Likes (postId, userId) VALUES (?, ?);`,
            [postId, userId],
        );
    } catch (error) {
        console.error('좋아요 추가 에러: ', error);
        throw error;
    }
}

export async function deleteLike(postId, userId) {
    try {
        await pool.query(
            `DELETE FROM Likes WHERE postId = ? AND userId = ?;`,
            [postId, userId],
        );
    } catch (error) {
        console.error('좋아요 삭제 에러: ', error);
        throw error;
    }
}

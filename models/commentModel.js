import pool from '../db.js';

export async function getCommentsById(postId) {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query(
            `SELECT * FROM Comments WHERE postId = ?;`,
            [postId],
        );
        connection.release();
        return rows;
    } catch (error) {
        console.error('댓글 Id별로 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postComment(userId, postId, commentData) {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query(
            `INSERT INTO Comments (postId, userId, time, content) VALUES (?, ?, ?, ?)`,
            [postId, userId, commentData.time, commentData.content],
        );
        connection.release();
        return rows;
    } catch (error) {
        console.error('댓글 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function patchComment(commentId, content) {
    try {
        const connection = await pool.getConnection();
        await connection.query(
            `UPDATE Comments SET content = ? WHERE commentId = ?;`,
            [content, commentId],
        );
        connection.release();
    } catch (error) {
        console.error('댓글 데이터 수정 도중 에러: ', error);
        throw error;
    }
}

export async function deleteComment(commentId) {
    try {
        const connection = await pool.getConnection();
        await connection.query(`DELETE FROM Comments WHERE commentId = ?;`, [
            commentId,
        ]);
        connection.release();
    } catch (error) {
        console.error('댓글 데이터 삭제 도중 에러: ', error);
        throw error;
    }
}

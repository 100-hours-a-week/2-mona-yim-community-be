import pool from '../db.js';

export async function getCommentsById(postId) {
    let connection;
    try {
        connection = await pool.getConnection();
        const rows = await connection.query(
            `SELECT * FROM Comments WHERE postId = ? ORDER BY commentId ASC;`,
            [postId],
        );
        return rows;
    } catch (error) {
        console.error('댓글 Id별로 읽는 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function postComment(userId, postId, commentData) {
    let connection;
    try {
        connection = await pool.getConnection();
        const rows = await connection.query(
            `INSERT INTO Comments (postId, userId, time, content) VALUES (?, ?, ?, ?)`,
            [postId, userId, commentData.time, commentData.content],
        );
        return rows;
    } catch (error) {
        console.error('댓글 데이터 읽는 도중 에러: ', error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function patchComment(commentId, content) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(
            `UPDATE Comments SET content = ? WHERE commentId = ?;`,
            [content, commentId],
        );
    } catch (error) {
        console.error('댓글 데이터 수정 도중 에러: ', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export async function deleteComment(commentId) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(`DELETE FROM Comments WHERE commentId = ?;`, [
            commentId,
        ]);
        connection.release();
    } catch (error) {
        console.error('댓글 데이터 삭제 도중 에러: ', error);
        throw error;
    } finally {
        connection.release();
    }
}

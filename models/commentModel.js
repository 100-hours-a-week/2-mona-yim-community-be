import pool from '../db.js';

export async function getCommentsById(postId) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM Comments WHERE postId = ? ORDER BY commentId ASC;`,
            [postId],
        );
        return rows;
    } catch (error) {
        console.error('댓글 Id별로 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function postComment(userId, postId, commentData) {
    try {
        const rows = await pool.query(
            `INSERT INTO Comments (postId, userId, time, content) VALUES (?, ?, ?, ?)`,
            [postId, userId, commentData.time, commentData.content],
        );
        return rows;
    } catch (error) {
        console.error('댓글 데이터 읽는 도중 에러: ', error);
        throw error;
    }
}

export async function patchComment(commentId, content) {
    try {
        await pool.query(
            `UPDATE Comments SET content = ? WHERE commentId = ?;`,
            [content, commentId],
        );
    } catch (error) {
        console.error('댓글 데이터 수정 도중 에러: ', error);
        throw error;
    }
}

export async function deleteComment(commentId) {
    try {
        await pool.query(`DELETE FROM Comments WHERE commentId = ?;`, [
            commentId,
        ]);
    } catch (error) {
        console.error('댓글 데이터 삭제 도중 에러: ', error);
        throw error;
    }
}

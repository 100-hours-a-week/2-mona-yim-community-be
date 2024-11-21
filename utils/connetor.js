import pool from '../db';

export const transaction = async (queries) => {
    let connection;
    try {
        // MariaDB 연결 가져오기
        connection = await pool.getConnection();

        // 트랜잭션 시작
        await connection.beginTransaction();

        // 쿼리 실행
        for (const { query, params } of queries) {
            await connection.query(query, params);
        }

        // 트랜잭션 커밋
        await connection.commit();
    } catch (err) {
        if (connection) await connection.rollback(); // 트랜잭션 롤백
        console.error('Transaction error:', err.message);
        throw new Error(err.message);
    } finally {
        if (connection) connection.release(); // 연결 해제
    }
};

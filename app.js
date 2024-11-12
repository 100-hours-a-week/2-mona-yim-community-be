import express from 'express';
import session from 'express-session';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(
    session({
        secret: 'your-secret-key', // 비밀 키 설정
        resave: false, // 세션이 수정되지 않은 경우 저장하지 않음
        saveUninitialized: true, // 초기화되지 않은 세션도 저장
        cookie: {
            secure: false, // HTTPS 환경에서만 사용 시 true로 설정
            httpOnly: true, // 클라이언트에서 쿠키에 접근할 수 없도록 설정 (보안 강화)
            maxAge: 24 * 60 * 60 * 1000, // 쿠키 만료 시간 (예: 24시간)
        },
    }),
);

app.use(postRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});

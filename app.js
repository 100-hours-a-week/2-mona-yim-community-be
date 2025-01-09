import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import path from 'path';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: 'http://43.201.75.102:4000', // 클라이언트 주소
        credentials: true, // 쿠키를 허용
    }),
);
app.use(express.json());
app.use(bodyParser.json());

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

app.use('/api', postRoutes);
app.use('/api', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});

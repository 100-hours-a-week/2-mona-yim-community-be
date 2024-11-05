import express from 'express';
import cors from 'cors';
import postRoutes from './routes/postRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', postRoutes);

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});

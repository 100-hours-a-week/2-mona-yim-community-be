import express from 'express';
import multer from 'multer';
import {
    getPosts,
    getPost,
    uploadPost,
    editPost,
    deletePost,
} from '../controllers/postController.js';
import {
    getComments,
    uploadComment,
    editComment,
    deleteComment,
} from '../controllers/commentController.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage });

const router = express.Router();

router.get('/posts', getPosts);
router.post('/posts', upload.single('postImage'), uploadPost);
router.get('/posts/:id', getPost);
router.patch('/posts/:id', upload.single('postImage'), editPost);
router.delete('/posts/:id', deletePost);

router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', uploadComment);
router.patch('/posts/:id/comments/:commentId', editComment);
router.delete('/posts/:id/comments/:commentId', deleteComment);

export default router;

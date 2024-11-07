import express from 'express';
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

const router = express.Router();

router.get('/posts', getPosts);
router.post('/posts', uploadPost);
router.get('/posts/:id', getPost);
router.patch('/posts/:id', editPost);
router.delete('/posts/:id', deletePost);

router.get('/posts/:id/comments', getComments);
router.post('/posts/:id/comments', uploadComment);
router.patch('/posts/:id/comments/:commentId', editComment);
router.delete('/posts/:id/comments/:commentId', deleteComment);

export default router;

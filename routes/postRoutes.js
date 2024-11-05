import express from 'express';
import { getPosts, getPost } from '../controllers/postController.js';
import { getComments } from '../controllers/commentsController.js';

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/:id', getPost);

router.get('/posts/:id/comments', getComments);

export default router;

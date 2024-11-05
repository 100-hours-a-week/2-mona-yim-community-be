import { getAllPosts, getPostById } from '../models/postModel.js';

export const getPosts = (req, res) => {
    const posts = getAllPosts();
    res.json(posts);
};

export const getPost = (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = getPostById(postId);

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
};

import { getAllPosts, getPostById, writePost } from '../models/postModel.js';

export const getPosts = async (req, res) => {
    const posts = await getAllPosts();
    res.status(200).json(posts);
};

export const getPost = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = await getPostById(postId);

    if (!post) {
        return res.status(404).json({ message: '게시물 상세 요청 실패' });
    }

    res.status(200).json(post);
};

export const uploadPost = async (req, res) => {
    const posts = await getAllPosts();
    const postData = req.body;
    const postId = posts.length > 0 ? posts[posts.length - 1].postId + 1 : 1;
    const newPostData = { postId, ...postData };
    posts.push(newPostData);
    if (!posts) return res.status(400).json({ message: '게시글 생성 실패' });

    writePost(posts);
    return res.status(201).json({ message: '게시글 생성 성공' });
};

export const editPost = async (req, res) => {
    const posts = await getAllPosts();
    const postId = parseInt(req.params.id, 10);
    const newPostData = req.body;
    const postIndex = posts.findIndex((post) => post.postId === postId);

    if (postIndex === -1) {
        return res.status(404).json({ message: '존재하지않는 게시글' });
    }

    posts[postIndex] = { ...posts[postIndex], ...newPostData };
    writePost(posts);

    return res.status(200).json({ message: '게시글 수정 성공' });
};

export const deletePost = async (req, res) => {
    const posts = await getAllPosts();
    const postId = parseInt(req.params.id, 10);
    const deletedPosts = posts.filter((post) => post.postId !== postId);
    if (posts.length === deletedPosts.length)
        return res.status(404).json({ message: '존재하지않는 게시글' });
    writePost(deletedPosts);
    return res.status(204).json({ message: '게시글 삭제 성공' });
};

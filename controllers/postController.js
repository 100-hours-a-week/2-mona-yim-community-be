import {
    getAllPosts,
    getPostById,
    writePost,
    deletePostImage,
} from '../models/postModel.js';
import { getUserById } from '../models/userModel.js';
import { deleteAllCommentByPostId } from './commentController.js';
import { deleteAllLikeByPostId } from './likeController.js';

export const getPosts = async (req, res) => {
    console.log(req.session.sessionId);
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
    const userId = await req.session.sessionId;
    const user = await getUserById(userId);
    const postData = req.body;
    postData.userId = user.userId;
    const postId = posts.length > 0 ? posts[posts.length - 1].postId + 1 : 1;
    const postImagePath = req.file ? req.file.filename : null;
    const newPostData = { postId, ...postData, postImage: postImagePath };
    posts.push(newPostData);
    await writePost(posts);
    return res.status(201).json({ message: '게시글 생성 성공' });
};

export const editPost = async (req, res) => {
    const posts = await getAllPosts();
    const userId = await req.session.sessionId;
    const postId = parseInt(req.params.id, 10);
    const newPostData = req.body;
    const postIndex = posts.findIndex((post) => post.postId === postId);
    if (postIndex === -1) {
        return res.status(404).json({ message: '존재하지않는 게시글' });
    }
    if (posts[postIndex].userId !== userId) {
        return res.status(400).json({ message: '게시글 수정 권한 없음' });
    }
    posts[postIndex] = { ...posts[postIndex], ...newPostData };
    if (req.file) {
        deletePostImage(posts[postIndex].postImage);
        posts[postIndex] = {
            ...posts[postIndex],
            postImage: req.file.filename,
        };
    }
    await writePost(posts);

    return res.status(200).json({ message: '게시글 수정 성공' });
};

export const deletePost = async (req, res) => {
    const posts = await getAllPosts();
    const postId = parseInt(req.params.id, 10);
    const post = posts.find((post) => post.postId === postId);
    deletePostImage(post.postImage);
    const deletedPosts = posts.filter((post) => post.postId !== postId);
    if (posts.length === deletedPosts.length)
        return res.status(404).json({ message: '존재하지않는 게시글' });
    await writePost(deletedPosts);
    await deleteAllCommentByPostId(postId);
    await deleteAllLikeByPostId(postId);
    return res.status(204).json({ message: '게시글 삭제 성공' });
};

export async function deleteAllPostByUserId(userId) {
    const posts = await getAllPosts();
    const postsByUserId = posts.filter((post) => post.userId === userId);
    postsByUserId.forEach((post) => {
        deleteAllCommentByPostId(post.postId);
        deleteAllLikeByPostId(post.postId);
    });
    const filteredPosts = posts.filter((post) => post.userId !== userId);
    writePost(filteredPosts);
}

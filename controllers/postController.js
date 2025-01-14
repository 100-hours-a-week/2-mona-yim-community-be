import {
    getAllPosts,
    getPostById,
    postPost,
    patchPost,
    deletePost,
} from '../models/postModel.js';

/**
 * 모든 게시글을 가져오는 함수
 */
export const getPosts = async (req, res) => {
    try {
        const posts = await getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching all posts:', error);
        res.status(500).json({
            message: '서버 오류: 게시글을 가져올 수 없습니다.',
        });
    }
};

/**
 * 특정 게시글을 가져오는 함수
 */
export const getPost = async (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
        return res
            .status(400)
            .json({ message: '유효하지 않은 게시글 ID입니다.' });
    }

    try {
        const post = await getPostById(postId);
        if (!post) {
            return res
                .status(404)
                .json({ message: '게시글이 존재하지 않습니다.' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(`Error fetching post with ID ${postId}:`, error);
        res.status(500).json({
            message: '서버 오류: 게시글을 가져올 수 없습니다.',
        });
    }
};

/**
 * 새로운 게시글을 업로드하는 함수
 */
export const uploadPost = async (req, res) => {
    const userId = req.session.sessionId;
    const postData = req.body;
    const postImagePath = req.body.postImage ? req.body.postImage : null;
    const newPostData = { ...postData, postImage: postImagePath };

    try {
        await postPost(userId, newPostData);
        res.status(201).json({ message: '게시글 생성 성공' });
    } catch (error) {
        console.error('Error uploading new post:', error);
        res.status(500).json({
            message: '서버 오류: 게시글을 생성할 수 없습니다.',
        });
    }
};

/**
 * 기존 게시글을 수정하는 함수
 */
export const editPost = async (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);
    const postData = req.body;
    const postImagePath = req.body.postImage ? req.body.postImage : null;
    const newPostData = { ...postData, postImage: postImagePath };

    if (isNaN(postId)) {
        return res
            .status(400)
            .json({ message: '유효하지 않은 게시글 ID입니다.' });
    }

    try {
        const updated = await patchPost(postId, newPostData);
        if (!updated) {
            return res
                .status(404)
                .json({ message: '게시글이 존재하지 않습니다.' });
        }
        res.status(200).json({ message: '게시글 수정 성공' });
    } catch (error) {
        console.error(`Error editing post with ID ${postId}:`, error);
        res.status(500).json({
            message: '서버 오류: 게시글을 수정할 수 없습니다.',
        });
    }
};

/**
 * 특정 게시글을 삭제하는 함수
 */
export const removePost = async (req, res) => {
    const { id } = req.params;
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
        return res
            .status(400)
            .json({ message: '유효하지 않은 게시글 ID입니다.' });
    }

    try {
        const deleted = await deletePost(postId);
        if (!deleted) {
            return res
                .status(404)
                .json({ message: '게시글이 존재하지 않습니다.' });
        }
        res.status(204).json({ message: '게시글 삭제 성공' });
    } catch (error) {
        console.error(`Error deleting post with ID ${postId}:`, error);
        res.status(500).json({
            message: '서버 오류: 게시글을 삭제할 수 없습니다.',
        });
    }
};

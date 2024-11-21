import {
    getAllPosts,
    getPostById,
    postPost,
    patchPost,
    deletePost,
} from '../models/postModel.js';

export const getPosts = async (req, res) => {
    // if (!req.session.sessionId)
    //     return res.status(401).json({ message: '로그인 필요' });
    const posts = await getAllPosts();
    res.status(200).json(posts);
};

export const getPost = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const post = await getPostById(postId);
    if (!post) {
        return res.status(404).json({ message: '리스소가 존재하지 않음' });
    }

    res.status(200).json(post);
};

export const uploadPost = async (req, res) => {
    const userId = 1;
    // const userId = await req.session.sessionId;
    const postData = await req.body;
    const postImagePath = req.file ? req.file.filename : null;
    const newPostData = { ...postData, postImage: postImagePath };
    postPost(userId, newPostData);
    return res.status(201).json({ message: '게시글 생성 성공' });
};

export const editPost = async (req, res) => {
    // const userId = await req.session.sessionId;
    const postId = parseInt(req.params.id, 10);
    const postData = req.body;
    const postImagePath = req.file ? req.file.filename : null;
    const newPostData = { ...postData, postImage: postImagePath };
    console.log(newPostData);
    await patchPost(postId, newPostData);

    // if (postIndex === -1) {
    //     return res.status(404).json({ message: '존재하지않는 게시글' });
    // }
    // if (posts[postIndex].userId !== userId) {
    //     return res.status(400).json({ message: '게시글 수정 권한 없음' });
    // }

    return res.status(200).json({ message: '게시글 수정 성공' });
};

export const removePost = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    await deletePost(postId);
    return res.status(204).json({ message: '게시글 삭제 성공' });
};

import {
    deleteComment,
    getCommentsById,
    patchComment,
    postComment,
} from '../models/commentModel.js';
import { editCommentCount } from '../models/postModel.js';

export const getComments = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const commentsById = await getCommentsById(postId);
    res.status(200).json(commentsById);
};

export const uploadComment = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.session.sessionId;
    const commentData = await req.body;
    await postComment(userId, postId, commentData);
    await editCommentCount(postId);
    return res.status(201).json({ message: '댓글 생성 성공' });
};

export const editComment = async (req, res) => {
    // const userId = req.session.sessionId;
    const commentId = parseInt(req.params.commentId, 10);
    const newCommentData = await req.body;
    await patchComment(commentId, newCommentData.content);
    // if (commentIndex === -1) {
    //     return res.status(404).json({ message: '존재하지않는 댓글' });
    // }
    // if (comments[commentIndex].userId !== userId) {
    //     return res.status(401).json({ message: '댓글 수정 권한 없음' });
    // }
    return res.status(200).json({ message: '댓글 수정 성공' });
};

export const removeComment = async (req, res) => {
    // const userId = req.session.sessionId;
    const postId = parseInt(req.params.id, 10);
    const commentId = parseInt(req.params.commentId, 10);
    deleteComment(commentId);
    // if (comments[commentIndex].userId !== userId) {
    //     return res.status(401).json({ message: '댓글 삭제 권한 없음' });
    // }
    // if (comments.length === deletedComments.length) {
    //     return res.status(404).json({ message: '존재하지않는 댓글' });
    // }
    await editCommentCount(postId);
    return res.status(204).json({ message: '댓글 삭제 성공' });
};

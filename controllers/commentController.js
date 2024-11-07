import { getAllComments, writeComment } from '../models/commentModel.js';

export const getComments = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const comments = await getAllComments();
    res.status(200).json(comments);
};

export const uploadComment = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const comments = await getAllComments();
    const commentData = req.body;
    const commentId =
        comments.length > 0 ? comments[comments.length - 1].commentId + 1 : 1;
    const newCommentData = { commentId, ...commentData };
    comments.push(newCommentData);
    if (!comments) return res.status(400).json({ message: '댓글 생성 실패' });
    writeComment(comments);
    return res.status(201).json({ message: '댓글 생성 성공' });
};

export const editComment = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const commentId = parseInt(req.params.commentId, 10);
    const comments = await getAllComments();
    const newCommentData = req.body;
    const commentIndex = comments.findIndex(
        (comment) => comment.commentId === commentId,
    );

    if (commentIndex === -1) {
        return res.status(404).json({ message: '존재하지않는 댓글' });
    }

    comments[commentIndex] = { ...comments[commentIndex], ...newCommentData };
    writeComment(comments);
    return res.status(200).json({ message: '댓글 수정 성공' });
};

export const deleteComment = async (req, res) => {
    const comments = await getAllComments();
    const postId = parseInt(req.params.id, 10);
    const commentId = parseInt(req.params.commentId, 10);
    const deletedComments = comments.filter(
        (comment) => comment.commentId !== commentId,
    );
    if (comments.length === deletedComments.length)
        return res.status(404).json({ message: '존재하지않는 댓글' });
    writeComment(deletedComments);
    return res.status(204).json({ message: '댓글 삭제 성공' });
};

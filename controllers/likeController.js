import { getAllLikes, writeLike } from '../models/likeModel.js';
import { editLikeCount } from '../models/postModel.js';

export const likeStatusPost = async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const likes = await getAllLikes();
    const userId = await req.session.sessionId;

    const isLiked = likes.some(
        (like) => like.postId === postId && like.userId === userId,
    );
    if (isLiked) {
        return res.status(200).json({ liked: true });
    } else return res.status(200).json({ liked: false });
};

export const likePost = async (req, res) => {
    const likes = await getAllLikes();
    const postId = parseInt(req.params.id, 10);
    const userId = await req.session.sessionId;
    likes.push({
        postId: postId,
        userId: userId,
    });
    await writeLike(likes);
    const likeCount = likes.filter((like) => like.postId === postId).length;
    await editLikeCount(postId, likeCount);
    return res.status(201).json({ likes: likeCount.toString() });
};

export const unlikePost = async (req, res) => {
    const likes = await getAllLikes();
    const postId = parseInt(req.params.id, 10);
    const userId = await req.session.sessionId;

    const newLikes = likes.filter(
        (like) => !(like.userId === userId && like.postId === postId),
    );

    await writeLike(newLikes);

    const likeCount =
        newLikes.filter((like) => like.postId === postId).length || 0;

    await editLikeCount(postId, likeCount);

    return res.status(201).json({ likes: likeCount });
};

export async function deleteAllLikeByPostId(postId) {
    const likes = await getAllLikes();
    const filteredLikes = likes.filter((like) => like.postId !== postId);
    await writeLike(filteredLikes);
}

export async function deleteAllLikeByUserId(userId) {
    const likes = await getAllLikes();
    const filteredLikes = likes.filter((like) => like.userId !== userId);
    await writeLike(filteredLikes);
}

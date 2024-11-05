import { getAllComments } from '../models/commentModel.js';

export const getComments = (req, res) => {
    const comments = getAllComments();
    res.json(comments);
};

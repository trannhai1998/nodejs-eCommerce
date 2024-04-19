import { NotFoundError } from '../core/error.response';
import CommentModel from '../models/comment.model';
import { convertToObjectIdMongodb } from '../utils';

/*
    key features: Comment Service
    + add Comment [User, Shop]
    + get a list of comments [User, Shop]
    + delete a comment [user | Shop | Admin]
*/
class CommentService {
	static async createComment({
		productId,
		userId,
		content,
		parentCommentId = null,
	}) {
		const newComment = new CommentModel({
			comment_productId: productId,
			comment_userId: userId,
			comment_content: content,
			comment_parentId: parentCommentId,
		});

		let rightValue;
		if (parentCommentId) {
			// reply comment
			const parentComment = await CommentModel.findById(parentCommentId);
			if (!parentComment) {
				throw new NotFoundError(`Component Parent not found!`);
			}
			console.log(parentComment);
			rightValue = parentComment.comment_right;
			// update many comments
			await CommentModel.updateMany(
				{
					comment_productId: convertToObjectIdMongodb(productId),
					comment_right: {
						$gte: rightValue,
					},
				},
				{
					$inc: { comment_right: 2 },
				},
			);

			await CommentModel.updateMany(
				{
					comment_productId: convertToObjectIdMongodb(productId),
					comment_left: {
						$gt: rightValue,
					},
				},
				{
					$inc: { comment_right: 2 },
				},
			);
		} else {
			const maxRightValue = await CommentModel.findOne(
				{
					comment_productId: convertToObjectIdMongodb(productId),
				},
				'comment_right',
				{ sort: { comment_right: -1 } },
			);

			if (maxRightValue) {
				rightValue = maxRightValue.comment_right + 1;
			} else {
				rightValue = 1;
			}
		}

		// Insert to comment;
		newComment.comment_left = rightValue;
		newComment.comment_right = rightValue + 1;

		await newComment.save();

		return newComment;
	}

	static async getCommentsByParentId({
		productId,
		parentCommentId = null,
		limit = 50,
		offset = 0,
	}) {
		if (parentCommentId) {
			const parent = await CommentModel.findById(parentCommentId);
			if (!parent) throw new NotFoundError('Comment not found!');

			const comments = await CommentModel.find({
				comment_productId: convertToObjectIdMongodb(productId),
				comment_left: {
					$gt: parent.comment_left,
				},
				comment_right: { $lte: parent.comment_right },
			})
				.select({
					comment_left: 1,
					comment_right: 1,
					comment_content: 1,
					comment_parentId: 1,
				})
				.sort({
					comment_left: 1,
				});

			return comments;
		}
		const comments = await CommentModel.find({
			comment_productId: convertToObjectIdMongodb(productId),
			comment_parentId: null,
		})
			.select({
				comment_left: 1,
				comment_right: 1,
				comment_content: 1,
				comment_parentId: 1,
			})
			.sort({
				comment_left: 1,
			});

		return comments;
	}
}

export default CommentService;

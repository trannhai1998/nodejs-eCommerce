import { NotFoundError } from '../core/error.response';
import CommentModel from '../models/comment.model';
import { findProduct } from '../models/repositories/product.repo';
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

	// Delete
	static async deleteComment({ productId, commentId }) {
		// Check the product existed in the database
		const foundProduct = await findProduct({
			product_id: productId,
		});

		if (!foundProduct) throw new NotFoundError('Product not found!');
		//1. Detect value left & right of comment
		const comment = await CommentModel.findById(commentId);
		if (!comment) throw new NotFoundError('Comment not found!');

		const { comment_left, comment_right } = comment;
		// 2. Calculate width of comment
		const width = comment_right - comment_left + 1;
		// 3. Delete all children comment of delete comment
		await CommentModel.deleteMany({
			comment_productId: convertToObjectIdMongodb(productId),
			comment_left: {
				$gte: comment_left,
				$lte: comment_right,
			},
		});
		// 4. Update value of right & left
		await CommentModel.updateMany(
			{
				comment_productId: convertToObjectIdMongodb(productId),
				comment_right: { $gt: comment_right },
			},
			{
				$inc: {
					comment_right: -width,
				},
			},
		);

		await CommentModel.updateMany(
			{
				comment_productId: convertToObjectIdMongodb(productId),
				comment_right: { $lt: comment_right },
			},
			{
				$inc: {
					comment_left: -width,
				},
			},
		);

		return true;
	}
}

export default CommentService;

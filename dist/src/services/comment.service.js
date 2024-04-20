"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_response_1 = require("../core/error.response");
const comment_model_1 = __importDefault(require("../models/comment.model"));
const product_repo_1 = require("../models/repositories/product.repo");
const utils_1 = require("../utils");
/*
    key features: Comment Service
    + add Comment [User, Shop]
    + get a list of comments [User, Shop]
    + delete a comment [user | Shop | Admin]
*/
class CommentService {
    static createComment({ productId, userId, content, parentCommentId = null, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const newComment = new comment_model_1.default({
                comment_productId: productId,
                comment_userId: userId,
                comment_content: content,
                comment_parentId: parentCommentId,
            });
            let rightValue;
            if (parentCommentId) {
                // reply comment
                const parentComment = yield comment_model_1.default.findById(parentCommentId);
                if (!parentComment) {
                    throw new error_response_1.NotFoundError(`Component Parent not found!`);
                }
                rightValue = parentComment.comment_right;
                // update many comments
                yield comment_model_1.default.updateMany({
                    comment_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
                    comment_right: {
                        $gte: rightValue,
                    },
                }, {
                    $inc: { comment_right: 2 },
                });
                yield comment_model_1.default.updateMany({
                    comment_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
                    comment_left: {
                        $gt: rightValue,
                    },
                }, {
                    $inc: { comment_right: 2 },
                });
            }
            else {
                const maxRightValue = yield comment_model_1.default.findOne({
                    comment_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
                }, 'comment_right', { sort: { comment_right: -1 } });
                if (maxRightValue) {
                    rightValue = maxRightValue.comment_right + 1;
                }
                else {
                    rightValue = 1;
                }
            }
            // Insert to comment;
            newComment.comment_left = rightValue;
            newComment.comment_right = rightValue + 1;
            yield newComment.save();
            return newComment;
        });
    }
    static getCommentsByParentId({ productId, parentCommentId = null, limit = 50, offset = 0, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parentCommentId) {
                const parent = yield comment_model_1.default.findById(parentCommentId);
                if (!parent)
                    throw new error_response_1.NotFoundError('Comment not found!');
                const comments = yield comment_model_1.default.find({
                    comment_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
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
            const comments = yield comment_model_1.default.find({
                comment_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
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
        });
    }
    // Delete
    static deleteComment({ productId, commentId }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check the product existed in the database
            const foundProduct = yield (0, product_repo_1.findProduct)({
                product_id: productId,
            });
            if (!foundProduct)
                throw new error_response_1.NotFoundError('Product not found!');
            //1. Detect value left & right of comment
            const comment = yield comment_model_1.default.findById(commentId);
            if (!comment)
                throw new error_response_1.NotFoundError('Comment not found!');
            const { comment_left, comment_right } = comment;
            // 2. Calculate width of comment
            const width = comment_right - comment_left + 1;
            // 3. Delete all children comment of delete comment
            yield comment_model_1.default.deleteMany({
                comment_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
                comment_left: {
                    $gte: comment_left,
                    $lte: comment_right,
                },
            });
            // 4. Update value of right & left
            yield comment_model_1.default.updateMany({
                comment_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
                comment_right: { $gt: comment_right },
            }, {
                $inc: {
                    comment_right: -width,
                },
            });
            yield comment_model_1.default.updateMany({
                comment_productId: (0, utils_1.convertToObjectIdMongodb)(productId),
                comment_right: { $lt: comment_right },
            }, {
                $inc: {
                    comment_left: -width,
                },
            });
            return true;
        });
    }
}
exports.default = CommentService;

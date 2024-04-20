import express, { Router } from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import CommentController from '../../controllers/comment.controller';
import { authenticationV2 } from '../../auth/authUtils';
import commentController from '../../controllers/comment.controller';

const router = express.Router();
// Authentication
router.use(authenticationV2);

router.post('', asyncHandler(commentController.createComment));

router.get('', asyncHandler(commentController.getCommentsByParentId));

router.delete('', asyncHandler(commentController.deleteComment));

export default router;

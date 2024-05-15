import { UseCaseError } from '@/core/errors/use-case-error';

export class CommentAlreadyLikedError extends Error implements UseCaseError {
  constructor() {
    super('You already liked this comment');
  }
}

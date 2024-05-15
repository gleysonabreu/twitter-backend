import { UseCaseError } from '@/core/errors/use-case-error';

export class PostAlreadyLikedError extends Error implements UseCaseError {
  constructor() {
    super('You already liked this post');
  }
}

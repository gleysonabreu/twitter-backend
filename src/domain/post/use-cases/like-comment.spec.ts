import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';
import { LikeCommentUseCase } from './like-comment';
import { makeLikeComment } from 'test/factories/make-like-comment';
import { CommentAlreadyLikedError } from './errors/comment-already-liked-error';

let inMemoryLikesCommentRepository: InMemoryLikesCommentRepository;
let sut: LikeCommentUseCase;

describe('Like comment', () => {
  beforeEach(() => {
    inMemoryLikesCommentRepository = new InMemoryLikesCommentRepository();
    sut = new LikeCommentUseCase(inMemoryLikesCommentRepository);
  });

  it('should be able to create a new like comment', async () => {
    const result = await sut.execute({
      commentId: 'any-comment-id',
      userId: 'any-user-id',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      likeComment: inMemoryLikesCommentRepository.likeComments[0],
    });
  });

  it('should not be possible to like comment if the comment is liked', async () => {
    const likeComment = makeLikeComment({
      commentId: new UniqueEntityID('comment-1'),
      userId: new UniqueEntityID('user-1'),
    });
    inMemoryLikesCommentRepository.likeComments.push(likeComment);

    const result = await sut.execute({
      commentId: 'comment-1',
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(CommentAlreadyLikedError);
    expect(result.value).toEqual(new CommentAlreadyLikedError());
    expect(inMemoryLikesCommentRepository.likeComments).toHaveLength(1);
  });
});

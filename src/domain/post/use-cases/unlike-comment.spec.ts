import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';
import { UnLikeCommentUseCase } from './unlike-comment';
import { makeLikeComment } from 'test/factories/make-like-comment';

let inMemoryLikesCommentRepository: InMemoryLikesCommentRepository;
let sut: UnLikeCommentUseCase;

describe('Unlike Comment', () => {
  beforeEach(() => {
    inMemoryLikesCommentRepository = new InMemoryLikesCommentRepository();
    sut = new UnLikeCommentUseCase(inMemoryLikesCommentRepository);
  });

  it('should be able to unlike a comment', async () => {
    const likeComment = makeLikeComment({
      userId: new UniqueEntityID('user-1'),
      commentId: new UniqueEntityID('comment-1'),
    });
    inMemoryLikesCommentRepository.likeComments.push(likeComment);

    const result = await sut.execute({
      commentId: 'comment-1',
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryLikesCommentRepository.likeComments).toHaveLength(0);
  });

  it('should not be possible to unlike a comment if the like comment does not exists', async () => {
    const result = await sut.execute({
      commentId: 'comment-id',
      userId: 'user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

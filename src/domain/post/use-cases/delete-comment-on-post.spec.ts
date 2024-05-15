import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { DeleteCommentOnPostUseCase } from './delete-comment-on-post';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { makeComment } from 'test/factories/make-comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: DeleteCommentOnPostUseCase;
let inMemoryCommentsRepository: InMemoryCommentsRepository;

describe('Delete comment on post', () => {
  beforeEach(() => {
    const usersMock = {} as InMemoryUsersRepository;
    const likesCommentMock = {} as InMemoryLikesCommentRepository;

    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      usersMock,
      likesCommentMock,
    );
    sut = new DeleteCommentOnPostUseCase(inMemoryCommentsRepository);
  });

  it('should be able to delete an comment on post', async () => {
    const comment = makeComment(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('comment-1'),
    );
    inMemoryCommentsRepository.comments.push(comment);

    const result = await sut.execute({
      commentId: 'comment-1',
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCommentsRepository.comments).toHaveLength(0);
  });

  it('should not be able to delete an comment on post if comment does not exist', async () => {
    const result = await sut.execute({
      commentId: 'any-comment',
      userId: 'any-user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to delete a comment on post from another user', async () => {
    const comment = makeComment({}, new UniqueEntityID('comment-1'));
    inMemoryCommentsRepository.comments.push(comment);

    const result = await sut.execute({
      commentId: 'comment-1',
      userId: 'any-user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toEqual(new NotAllowedError());
  });
});

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { GetCommentByIdUseCase } from './get-comment-by-id';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeComment } from 'test/factories/make-comment';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: GetCommentByIdUseCase;
let inMemoryCommentsRepository: InMemoryCommentsRepository;

describe('Get Comment By Id', () => {
  beforeEach(() => {
    const usersMock = {} as InMemoryUsersRepository;
    const likesComment = {} as InMemoryLikesCommentRepository;

    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      usersMock,
      likesComment,
    );
    sut = new GetCommentByIdUseCase(inMemoryCommentsRepository);
  });

  it('should be able to get comment by id', async () => {
    const comment = makeComment({ userId: new UniqueEntityID('user-1') });
    inMemoryCommentsRepository.comments.push(comment);

    const result = await sut.execute({
      commentId: comment.id.toString(),
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      comment: inMemoryCommentsRepository.comments[0],
    });
  });

  it('should not be able to get comment by id if comment does not exists', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      commentId: 'comment-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to get post by id if user is not the owner', async () => {
    const comment = makeComment({}, new UniqueEntityID('comment-1'));
    inMemoryCommentsRepository.comments.push(comment);

    const result = await sut.execute({
      userId: 'user-2',
      commentId: 'comment-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toEqual(new NotAllowedError());
  });
});

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { makeComment } from 'test/factories/make-comment';
import { GetCommentDetailsByIdUseCase } from './get-comment-details-by-id';
import { makeUser } from 'test/factories/make-user';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: GetCommentDetailsByIdUseCase;
let inMemoryCommentsRepository: InMemoryCommentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryLikesCommentRepository: InMemoryLikesCommentRepository;

describe('Get Comment Details By Id', () => {
  beforeEach(() => {
    const postsMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    inMemoryLikesCommentRepository = new InMemoryLikesCommentRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository(
      postsMock,
      followsMock,
    );

    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      inMemoryUsersRepository,
      inMemoryLikesCommentRepository,
    );
    sut = new GetCommentDetailsByIdUseCase(inMemoryCommentsRepository);
  });

  it('should be able to get comment details by id', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);
    const comment = makeComment({
      content: 'Content 01',
      userId: new UniqueEntityID('user-1'),
    });
    inMemoryCommentsRepository.comments.push(comment);

    const result = await sut.execute({
      commentId: comment.id.toString(),
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCommentsRepository.comments).toHaveLength(1);
    expect(result.value).toEqual({
      comment: expect.objectContaining({
        userId: user.id,
        content: 'Content 01',
      }),
    });
  });

  it('should be able to get comment details by id with parent comment', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);
    const comment = makeComment({ userId: new UniqueEntityID('user-1') });
    inMemoryCommentsRepository.comments.push(comment);

    const commentWithParent = makeComment({
      userId: user.id,
      parentId: comment.id,
    });
    inMemoryCommentsRepository.comments.push(commentWithParent);

    const result = await sut.execute({
      commentId: commentWithParent.id.toString(),
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCommentsRepository.comments).toHaveLength(2);
    expect(result.value).toEqual({
      comment: expect.objectContaining({
        commentId: commentWithParent.id,
        userId: user.id,
        parentId: comment.id,
        parent: expect.objectContaining({
          userId: user.id,
          commentId: comment.id,
        }),
      }),
    });
  });

  it('should not be able to get comment details by id if comment does not exists', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      commentId: 'comment-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

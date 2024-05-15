import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeComment } from 'test/factories/make-comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeUser } from 'test/factories/make-user';
import { FetchReplyCommentsUseCase } from './fetch-reply-comments';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: FetchReplyCommentsUseCase;
let inMemoryCommentsRepository: InMemoryCommentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryLikesCommentRepository: InMemoryLikesCommentRepository;

describe('Fetch reply on comment', () => {
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
    sut = new FetchReplyCommentsUseCase(inMemoryCommentsRepository);
  });

  it('should be able to fetch reply comments', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    const reply = makeComment(
      {
        userId: user.id,
        parentId: new UniqueEntityID('comment-1'),
        postId: new UniqueEntityID('post-1'),
      },
      new UniqueEntityID('reply-1'),
    );

    inMemoryCommentsRepository.comments.push(reply);
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      page: 1,
      userId: 'user-1',
      commentId: 'comment-1',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCommentsRepository.comments).toHaveLength(1);
    expect(result.value).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          userId: user.id,
          parentId: reply.parentId,
        }),
      ]),
    });
  });

  it('should be able to fetch reply comments with parent comment', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    const comment = makeComment({
      userId: user.id,
      postId: new UniqueEntityID('post-1'),
    });
    const parentComment = makeComment({
      userId: user.id,
      postId: new UniqueEntityID('post-1'),
      parentId: comment.id,
    });
    inMemoryCommentsRepository.comments.push(comment);
    inMemoryCommentsRepository.comments.push(parentComment);
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      page: 1,
      userId: 'user-1',
      commentId: comment.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.comments).toHaveLength(1);
    expect(result.value).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          userId: user.id,
          parentId: parentComment.parentId,
        }),
      ]),
    });
  });

  it('should be able to fetch paginated reply comments', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);

    for (let i = 1; i <= 22; i++) {
      const reply = makeComment({
        userId: user.id,
        postId: new UniqueEntityID('post-1'),
        parentId: new UniqueEntityID('comment-1'),
      });
      inMemoryCommentsRepository.comments.push(reply);
    }

    const result = await sut.execute({
      userId: 'user-1',
      commentId: 'comment-1',
      page: 2,
    });

    expect(result.value.comments).toHaveLength(2);
  });
});

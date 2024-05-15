import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { FetchCommentsOnPostUseCase } from './fetch-comments-on-post';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeComment } from 'test/factories/make-comment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeUser } from 'test/factories/make-user';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: FetchCommentsOnPostUseCase;
let inMemoryCommentsRepository: InMemoryCommentsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryLikesCommentRepository: InMemoryLikesCommentRepository;

describe('Fetch comments on post', () => {
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
    sut = new FetchCommentsOnPostUseCase(inMemoryCommentsRepository);
  });

  it('should be able to fetch comments on post', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    const comment = makeComment({
      userId: user.id,
      postId: new UniqueEntityID('post-1'),
    });

    inMemoryCommentsRepository.comments.push(comment);
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      page: 1,
      postId: 'post-1',
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCommentsRepository.comments).toHaveLength(1);
    expect(result.value).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          userId: user.id,
        }),
      ]),
    });
  });

  it('should be able to fetch comments on post without parent comments', async () => {
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
      postId: 'post-1',
      userId: 'user-1',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.comments).toHaveLength(1);
    expect(result.value).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          userId: user.id,
        }),
      ]),
    });
  });

  it('should be able to fetch paginated comments on post', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);

    for (let i = 1; i <= 22; i++) {
      const comment = makeComment({
        userId: user.id,
        postId: new UniqueEntityID('post-1'),
      });
      inMemoryCommentsRepository.comments.push(comment);
    }

    const result = await sut.execute({
      postId: 'post-1',
      userId: 'user-1',
      page: 2,
    });

    expect(result.value.comments).toHaveLength(2);
  });
});

import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { FetchUserPostsUseCase } from './fetch-user-posts';
import { makePost } from 'test/factories/make-post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: FetchUserPostsUseCase;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFavoritesRepository: InMemoryFavoritesRepository;
let inMemoryLikesRepository: InMemoryLikesRepository;
let inMemoryFollowsRepository: InMemoryFollowsRepository;
let inMemoryCommentsRepository: InMemoryCommentsRepository;

describe('Fetch User Posts', () => {
  beforeEach(() => {
    const postMock = {} as InMemoryPostsRepository;
    const likesCommentMock = {} as InMemoryLikesCommentRepository;

    inMemoryFavoritesRepository = new InMemoryFavoritesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository(
      postMock,
      inMemoryFollowsRepository,
    );
    inMemoryFollowsRepository = new InMemoryFollowsRepository(
      inMemoryUsersRepository,
      postMock,
    );
    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      inMemoryUsersRepository,
      likesCommentMock,
    );
    inMemoryLikesRepository = new InMemoryLikesRepository();
    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryUsersRepository,
      inMemoryLikesRepository,
      inMemoryFavoritesRepository,
      inMemoryFollowsRepository,
      inMemoryCommentsRepository,
    );
    sut = new FetchUserPostsUseCase(inMemoryPostsRepository);
  });

  it('should be able to fetch all posts user', async () => {
    const user = makeUser({}, new UniqueEntityID('user-id'));
    const user2 = makeUser({}, new UniqueEntityID('user-2'));
    inMemoryUsersRepository.users.push(user);
    inMemoryUsersRepository.users.push(user2);

    const post = makePost({ userId: user.id });
    const post2 = makePost({ userId: user.id });
    const post3 = makePost({ userId: user.id });

    inMemoryPostsRepository.posts.push(post);
    inMemoryPostsRepository.posts.push(post2);
    inMemoryPostsRepository.posts.push(post3);

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    });
    expect(result.isRight()).toBe(true);
    expect(result.value.posts).toHaveLength(3);
    expect(result.value.posts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postId: post.id,
          userId: user.id,
        }),
        expect.objectContaining({
          postId: post2.id,
          userId: user.id,
        }),
        expect.objectContaining({
          postId: post3.id,
          userId: user.id,
        }),
      ]),
    );
  });

  it('should be able to fetch paginated posts user', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);

    for (let i = 1; i <= 22; i++) {
      inMemoryPostsRepository.posts.push(
        makePost({
          userId: user.id,
        }),
      );
    }

    const result = await sut.execute({ userId: 'user-1', page: 2 });

    expect(result.value.posts).toHaveLength(2);
  });
});

import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { makePost } from 'test/factories/make-post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { makeLike } from 'test/factories/make-like';
import { FetchPostsLikedUseCase } from './fetch-posts-liked';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: FetchPostsLikedUseCase;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFavoritesRepository: InMemoryFavoritesRepository;
let inMemoryLikesRepository: InMemoryLikesRepository;
let inMemoryCommentsRepository: InMemoryCommentsRepository;

describe('Fetch Liked Posts', () => {
  beforeEach(() => {
    const postMock = {} as InMemoryPostsRepository;
    const likesCommentMock = {} as InMemoryLikesCommentRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    inMemoryFavoritesRepository = new InMemoryFavoritesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository(
      postMock,
      followsMock,
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
      followsMock,
      inMemoryCommentsRepository,
    );
    sut = new FetchPostsLikedUseCase(inMemoryPostsRepository);
  });

  it('should be able to fetch liked posts', async () => {
    const user = makeUser({}, new UniqueEntityID('user-id'));
    const userOther = makeUser({}, new UniqueEntityID('user-2'));
    inMemoryUsersRepository.users.push(user);
    inMemoryUsersRepository.users.push(userOther);

    const post = makePost({ userId: user.id });
    const post2 = makePost({ userId: userOther.id });
    const post3 = makePost({ userId: user.id });
    inMemoryPostsRepository.posts.push(post);
    inMemoryPostsRepository.posts.push(post2);
    inMemoryPostsRepository.posts.push(post3);

    const like = makeLike({ postId: post.id, userId: user.id });
    const likeOther = makeLike({ postId: post2.id, userId: user.id });
    inMemoryLikesRepository.likes.push(like);
    inMemoryLikesRepository.likes.push(likeOther);

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.posts).toHaveLength(2);
    expect(result.value.posts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postId: post.id,
          userId: user.id,
          isLiked: true,
        }),
        expect.objectContaining({
          postId: post2.id,
          userId: userOther.id,
          isLiked: true,
        }),
      ]),
    );
  });

  it('should be able to fetch paginated like posts', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);

    for (let i = 1; i <= 22; i++) {
      const post = makePost({
        userId: user.id,
      });
      inMemoryPostsRepository.posts.push(post);

      const like = makeLike({ postId: post.id, userId: user.id });
      inMemoryLikesRepository.likes.push(like);
    }

    const result = await sut.execute({ userId: 'user-1', page: 2 });
    expect(result.value.posts).toHaveLength(2);
  });
});
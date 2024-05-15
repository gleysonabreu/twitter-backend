import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { makePost } from 'test/factories/make-post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { FetchFeedProfileUseCase } from './fetch-feed-profile';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: FetchFeedProfileUseCase;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFavoritesRepository: InMemoryFavoritesRepository;
let inMemoryLikesRepository: InMemoryLikesRepository;
let inMemoryCommentsRepository: InMemoryCommentsRepository;

describe('Fetch Feed Profile', () => {
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
    sut = new FetchFeedProfileUseCase(inMemoryPostsRepository);
  });

  it('should be able to fetch posts user profile', async () => {
    const user = makeUser({}, new UniqueEntityID('user-id'));
    inMemoryUsersRepository.users.push(user);

    const post = makePost({ userId: user.id });
    inMemoryPostsRepository.posts.push(post);

    const result = await sut.execute({
      userId: 'user-id',
      currentUserId: user.id.toString(),
      page: 1,
    });
    expect(result.isRight()).toBe(true);
    expect(result.value.posts).toHaveLength(1);
    expect(result.value.posts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postId: post.id,
          userId: user.id,
        }),
      ]),
    );
  });

  it('should be able to fetch paginated feed user profile', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);

    for (let i = 1; i <= 22; i++) {
      inMemoryPostsRepository.posts.push(
        makePost({
          userId: user.id,
        }),
      );
    }

    const result = await sut.execute({
      userId: 'user-1',
      page: 2,
      currentUserId: user.id.toString(),
    });

    expect(result.value.posts).toHaveLength(2);
  });
});

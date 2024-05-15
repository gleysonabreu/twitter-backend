import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { makeFollow } from 'test/factories/make-follow';
import { FetchFollowersUserUseCase } from './fetch-followers-user';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';

let inMemoryFollowsRepository: InMemoryFollowsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPostsRepository: InMemoryPostsRepository;
let sut: FetchFollowersUserUseCase;

describe('Fetch Follows User', () => {
  beforeEach(() => {
    const usersMock = {} as InMemoryUsersRepository;
    const likesMock = {} as InMemoryLikesRepository;
    const favMock = {} as InMemoryFavoritesRepository;
    const followsMock = {} as InMemoryFollowsRepository;
    const commentsMock = {} as InMemoryCommentsRepository;

    inMemoryPostsRepository = new InMemoryPostsRepository(
      usersMock,
      likesMock,
      favMock,
      followsMock,
      commentsMock,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryPostsRepository,
      followsMock,
    );
    inMemoryFollowsRepository = new InMemoryFollowsRepository(
      inMemoryUsersRepository,
      inMemoryPostsRepository,
    );
    sut = new FetchFollowersUserUseCase(inMemoryFollowsRepository);
  });

  it('should be able to fetch followers users', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    const user2 = makeUser({}, new UniqueEntityID('user-2'));
    const user3 = makeUser({}, new UniqueEntityID('user-3'));
    inMemoryUsersRepository.users.push(user);
    inMemoryUsersRepository.users.push(user2);
    inMemoryUsersRepository.users.push(user3);

    const follow = makeFollow({ followingId: user2.id, followedById: user.id });
    const follow3 = makeFollow({
      followingId: user3.id,
      followedById: user.id,
    });
    const follow2 = makeFollow({
      followingId: user.id,
      followedById: user2.id,
    });
    inMemoryFollowsRepository.follows.push(follow);
    inMemoryFollowsRepository.follows.push(follow2);
    inMemoryFollowsRepository.follows.push(follow3);

    const result = await sut.execute({
      followedById: 'user-1',
      userId: 'user-1',
      page: 1,
    });

    expect(result.isRight()).toEqual(true);
    expect(result.value.followers).toHaveLength(2);
    expect(result.value).toEqual({
      followers: expect.arrayContaining([
        expect.objectContaining({
          isFollowing: true,
          userId: user2.id,
        }),
        expect.objectContaining({
          isFollowing: false,
          userId: user3.id,
        }),
      ]),
    });
  });

  it('should be able to fetch paginated followers users', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);

    for (let i = 1; i <= 22; i++) {
      const userToFollow = makeUser({}, new UniqueEntityID(`user-${i}`));
      inMemoryUsersRepository.users.push(userToFollow);

      const follow = makeFollow({
        followingId: userToFollow.id,
        followedById: user.id,
      });
      inMemoryFollowsRepository.follows.push(follow);
    }

    const result = await sut.execute({
      followedById: 'user-1',
      userId: 'user-1',
      page: 2,
    });

    expect(result.value.followers).toHaveLength(2);
  });
});

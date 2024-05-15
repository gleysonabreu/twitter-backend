import { FollowUserUseCase } from './follow-user';
import { makeFollow } from 'test/factories/make-follow';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let sut: FollowUserUseCase;

let inMemoryFollowsRepository: InMemoryFollowsRepository;

describe('Follow User', () => {
  beforeEach(() => {
    const usersMock = {} as InMemoryUsersRepository;
    const postsMock = {} as InMemoryPostsRepository;
    inMemoryFollowsRepository = new InMemoryFollowsRepository(
      usersMock,
      postsMock,
    );
    sut = new FollowUserUseCase(inMemoryFollowsRepository);
  });

  it('should be able to follow a user', async () => {
    const follow = makeFollow({ followingId: new UniqueEntityID('user-1') });
    inMemoryFollowsRepository.follows.push(follow);

    const result = await sut.execute({
      followingId: 'user-1',
      followedBy: 'user-2',
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryFollowsRepository.follows.filter(
        (follow) => follow.followingId.toString() === 'user-1',
      ),
    ).toHaveLength(2);
    expect(
      inMemoryFollowsRepository.follows.filter(
        (follow) => follow.followedById.toString() === 'user-2',
      ),
    ).toHaveLength(1);
  });

  it('should be able to unfollow user', async () => {
    const followUser = makeFollow({
      followingId: new UniqueEntityID('user-1'),
      followedById: new UniqueEntityID('user-2'),
    });
    const followUser2 = makeFollow({
      followingId: new UniqueEntityID('user-1'),
      followedById: new UniqueEntityID('user-3'),
    });

    inMemoryFollowsRepository.follows.push(followUser);
    inMemoryFollowsRepository.follows.push(followUser2);

    const result = await sut.execute({
      followingId: 'user-1',
      followedBy: 'user-2',
    });

    expect(result.isRight()).toBe(true);
    expect(
      inMemoryFollowsRepository.follows.filter(
        (follow) =>
          follow.followedById.equals(followUser.followedById) &&
          follow.followingId.equals(followUser.followingId),
      ),
    ).toHaveLength(0);

    expect(
      inMemoryFollowsRepository.follows.filter(
        (follow) => follow.followingId.toString() === 'user-1',
      ),
    ).toHaveLength(1);
  });
});

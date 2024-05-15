import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { GetUserByUsernameUseCase } from './get-user-by-username';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { makePost } from 'test/factories/make-post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryFollowsRepository: InMemoryFollowsRepository;
let sut: GetUserByUsernameUseCase;

describe('Get User By Username', () => {
  beforeEach(() => {
    const usersMock = {} as InMemoryUsersRepository;
    const favMock = {} as InMemoryFavoritesRepository;
    const likesMock = {} as InMemoryLikesRepository;
    const followsMock = {} as InMemoryFollowsRepository;
    const commentsMock = {} as InMemoryCommentsRepository;

    inMemoryPostsRepository = new InMemoryPostsRepository(
      usersMock,
      likesMock,
      favMock,
      followsMock,
      commentsMock,
    );

    inMemoryFollowsRepository = new InMemoryFollowsRepository(
      usersMock,
      inMemoryPostsRepository,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryPostsRepository,
      inMemoryFollowsRepository,
    );
    sut = new GetUserByUsernameUseCase(inMemoryUsersRepository);
  });

  it('should be able to get user by username', async () => {
    const user = makeUser({ username: 'username' });
    inMemoryUsersRepository.users.push(user);

    const post = makePost({ userId: user.id });
    const post2 = makePost({ userId: new UniqueEntityID('any-user') });
    inMemoryPostsRepository.posts.push(post);
    inMemoryPostsRepository.posts.push(post2);

    const result = await sut.execute({
      username: 'username',
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        username: 'username',
        totalPosts: 1,
        isFollowing: false,
      }),
    });
  });

  it('should not be able to get user by username if user not exists', async () => {
    const result = await sut.execute({
      username: 'any-username',
      userId: 'any-user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

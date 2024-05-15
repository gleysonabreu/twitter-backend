import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { SearchUserUseCase } from './search-user';
import { makeUser } from 'test/factories/make-user';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryFollowsRepository: InMemoryFollowsRepository;
let sut: SearchUserUseCase;

describe('Search User', () => {
  beforeEach(() => {
    const usersMock = {} as InMemoryUsersRepository;
    const likesMock = {} as InMemoryLikesRepository;
    const favMock = {} as InMemoryFavoritesRepository;
    const postsMock = {} as InMemoryPostsRepository;
    const commentsMock = {} as InMemoryCommentsRepository;

    inMemoryFollowsRepository = new InMemoryFollowsRepository(
      usersMock,
      postsMock,
    );
    inMemoryPostsRepository = new InMemoryPostsRepository(
      usersMock,
      likesMock,
      favMock,
      inMemoryFollowsRepository,
      commentsMock,
    );

    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemoryPostsRepository,
      inMemoryFollowsRepository,
    );
    sut = new SearchUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to search a user by firstName', async () => {
    const user = makeUser({ firstName: 'John' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      query: 'jo',
      page: 1,
      userId: 'any-user',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.users).toHaveLength(1);
  });

  it('should be able to search a user by lastName', async () => {
    const user = makeUser({ lastName: 'Doe' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      query: 'doe',
      page: 1,
      userId: 'any-user',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.users).toHaveLength(1);
  });

  it('should be able to search a user by username', async () => {
    const user = makeUser({ username: 'johndoe' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      query: 'doe',
      page: 1,
      userId: 'any-user',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.users).toHaveLength(1);
  });

  it('should be able to fetch paginated search users', async () => {
    for (let i = 1; i <= 22; i++) {
      const userToFollow = makeUser({ firstName: 'John' });
      inMemoryUsersRepository.users.push(userToFollow);
    }

    const result = await sut.execute({
      query: 'john',
      userId: 'user-1',
      page: 2,
    });

    expect(result.value.users).toHaveLength(2);
  });
});

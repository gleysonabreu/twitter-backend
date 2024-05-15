import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FindUserByIdUseCase } from './find-user-by-id';
import { makeUser } from 'test/factories/make-user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: FindUserByIdUseCase;

describe('Find User by Id', () => {
  beforeEach(() => {
    const postMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    inMemoryUsersRepository = new InMemoryUsersRepository(
      postMock,
      followsMock,
    );
    sut = new FindUserByIdUseCase(inMemoryUsersRepository);
  });

  it('should be able to get a user', async () => {
    const user = makeUser({}, new UniqueEntityID('user-id'));
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({ id: 'user-id' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
  });

  it('should not be able to get a user if id not exists', async () => {
    const result = await sut.execute({ id: 'any-user-id' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

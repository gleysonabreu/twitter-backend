import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { makeUser } from 'test/factories/make-user';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { UpdateAccountUseCase } from './update-account';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: UpdateAccountUseCase;

describe('Update Account', () => {
  beforeEach(() => {
    const postsMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    inMemoryUsersRepository = new InMemoryUsersRepository(
      postsMock,
      followsMock,
    );
    sut = new UpdateAccountUseCase(inMemoryUsersRepository);
  });

  it('should be able to update account', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      userId: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      birthDate: new Date('02-16-1998'),
      bio: 'john doe buy the social',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
  });

  it('should not be able to update account if user doest not exists', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      birthDate: new Date('02-16-1998'),
      bio: 'john doe buy the social',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to update account if email already exists', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    const user2 = makeUser(
      { email: 'example@example.com' },
      new UniqueEntityID('user-2'),
    );
    inMemoryUsersRepository.users.push(user);
    inMemoryUsersRepository.users.push(user2);

    const result = await sut.execute({
      userId: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'example@example.com',
      username: 'johndoe',
      birthDate: new Date('02-16-1998'),
      bio: 'john doe buy the social',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
    expect(result.value).toEqual(
      new UserAlreadyExistsError('example@example.com'),
    );
  });

  it('should not be able to update account if username already exists', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    const user2 = makeUser(
      { username: 'example' },
      new UniqueEntityID('user-2'),
    );
    inMemoryUsersRepository.users.push(user);
    inMemoryUsersRepository.users.push(user2);

    const result = await sut.execute({
      userId: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'example@example.com',
      username: 'example',
      birthDate: new Date('02-16-1998'),
      bio: 'john doe buy the social',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
    expect(result.value).toEqual(new UserAlreadyExistsError('example'));
  });
});

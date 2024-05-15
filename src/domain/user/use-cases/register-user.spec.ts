import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { RegisterUserUseCase } from './register-user';
import { makeUser } from 'test/factories/make-user';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let sut: RegisterUserUseCase;

describe('Register User', () => {
  beforeEach(() => {
    const postsMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    inMemoryUsersRepository = new InMemoryUsersRepository(
      postsMock,
      followsMock,
    );
    fakeHasher = new FakeHasher();
    sut = new RegisterUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      birthDate: new Date('02-16-1998'),
      bio: 'john doe buy the social',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
  });

  it('should not be possible to register user if the email already exists', async () => {
    const user = makeUser({ email: 'johndoe@example.com' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      birthDate: new Date('02-16-1998'),
      bio: 'john doe buy the social',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
    expect(result.value).toEqual(
      new UserAlreadyExistsError('johndoe@example.com'),
    );
  });
  it('should not be possible to register user if the username already exists', async () => {
    const user = makeUser({ username: 'johndoe' });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      birthDate: new Date('02-16-1998'),
      bio: 'john doe buy the social',
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
    expect(result.value).toEqual(new UserAlreadyExistsError('johndoe'));
  });

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      username: 'johndoe',
      birthDate: new Date('02-16-1998'),
      bio: 'john doe buy the social',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.users[0].password).toEqual(hashedPassword);
  });
});

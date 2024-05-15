import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { AuthenticateUserUseCase } from './authenticate-user';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';

let inMemoryRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;

let sut: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    const postMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    inMemoryRepository = new InMemoryUsersRepository(postMock, followsMock);
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateUserUseCase(
      inMemoryRepository,
      fakeHasher,
      fakeEncrypter,
    );
  });

  it('should be able to authenticate a user with email and password', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('12345678'),
    });
    inMemoryRepository.users.push(user);

    const result = await sut.execute({
      login: 'johndoe@example.com',
      password: '12345678',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should be able to authenticate a user with username and password', async () => {
    const user = makeUser({
      username: 'johndoe',
      password: await fakeHasher.hash('12345678'),
    });
    inMemoryRepository.users.push(user);

    const result = await sut.execute({
      login: 'johndoe',
      password: '12345678',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate a user with wrong password', async () => {
    const user = makeUser({
      username: 'johndoe',
      password: await fakeHasher.hash('12345678'),
    });
    inMemoryRepository.users.push(user);

    const result = await sut.execute({
      login: 'johndoe',
      password: 'wrong-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
    expect(result.value).toEqual(new WrongCredentialsError());
  });

  it('should not be able to authenticate a user with wrong login', async () => {
    const user = makeUser({
      username: 'johndoe',
      password: await fakeHasher.hash('12345678'),
    });
    inMemoryRepository.users.push(user);

    const result = await sut.execute({
      login: 'wrong-login',
      password: '12345678',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
    expect(result.value).toEqual(new WrongCredentialsError());
  });

  it('should hash user access token upon authentication', async () => {
    const user = makeUser(
      {
        email: 'johndoe@example.com',
        password: await fakeHasher.hash('12345678'),
      },
      new UniqueEntityID('any-id'),
    );
    inMemoryRepository.users.push(user);

    const result = await sut.execute({
      login: 'johndoe@example.com',
      password: '12345678',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: JSON.stringify({ sub: 'any-id' }),
    });
  });
});

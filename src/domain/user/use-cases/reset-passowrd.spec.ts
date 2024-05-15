import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { ResetPasswordUseCase } from './reset-password';
import { InMemoryVerificationTokens } from 'test/repositories/in-memory-verification-tokens-repository';
import { MockDateRepository } from 'test/mocks/date-mock';
import { makeVerificationToken } from 'test/factories/make-verification-token';
import { InvalidTokenError } from './errors/invalid-token-error';
import { TokenExpiredError } from './errors/token-expired-error';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryVerificationTokens: InMemoryVerificationTokens;
let dateMock: MockDateRepository;
let fakeHashGenerator: FakeHasher;

let sut: ResetPasswordUseCase;

describe('Reset Password', () => {
  beforeEach(() => {
    const postMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    inMemoryUsersRepository = new InMemoryUsersRepository(
      postMock,
      followsMock,
    );
    fakeHashGenerator = new FakeHasher();
    inMemoryVerificationTokens = new InMemoryVerificationTokens();
    dateMock = new MockDateRepository();

    sut = new ResetPasswordUseCase(
      inMemoryVerificationTokens,
      inMemoryUsersRepository,
      dateMock,
      fakeHashGenerator,
    );
  });

  it('should be able to reset password by token', async () => {
    const user = makeUser({
      password: await fakeHashGenerator.hash('12345678'),
    });
    const token = makeVerificationToken({ userId: user.id, token: 'token-1' });
    inMemoryUsersRepository.users.push(user);
    inMemoryVerificationTokens.tokens.push(token);

    const result = await sut.execute({
      token: 'token-1',
      newPassword: 'new-password',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        password: 'new-password-hashed',
      }),
    });
  });

  it('should not be able to reset password if token expired', async () => {
    const user = makeUser({
      password: await fakeHashGenerator.hash('12345678'),
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() - 1);
    const token = makeVerificationToken({
      userId: user.id,
      token: 'token-1',
      expiresAt,
    });
    inMemoryUsersRepository.users.push(user);
    inMemoryVerificationTokens.tokens.push(token);

    const result = await sut.execute({
      token: 'token-1',
      newPassword: 'new-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(TokenExpiredError);
    expect(result.value).toEqual(new TokenExpiredError());
  });

  it('should not be able to reset password if token is invalid', async () => {
    const user = makeUser({
      password: await fakeHashGenerator.hash('12345678'),
    });

    inMemoryUsersRepository.users.push(user);
    const result = await sut.execute({
      token: 'token-1',
      newPassword: 'new-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidTokenError);
    expect(result.value).toEqual(new InvalidTokenError());
  });

  it('should not be able to reset password if user does not exists', async () => {
    const token = makeVerificationToken({
      userId: new UniqueEntityID('user-1'),
      token: 'token-1',
    });
    inMemoryVerificationTokens.tokens.push(token);

    const result = await sut.execute({
      token: 'token-1',
      newPassword: 'new-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { ForgotPasswordUseCase } from './forgot-password';
import { MockDateRepository } from 'test/mocks/date-mock';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { InMemoryVerificationTokens } from 'test/repositories/in-memory-verification-tokens-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryVerificationTokens: InMemoryVerificationTokens;
let mockDate: MockDateRepository;

let sut: ForgotPasswordUseCase;

describe('Forgot Password', () => {
  beforeEach(() => {
    const postMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    inMemoryUsersRepository = new InMemoryUsersRepository(
      postMock,
      followsMock,
    );
    mockDate = new MockDateRepository();
    inMemoryVerificationTokens = new InMemoryVerificationTokens();
    sut = new ForgotPasswordUseCase(
      inMemoryUsersRepository,
      mockDate,
      inMemoryVerificationTokens,
    );
  });

  it('should be able to forgot password', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
    });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({ email: 'johndoe@example.com' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      verificationToken: inMemoryVerificationTokens.tokens[0],
      user: inMemoryUsersRepository.users[0],
    });
  });

  it('should not be able to forgot password if user does not exists', async () => {
    const result = await sut.execute({ email: 'johndoe@example.com' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

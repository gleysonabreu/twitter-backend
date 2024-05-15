import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeUser } from 'test/factories/make-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { ChangePasswordUseCase } from './change-password';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { WrongCurrentPasswordError } from './errors/wrong-current-password-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHashGenerator: FakeHasher;
let fakeHashComparer: FakeHasher;

let sut: ChangePasswordUseCase;

describe('Change Password', () => {
  beforeEach(() => {
    const postMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    inMemoryUsersRepository = new InMemoryUsersRepository(
      postMock,
      followsMock,
    );
    fakeHashComparer = new FakeHasher();
    fakeHashGenerator = new FakeHasher();

    sut = new ChangePasswordUseCase(
      inMemoryUsersRepository,
      fakeHashGenerator,
      fakeHashComparer,
    );
  });

  it('should be able to change password', async () => {
    const user = makeUser({
      password: await fakeHashGenerator.hash('12345678'),
    });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      password: '12345678',
      newPassword: 'new-password',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: expect.objectContaining({
        password: 'new-password-hashed',
      }),
    });
  });

  it('should not be able to change password if user does not exists', async () => {
    const result = await sut.execute({
      userId: 'any-user-id',
      password: '12345678',
      newPassword: 'new-password',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to change password if current password is invalid', async () => {
    const user = makeUser({
      password: await fakeHashGenerator.hash('12345678'),
    });
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      password: 'any-password',
      newPassword: 'new-password',
    });

    expect(result.value).toBeInstanceOf(WrongCurrentPasswordError);
    expect(result.value).toEqual(new WrongCurrentPasswordError());
  });
});

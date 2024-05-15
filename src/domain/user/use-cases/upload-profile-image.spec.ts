import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { UploadProfileImageUseCase } from './upload-profile-image';
import { FakeUploader } from 'test/storage/fake-upload';
import { InvalidUploadTypeError } from './errors/invalid-upload-type-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: UploadProfileImageUseCase;
let fakeUpload: FakeUploader;

describe('Upload profile image', () => {
  beforeEach(() => {
    const postsMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    fakeUpload = new FakeUploader();
    inMemoryUsersRepository = new InMemoryUsersRepository(
      postsMock,
      followsMock,
    );
    sut = new UploadProfileImageUseCase(inMemoryUsersRepository, fakeUpload);
  });

  it('should be able to upload a new profile image', async () => {
    const user = makeUser();
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      fileType: 'image/png',
      fileName: 'profile.png',
      body: Buffer.from(''),
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0],
    });
    expect(fakeUpload.uploads).toHaveLength(1);
    expect(fakeUpload.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('should not be able to upload profile image with invalid file type', async () => {
    const user = makeUser();
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      fileName: 'profile.pdf',
      fileType: 'application/pdf',
      body: Buffer.from(''),
      userId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidUploadTypeError);
    expect(result.value).toEqual(new InvalidUploadTypeError('application/pdf'));
  });

  it('should not be able to upload profile image if user does not exits', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

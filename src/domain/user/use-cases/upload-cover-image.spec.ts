import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { FakeUploader } from 'test/storage/fake-upload';
import { InvalidUploadTypeError } from './errors/invalid-upload-type-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { UploadCoverImageUseCase } from './upload-cover-image';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: UploadCoverImageUseCase;
let fakeUpload: FakeUploader;

describe('Upload Cover image', () => {
  beforeEach(() => {
    const postsMock = {} as InMemoryPostsRepository;
    const followsMock = {} as InMemoryFollowsRepository;

    fakeUpload = new FakeUploader();
    inMemoryUsersRepository = new InMemoryUsersRepository(
      postsMock,
      followsMock,
    );
    sut = new UploadCoverImageUseCase(inMemoryUsersRepository, fakeUpload);
  });

  it('should be able to upload a new cover image', async () => {
    const user = makeUser();
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      fileType: 'image/png',
      fileName: 'cover.png',
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
        fileName: 'cover.png',
      }),
    );
  });

  it('should not be able to upload cover image with invalid file type', async () => {
    const user = makeUser();
    inMemoryUsersRepository.users.push(user);

    const result = await sut.execute({
      fileName: 'cover.pdf',
      fileType: 'application/pdf',
      body: Buffer.from(''),
      userId: user.id.toString(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidUploadTypeError);
    expect(result.value).toEqual(new InvalidUploadTypeError('application/pdf'));
  });

  it('should not be able to upload cover image if user does not exits', async () => {
    const result = await sut.execute({
      fileName: 'cover.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      userId: 'user-1',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

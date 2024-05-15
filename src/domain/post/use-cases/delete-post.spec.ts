import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { makePost } from 'test/factories/make-post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { DeletePostUseCase } from './delete-post';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';

let sut: DeletePostUseCase;
let inMemoryPostsRepository: InMemoryPostsRepository;

describe('Delete Post', () => {
  beforeEach(() => {
    const likesMock = {} as InMemoryLikesRepository;
    const userMock = {} as InMemoryUsersRepository;
    const favMock = {} as InMemoryFavoritesRepository;
    const followsMock = {} as InMemoryFollowsRepository;
    const commentsMock = {} as InMemoryCommentsRepository;

    inMemoryPostsRepository = new InMemoryPostsRepository(
      userMock,
      likesMock,
      favMock,
      followsMock,
      commentsMock,
    );
    sut = new DeletePostUseCase(inMemoryPostsRepository);
  });

  it('should be able to delete a post', async () => {
    const post = makePost(
      { userId: new UniqueEntityID('any-user-id') },
      new UniqueEntityID('any-post-id'),
    );
    inMemoryPostsRepository.posts.push(post);

    const result = await sut.execute({
      postId: 'any-post-id',
      userId: 'any-user-id',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryPostsRepository.posts).toHaveLength(0);
  });

  it('should not be possible to delete a post if the post does not exist', async () => {
    const result = await sut.execute({
      postId: 'any-id',
      userId: 'any-user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to delete a post from another user', async () => {
    const post = makePost({}, new UniqueEntityID('any-post-id'));
    inMemoryPostsRepository.posts.push(post);

    const result = await sut.execute({
      postId: 'any-post-id',
      userId: 'any-user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(inMemoryPostsRepository.posts).toHaveLength(1);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toEqual(new NotAllowedError());
  });
});

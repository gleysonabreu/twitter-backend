import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LikePostUseCase } from './like-post';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { makeLike } from 'test/factories/make-like';
import { PostAlreadyLikedError } from './errors/post-already-liked-error';

let inMemoryLikesRepository: InMemoryLikesRepository;
let sut: LikePostUseCase;

describe('Like post', () => {
  beforeEach(() => {
    inMemoryLikesRepository = new InMemoryLikesRepository();
    sut = new LikePostUseCase(inMemoryLikesRepository);
  });

  it('should be able to create a new like', async () => {
    const result = await sut.execute({
      postId: 'any-post-id',
      userId: 'any-user-id',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      like: inMemoryLikesRepository.likes[0],
    });
  });

  it('should not be possible to like a post if the post is liked', async () => {
    const like = makeLike({
      postId: new UniqueEntityID('post-id'),
      userId: new UniqueEntityID('user-id'),
    });
    inMemoryLikesRepository.likes.push(like);

    const result = await sut.execute({
      postId: 'post-id',
      userId: 'user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(PostAlreadyLikedError);
    expect(result.value).toEqual(new PostAlreadyLikedError());
    expect(inMemoryLikesRepository.likes).toHaveLength(1);
  });
});

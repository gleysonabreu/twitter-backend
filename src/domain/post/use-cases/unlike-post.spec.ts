import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { UnLikePostUseCase } from './unlike-post';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { makeLike } from 'test/factories/make-like';

let inMemoryLikesRepository: InMemoryLikesRepository;
let sut: UnLikePostUseCase;

describe('Unlike Post', () => {
  beforeEach(() => {
    inMemoryLikesRepository = new InMemoryLikesRepository();
    sut = new UnLikePostUseCase(inMemoryLikesRepository);
  });

  it('should be able to unlike a post', async () => {
    const favorite = makeLike({
      userId: new UniqueEntityID('any-user-id'),
      postId: new UniqueEntityID('any-post-id'),
    });
    inMemoryLikesRepository.likes.push(favorite);

    const result = await sut.execute({
      postId: 'any-post-id',
      userId: 'any-user-id',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryLikesRepository.likes).toHaveLength(0);
  });

  it('should not be possible to unlike a post if the like post does not exists', async () => {
    const result = await sut.execute({
      postId: 'post-id',
      userId: 'user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

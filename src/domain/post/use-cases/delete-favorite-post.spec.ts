import { makeFavorite } from 'test/factories/make-favorite';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { DeleteFavoritePostUseCase } from './delete-favorite-post';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

let inMemoryFavoritesRepository: InMemoryFavoritesRepository;
let sut: DeleteFavoritePostUseCase;

describe('Delete Favorite Post', () => {
  beforeEach(() => {
    inMemoryFavoritesRepository = new InMemoryFavoritesRepository();
    sut = new DeleteFavoritePostUseCase(inMemoryFavoritesRepository);
  });

  it('should be able to delete favorite post', async () => {
    const favorite = makeFavorite({
      userId: new UniqueEntityID('any-user-id'),
      postId: new UniqueEntityID('any-post-id'),
    });
    inMemoryFavoritesRepository.favorites.push(favorite);

    const result = await sut.execute({
      postId: 'any-post-id',
      userId: 'any-user-id',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryFavoritesRepository.favorites).toHaveLength(0);
  });

  it('should not be possible to delete favorite post if the favorite post does not exists', async () => {
    const result = await sut.execute({
      postId: 'post-id',
      userId: 'user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

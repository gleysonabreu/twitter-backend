import { makeFavorite } from 'test/factories/make-favorite';
import { FavoritePostUseCase } from './favorite-post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { FavoritePostAlreadyExistsError } from './errors/favorite-post-already-exists-error';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';

let inMemoryFavoritesRepository: InMemoryFavoritesRepository;
let sut: FavoritePostUseCase;

describe('Favorite post', () => {
  beforeEach(() => {
    inMemoryFavoritesRepository = new InMemoryFavoritesRepository();
    sut = new FavoritePostUseCase(inMemoryFavoritesRepository);
  });

  it('should be able to create a new favorite', async () => {
    const result = await sut.execute({
      postId: 'any-post-id',
      userId: 'any-user-id',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      favorite: inMemoryFavoritesRepository.favorites[0],
    });
  });

  it('should not be possible to favorite a post if the post is marked as favorite', async () => {
    const favorite = makeFavorite({
      postId: new UniqueEntityID('post-id'),
      userId: new UniqueEntityID('user-id'),
    });
    inMemoryFavoritesRepository.favorites.push(favorite);

    const result = await sut.execute({
      postId: 'post-id',
      userId: 'user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(FavoritePostAlreadyExistsError);
    expect(result.value).toEqual(new FavoritePostAlreadyExistsError());
    expect(inMemoryFavoritesRepository.favorites).toHaveLength(1);
  });
});

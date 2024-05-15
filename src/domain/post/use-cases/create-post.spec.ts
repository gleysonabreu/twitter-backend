import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { CreatePostUseCase } from './create-post';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';

let sut: CreatePostUseCase;
let inMemoryPostsRepository: InMemoryPostsRepository;

describe('Create Post', () => {
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
    sut = new CreatePostUseCase(inMemoryPostsRepository);
  });
  it('should be able to create a new post', async () => {
    const result = await sut.execute({
      userId: 'any-id',
      content: 'any-string',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      post: inMemoryPostsRepository.posts[0],
    });
  });
});

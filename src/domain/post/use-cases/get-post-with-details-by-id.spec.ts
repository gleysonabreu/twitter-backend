import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { FetchUserPostsUseCase } from './fetch-user-posts';
import { makePost } from 'test/factories/make-post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: FetchUserPostsUseCase;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFavoritesRepository: InMemoryFavoritesRepository;
let inMemoryLikesRepository: InMemoryLikesRepository;
let inMemoryFollowsRepository: InMemoryFollowsRepository;
let inMemoryCommentsRepository: InMemoryCommentsRepository;

describe('Get Post With Details', () => {
  beforeEach(() => {
    const postMock = {} as InMemoryPostsRepository;
    const likesCommentMock = {} as InMemoryLikesCommentRepository;

    inMemoryFavoritesRepository = new InMemoryFavoritesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository(
      postMock,
      inMemoryFollowsRepository,
    );
    inMemoryFollowsRepository = new InMemoryFollowsRepository(
      inMemoryUsersRepository,
      postMock,
    );
    inMemoryLikesRepository = new InMemoryLikesRepository();
    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      inMemoryUsersRepository,
      likesCommentMock,
    );
    inMemoryPostsRepository = new InMemoryPostsRepository(
      inMemoryUsersRepository,
      inMemoryLikesRepository,
      inMemoryFavoritesRepository,
      inMemoryFollowsRepository,
      inMemoryCommentsRepository,
    );
    sut = new FetchUserPostsUseCase(inMemoryPostsRepository);
  });

  it('should be able to get post with details', async () => {
    const user = makeUser({}, new UniqueEntityID('user-id'));
    inMemoryUsersRepository.users.push(user);
    const post = makePost({ userId: user.id });
    inMemoryPostsRepository.posts.push(post);

    const result = await sut.execute({
      userId: 'user-id',
      page: 1,
    });
    expect(result.isRight()).toBe(true);
    expect(result.value.posts).toHaveLength(1);
    expect(result.value.posts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          postId: post.id,
          userId: user.id,
        }),
      ]),
    );
  });
});

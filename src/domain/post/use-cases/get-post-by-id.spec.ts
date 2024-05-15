import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { makePost } from 'test/factories/make-post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { GetPostByIdUseCase } from './get-post-by-id';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: GetPostByIdUseCase;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryCommentsRepository: InMemoryCommentsRepository;

describe('Get Post By Id', () => {
  beforeEach(() => {
    const postMock = {} as InMemoryPostsRepository;
    const likesMock = {} as InMemoryLikesRepository;
    const userMock = {} as InMemoryUsersRepository;
    const favMock = {} as InMemoryFavoritesRepository;
    const followsMock = {} as InMemoryFollowsRepository;
    const likesCommentMock = {} as InMemoryLikesCommentRepository;

    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      userMock,
      likesCommentMock,
    );
    inMemoryUsersRepository = new InMemoryUsersRepository(
      postMock,
      followsMock,
    );
    inMemoryPostsRepository = new InMemoryPostsRepository(
      userMock,
      likesMock,
      favMock,
      followsMock,
      inMemoryCommentsRepository,
    );
    sut = new GetPostByIdUseCase(inMemoryPostsRepository);
  });

  it('should be able to get post by id', async () => {
    const user = makeUser({}, new UniqueEntityID('user-1'));
    inMemoryUsersRepository.users.push(user);

    const post = makePost({ userId: user.id }, new UniqueEntityID('post-1'));
    inMemoryPostsRepository.posts.push(post);

    const result = await sut.execute({ userId: 'user-1', postId: 'post-1' });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      post: inMemoryPostsRepository.posts[0],
    });
  });

  it('should not be able to get post by id if post does not exists', async () => {
    const result = await sut.execute({ userId: 'user-1', postId: 'post-1' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });

  it('should not be able to get post by id if user is not the owner', async () => {
    const post = makePost(
      { userId: new UniqueEntityID('user-1') },
      new UniqueEntityID('post-1'),
    );
    inMemoryPostsRepository.posts.push(post);

    const result = await sut.execute({ userId: 'user-2', postId: 'post-1' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(result.value).toEqual(new NotAllowedError());
  });
});

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { CommentOnPostUseCase } from './comment-on-post';
import { InMemoryPostsRepository } from 'test/repositories/in-memory.posts-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryLikesRepository } from 'test/repositories/in-memory-likes-repository';
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository';
import { InMemoryFollowsRepository } from 'test/repositories/in-memory-follows-repository';
import { makePost } from 'test/factories/make-post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: CommentOnPostUseCase;
let inMemoryPostsRepository: InMemoryPostsRepository;
let inMemoryCommentsRepository: InMemoryCommentsRepository;

describe('Comment on post', () => {
  beforeEach(() => {
    const usersMock = {} as InMemoryUsersRepository;
    const likesMock = {} as InMemoryLikesRepository;
    const favMock = {} as InMemoryFavoritesRepository;
    const followsMock = {} as InMemoryFollowsRepository;
    const commentsMock = {} as InMemoryCommentsRepository;
    const likesCommentMock = {} as InMemoryLikesCommentRepository;

    inMemoryPostsRepository = new InMemoryPostsRepository(
      usersMock,
      likesMock,
      favMock,
      followsMock,
      commentsMock,
    );
    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      usersMock,
      likesCommentMock,
    );
    sut = new CommentOnPostUseCase(
      inMemoryPostsRepository,
      inMemoryCommentsRepository,
    );
  });

  it('should be able to create a new comment', async () => {
    const post = makePost({}, new UniqueEntityID('post-1'));
    inMemoryPostsRepository.posts.push(post);

    const result = await sut.execute({
      content: 'Test comment',
      postId: 'post-1',
      userId: 'any-user-id',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      comment: inMemoryCommentsRepository.comments[0],
    });
  });

  it('should not be able to create a new comment if post does not exist', async () => {
    const result = await sut.execute({
      content: 'Test comment',
      postId: 'any-post-id',
      userId: 'any-user-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

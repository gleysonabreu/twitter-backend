import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { InMemoryCommentsRepository } from 'test/repositories/in-memory-comments-repository';
import { ReplyCommentUseCase } from './reply-comment';
import { makeComment } from 'test/factories/make-comment';
import { InMemoryLikesCommentRepository } from 'test/repositories/in-memory-likes-comment-repository';

let sut: ReplyCommentUseCase;
let inMemoryCommentsRepository: InMemoryCommentsRepository;

describe('Reply comment', () => {
  beforeEach(() => {
    const usersMock = {} as InMemoryUsersRepository;
    const likesCommentMock = {} as InMemoryLikesCommentRepository;

    inMemoryCommentsRepository = new InMemoryCommentsRepository(
      usersMock,
      likesCommentMock,
    );
    sut = new ReplyCommentUseCase(inMemoryCommentsRepository);
  });

  it('should be able to reply a comment', async () => {
    const comment = makeComment(
      { postId: new UniqueEntityID('post-1') },
      new UniqueEntityID('reply-1'),
    );
    inMemoryCommentsRepository.comments.push(comment);

    const result = await sut.execute({
      commentId: comment.id.toString(),
      content: 'Test reply',
      userId: 'user-2',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryCommentsRepository.comments).toHaveLength(2);
    expect(result.value).toEqual({
      comment: inMemoryCommentsRepository.comments[1],
    });
  });

  it('should not be able to reply a comment if comment does not exist', async () => {
    const result = await sut.execute({
      content: 'Test reply',
      userId: 'any-user-id',
      commentId: 'comment-id',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
    expect(result.value).toEqual(new ResourceNotFoundError());
  });
});

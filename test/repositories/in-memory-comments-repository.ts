import { PaginationParams } from '@/core/repositories/pagination-params';
import { Comment } from '@/domain/post/entities/comment';
import { CommentWithUser } from '@/domain/post/entities/value-objects/comment-with-user';
import { CommentsRepository } from '@/domain/post/repositories/comments-repository';
import { InMemoryUsersRepository } from './in-memory-users-repository';
import { InMemoryLikesCommentRepository } from './in-memory-likes-comment-repository';

export class InMemoryCommentsRepository implements CommentsRepository {
  constructor(
    private inMemoryUsersRepository: InMemoryUsersRepository,
    private inMemoryLikesCommentRepository: InMemoryLikesCommentRepository,
  ) {}

  async findByIdDetails(
    commentId: string,
    userId: string,
  ): Promise<CommentWithUser> {
    const comment = this.comments.find(
      (comment) => comment.id.toString() === commentId,
    );

    if (!comment) {
      return null;
    }

    const user = this.inMemoryUsersRepository.users.find(
      (user) => user.id.toString() === userId,
    );

    if (!user) {
      throw new Error(`User with ID ${user.id.toString()} does not exist.`);
    }

    const findParentComment = await this.findByIdDetails(
      comment.parentId?.toString(),
      userId,
    );

    const totalComments = this.comments.filter(
      (commentTotal) => commentTotal.parentId?.equals(comment.id),
    ).length;

    const totalLikes = this.inMemoryLikesCommentRepository.likeComments.filter(
      (likeComment) => likeComment.commentId.toString() === commentId,
    ).length;

    const isLiked = this.inMemoryLikesCommentRepository.likeComments.find(
      (likeComment) =>
        likeComment.commentId.equals(comment.id) &&
        likeComment.userId.toString() === userId,
    );

    const commentWithUser = CommentWithUser.create({
      commentId: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      postId: comment.postId,
      userId: comment.userId,
      updatedAt: comment.updatedAt,
      parentId: comment.parentId,
      parent: findParentComment,
      user: user,
      totalComments: totalComments,
      totalLikes: totalLikes,
      isLiked: !!isLiked,
    });

    return commentWithUser;
  }

  async fetchReplies(
    userId: string,
    commentId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithUser[]> {
    const replies = this.comments
      .filter((comment) => comment.parentId?.toString() === commentId)
      .map((comment) => {
        const user = this.inMemoryUsersRepository.users.find((user) =>
          user.id.equals(comment.userId),
        );

        if (!user) {
          throw new Error(`User with ID ${user.id.toString()} does not exist.`);
        }

        const totalComments = this.comments.filter(
          (commentTotal) => commentTotal.parentId?.equals(comment.id),
        ).length;

        const totalLikes =
          this.inMemoryLikesCommentRepository.likeComments.filter(
            (likeComment) => likeComment.commentId.equals(comment.id),
          ).length;

        const isLiked = this.inMemoryLikesCommentRepository.likeComments.find(
          (likeComment) =>
            likeComment.commentId.equals(comment.id) &&
            likeComment.userId.toString() === userId,
        );

        const commentWithUser = CommentWithUser.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          postId: comment.postId,
          userId: comment.userId,
          updatedAt: comment.updatedAt,
          parentId: comment.parentId,
          user: user,
          totalComments: totalComments,
          totalLikes: totalLikes,
          isLiked: !!isLiked,
        });

        return commentWithUser;
      })
      .slice((page - 1) * 20, page * 20);

    return replies;
  }

  public comments: Comment[] = [];

  async delete(comment: Comment): Promise<void> {
    const itemIndex = this.comments.findIndex((item) => item.id === comment.id);
    this.comments.splice(itemIndex, 1);
  }

  async findByPostId(
    postId: string,
    userId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithUser[]> {
    const comments = this.comments
      .filter(
        (comment) => comment.postId.toString() === postId && !comment.parentId,
      )
      .map((comment) => {
        const user = this.inMemoryUsersRepository.users.find((user) =>
          user.id.equals(comment.userId),
        );

        if (!user) {
          throw new Error(`User with ID ${user.id.toString()} does not exist.`);
        }

        const totalComments = this.comments.filter(
          (commentTotal) => commentTotal.parentId?.equals(comment.id),
        ).length;

        const totalLikes =
          this.inMemoryLikesCommentRepository.likeComments.filter(
            (likeComment) => likeComment.commentId.equals(comment.id),
          ).length;

        const isLiked = this.inMemoryLikesCommentRepository.likeComments.find(
          (likeComment) =>
            likeComment.commentId.equals(comment.id) &&
            likeComment.userId.toString() === userId,
        );

        const commentWithUser = CommentWithUser.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          postId: comment.postId,
          userId: comment.userId,
          updatedAt: comment.updatedAt,
          user: user,
          totalComments,
          totalLikes,
          isLiked: !!isLiked,
        });

        return commentWithUser;
      })
      .slice((page - 1) * 20, page * 20);

    return comments;
  }

  async findById(id: string): Promise<Comment> {
    const comment = this.comments.find(
      (comment) => comment.id.toString() === id,
    );

    if (!comment) {
      return null;
    }

    return comment;
  }

  async save(comment: Comment): Promise<void> {
    const itemIndex = this.comments.findIndex((item) =>
      item.id.equals(comment.id),
    );

    this.comments[itemIndex] = comment;
  }

  async create(comment: Comment): Promise<void> {
    this.comments.push(comment);
  }
}

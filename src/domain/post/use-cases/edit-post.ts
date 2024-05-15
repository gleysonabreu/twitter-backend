import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../repositories/posts-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error';
import { Post } from '../entities/post';

type EditPostUseCaseRequest = {
  userId: string;
  postId: string;
  content: string;
};

type EditPostUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    post: Post;
  }
>;

@Injectable()
export class EditPostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    content,
    postId,
    userId,
  }: EditPostUseCaseRequest): Promise<EditPostUseCaseResponse> {
    const post = await this.postsRepository.findById(postId);

    if (!post) {
      return left(new ResourceNotFoundError());
    }

    if (userId !== post.userId.toString()) {
      return left(new NotAllowedError());
    }

    post.content = content;

    await this.postsRepository.save(post);
    return right({ post });
  }
}

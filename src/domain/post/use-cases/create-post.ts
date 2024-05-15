import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Post } from '../entities/post';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PostsRepository } from '../repositories/posts-repository';

type CreatePostUseCaseRequest = {
  userId: string;
  content: string;
};

type CreatePostUseCaseResponse = Either<
  null,
  {
    post: Post;
  }
>;

@Injectable()
export class CreatePostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    content,
    userId,
  }: CreatePostUseCaseRequest): Promise<CreatePostUseCaseResponse> {
    const post = Post.create({ content, userId: new UniqueEntityID(userId) });

    await this.postsRepository.create(post);
    return right({ post });
  }
}

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Post, PostProps } from '@/domain/post/entities/post';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaPostMapper } from '@/infra/database/prisma/repositories/mappers/prisma-post-mapper';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makePost(
  override: Partial<PostProps> = {},
  id?: UniqueEntityID,
) {
  const post = Post.create(
    {
      content: faker.lorem.text(),
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return post;
}

@Injectable()
export class PostFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPost(data: Partial<PostProps> = {}): Promise<Post> {
    const post = makePost(data);

    await this.prisma.post.create({
      data: PrismaPostMapper.toPrisma(post),
    });

    return post;
  }
}

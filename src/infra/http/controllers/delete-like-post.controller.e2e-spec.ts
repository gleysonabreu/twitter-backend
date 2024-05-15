import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { LikeFactory } from 'test/factories/make-like';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Delete Like Post E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let postFactory: PostFactory;
  let likeFactory: LikeFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, LikeFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    postFactory = moduleRef.get(PostFactory);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    likeFactory = moduleRef.get(LikeFactory);

    await app.init();
  });

  test('[DELETE] /posts/:id/unlike - delete like post', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const post = await postFactory.makePrismaPost({
      userId: user.id,
    });

    await likeFactory.makePrismaLike({
      postId: post.id,
      userId: user.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/posts/${post.id.toString()}/unlike`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(204);

    const likeDatabase = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id.toString(),
          postId: post.id.toString(),
        },
      },
    });

    expect(likeDatabase).toBeNull();
  });
});

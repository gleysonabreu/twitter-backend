import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Create Post Favorite E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let postFactory: PostFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    postFactory = moduleRef.get(PostFactory);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /posts/:id/favorite - create post favorite', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const post = await postFactory.makePrismaPost({
      userId: user.id,
    });

    const response = await request(app.getHttpServer())
      .post(`/posts/${post.id.toString()}/favorite`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(204);

    const favoriteDatabase = await prisma.favorite.findUnique({
      where: {
        userId_postId: {
          userId: user.id.toString(),
          postId: post.id.toString(),
        },
      },
    });

    expect(favoriteDatabase).toBeTruthy();
  });
});

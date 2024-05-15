import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { FavoriteFactory } from 'test/factories/make-favorite';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Delete Post Favorite E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let postFactory: PostFactory;
  let favoriteFactory: FavoriteFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, FavoriteFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    postFactory = moduleRef.get(PostFactory);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    favoriteFactory = moduleRef.get(FavoriteFactory);

    await app.init();
  });

  test('[DELETE] /posts/:id/unfavorite - delete post favorite', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const post = await postFactory.makePrismaPost({
      userId: user.id,
    });

    await favoriteFactory.makePrismaFavorite({
      postId: post.id,
      userId: user.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/posts/${post.id.toString()}/unfavorite`)
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

    expect(favoriteDatabase).toBeNull();
  });
});

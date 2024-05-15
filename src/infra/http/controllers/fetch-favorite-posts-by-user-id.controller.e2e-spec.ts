import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { FavoriteFactory } from 'test/factories/make-favorite';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Favorite Posts By User Id', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
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
    jwtService = moduleRef.get(JwtService);
    favoriteFactory = moduleRef.get(FavoriteFactory);

    await app.init();
  });

  test('[GET] /favorites - fetch favorite posts by user id', async () => {
    const user = await userFactory.makePrismaUser();
    const user2 = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const [post, post2] = await Promise.all([
      postFactory.makePrismaPost({
        userId: user.id,
        content: 'Content 01',
      }),
      postFactory.makePrismaPost({
        userId: user2.id,
        content: 'Content 02',
      }),
      postFactory.makePrismaPost({
        userId: user2.id,
        content: 'Content 03',
      }),
    ]);

    await Promise.all([
      favoriteFactory.makePrismaFavorite({
        userId: user.id,
        postId: post.id,
      }),
      favoriteFactory.makePrismaFavorite({
        userId: user.id,
        postId: post2.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/favorites`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.posts).toHaveLength(2);
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          content: 'Content 01',
          isFavorite: true,
        }),
        expect.objectContaining({
          content: 'Content 02',
          isFavorite: true,
        }),
      ]),
    });
  });
});

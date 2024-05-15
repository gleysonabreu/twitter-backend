import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Feed Profile E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let postFactory: PostFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    postFactory = moduleRef.get(PostFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /profile/:userId/feed - fetch feed user', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const user2 = await userFactory.makePrismaUser();

    await Promise.all([
      postFactory.makePrismaPost({
        userId: user.id,
        content: 'Content 01',
      }),
      postFactory.makePrismaPost({
        userId: user2.id,
        content: 'Content 02',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/profile/${user.id}/feed`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.posts).toHaveLength(1);
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          content: 'Content 01',
          isLiked: false,
          isFavorite: false,
        }),
      ]),
    });
  });
});

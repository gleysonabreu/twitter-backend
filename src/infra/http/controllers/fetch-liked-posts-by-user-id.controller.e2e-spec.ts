import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { LikeFactory } from 'test/factories/make-like';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Liked Posts By User Id', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
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
    jwtService = moduleRef.get(JwtService);
    likeFactory = moduleRef.get(LikeFactory);

    await app.init();
  });

  test('[GET] /likes - fetch liked posts by user id', async () => {
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
      likeFactory.makePrismaLike({
        userId: user.id,
        postId: post.id,
      }),
      likeFactory.makePrismaLike({
        userId: user.id,
        postId: post2.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/likes`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.posts).toHaveLength(2);
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          content: 'Content 01',
          isLiked: true,
        }),
        expect.objectContaining({
          content: 'Content 02',
          isLiked: true,
        }),
      ]),
    });
  });
});

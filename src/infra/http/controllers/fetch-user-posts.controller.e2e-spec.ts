import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { FollowFactory } from 'test/factories/make-follow';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch User Posts', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwtService: JwtService;
  let postFactory: PostFactory;
  let followFactory: FollowFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, FollowFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    postFactory = moduleRef.get(PostFactory);
    followFactory = moduleRef.get(FollowFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /posts - get user posts', async () => {
    const [user, user2, user3] = await Promise.all([
      userFactory.makePrismaUser(),
      userFactory.makePrismaUser(),
      userFactory.makePrismaUser(),
    ]);
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    await followFactory.makePrismaFollow({
      followingId: user.id,
      followedById: user3.id,
    });

    await Promise.all([
      postFactory.makePrismaPost({
        userId: user.id,
        content: 'Content 01',
      }),
      postFactory.makePrismaPost({
        userId: user2.id,
        content: 'Content 02',
      }),
      postFactory.makePrismaPost({
        userId: user3.id,
        content: 'Content 03',
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/posts`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.posts).toHaveLength(2);
    expect(response.body).toEqual({
      posts: expect.arrayContaining([
        expect.objectContaining({
          content: 'Content 01',
        }),
        expect.objectContaining({
          content: 'Content 03',
        }),
      ]),
    });
  });
});

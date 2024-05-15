import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { FollowFactory } from 'test/factories/make-follow';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Following User', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let followFactory: FollowFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, FollowFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    followFactory = moduleRef.get(FollowFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /users/:id/following - fetch following users', async () => {
    const user = await userFactory.makePrismaUser();
    const user2 = await userFactory.makePrismaUser();
    const user3 = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user2.id.toString() });

    await Promise.all([
      followFactory.makePrismaFollow({
        followingId: user.id,
        followedById: user2.id,
      }),
      followFactory.makePrismaFollow({
        followingId: user.id,
        followedById: user3.id,
      }),
      followFactory.makePrismaFollow({
        followingId: user2.id,
        followedById: user3.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id.toString()}/following`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.following).toHaveLength(2);
    expect(response.body).toEqual({
      following: expect.arrayContaining([
        expect.objectContaining({
          id: user2.id.toString(),
          isFollowing: false,
        }),
        expect.objectContaining({
          id: user3.id.toString(),
          isFollowing: true,
        }),
      ]),
    });
  });
});

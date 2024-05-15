import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';

describe('Find User Details By Id', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /users/:id/details - find user details by id', async () => {
    const user = await userFactory.makePrismaUser({ firstName: 'John' });
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id.toString()}/details`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      user: expect.objectContaining({
        firstName: 'John',
        totalPosts: 0,
        isFollowing: false,
      }),
    });
  });
});

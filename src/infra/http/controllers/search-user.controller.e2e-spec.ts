import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';

describe('Search Users E2E', () => {
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

  test('[GET] /search?query=John - search a user', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    await Promise.all([
      userFactory.makePrismaUser({ firstName: 'John' }),
      userFactory.makePrismaUser({ username: 'johndoe' }),
    ]);

    const response = await request(app.getHttpServer())
      .get('/search')
      .query({ query: 'John' })
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.users).toHaveLength(2);
    expect(response.body).toEqual({
      users: expect.arrayContaining([
        expect.objectContaining({
          firstName: 'John',
        }),
        expect.objectContaining({
          username: 'johndoe',
        }),
      ]),
    });
  });
});

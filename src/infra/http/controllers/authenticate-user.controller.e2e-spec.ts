import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';

describe('Authenticate User E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);

    await app.init();
  });

  test('[POST] /auth - auth user', async () => {
    await userFactory.makePrismaUser({
      email: 'johndoe@example.com',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer()).post('/auth').send({
      login: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });
  });

  test('[POST] /auth - not auth user if wrong login', async () => {
    const response = await request(app.getHttpServer()).post('/auth').send({
      login: 'wrong-login',
      password: '123456',
    });

    expect(response.status).toBe(401);
  });
});

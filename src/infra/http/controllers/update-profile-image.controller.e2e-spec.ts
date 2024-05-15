import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';

describe('Update Profile Image (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PATCH] /users/profile-image', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .patch('/users/profile-image')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/images/test-upload.png');

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      profileImage: expect.any(String),
    });
  });
});

import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

describe('Create Account E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts - create an user', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        username: 'johndoe',
        birthDate: new Date('1998-02-16'),
        bio: 'john doe buy the social',
        password: '123456',
      });

    expect(response.status).toBe(201);

    const userDatabase = await prisma.user.findUnique({
      where: {
        username: 'johndoe',
      },
    });

    expect(userDatabase).toBeTruthy();
  });

  test('[POST] /accounts - missing parameters', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      bio: 'john doe buy the social',
      password: '123456',
    });

    expect(response.status).toBe(400);
  });
});

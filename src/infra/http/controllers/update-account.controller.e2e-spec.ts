import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';

describe('Update Account E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /accounts - update user', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .put('/accounts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        username: 'johndoe',
        birthDate: '02-16-1998',
        bio: 'john doe buy the social',
      });

    expect(response.status).toBe(204);

    const userDatabase = await prisma.user.findUnique({
      where: {
        username: 'johndoe',
      },
    });

    expect(userDatabase).toBeTruthy();
  });
});

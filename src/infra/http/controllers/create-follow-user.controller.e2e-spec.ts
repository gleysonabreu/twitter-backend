import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { FollowFactory } from 'test/factories/make-follow';
import { UserFactory } from 'test/factories/make-user';

describe('Create Follow User E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let followFactory: FollowFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, FollowFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    followFactory = moduleRef.get(FollowFactory);

    await app.init();
  });

  test('[POST] /follows/:followedBy - create user follow', async () => {
    const user = await userFactory.makePrismaUser();
    const userOther = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/follows/${userOther.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(204);

    const followOnDatabase = await prisma.follow.findUnique({
      where: {
        followingId_followedById: {
          followedById: userOther.id.toString(),
          followingId: user.id.toString(),
        },
      },
    });

    expect(followOnDatabase).toBeTruthy();
  });

  test('[DELETE] /follows/:followedBy - remove user follow', async () => {
    const user = await userFactory.makePrismaUser();
    const userOther = await userFactory.makePrismaUser();
    const user3 = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    await Promise.all([
      followFactory.makePrismaFollow({
        followingId: user.id,
        followedById: user3.id,
      }),
      followFactory.makePrismaFollow({
        followingId: user.id,
        followedById: userOther.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .post(`/follows/${userOther.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(204);

    const followOnDatabase = await prisma.follow.findUnique({
      where: {
        followingId_followedById: {
          followedById: userOther.id.toString(),
          followingId: user.id.toString(),
        },
      },
    });

    const follows = await prisma.follow.findMany({
      where: {
        followingId: user.id.toString(),
      },
    });

    expect(followOnDatabase).toBeFalsy();
    expect(follows).toHaveLength(1);
  });
});

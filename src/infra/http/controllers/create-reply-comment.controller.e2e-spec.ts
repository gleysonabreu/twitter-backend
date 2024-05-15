import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CommentFactory } from 'test/factories/make-comment';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Create Reply Comment E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let postFactory: PostFactory;
  let commentFactory: CommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, CommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    postFactory = moduleRef.get(PostFactory);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);
    commentFactory = moduleRef.get(CommentFactory);

    await app.init();
  });

  test('[POST] /comments/:id/reply - create an reply comment', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const post = await postFactory.makePrismaPost({
      userId: user.id,
    });

    const comment = await commentFactory.makePrismaComment({
      postId: post.id,
      userId: user.id,
    });

    const response = await request(app.getHttpServer())
      .post(`/comments/${comment.id.toString()}/reply`)
      .send({ content: 'Test reply' })
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(204);

    const replyOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'Test reply',
      },
    });

    expect(replyOnDatabase).toBeTruthy();
  });
});

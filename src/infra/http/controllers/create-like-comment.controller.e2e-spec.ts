import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CommentFactory } from 'test/factories/make-comment';
import { LikeCommentFactory } from 'test/factories/make-like-comment';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Create Like Comment E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let postFactory: PostFactory;
  let commentFactory: CommentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, PostFactory, CommentFactory, LikeCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    postFactory = moduleRef.get(PostFactory);
    commentFactory = moduleRef.get(CommentFactory);
    prisma = moduleRef.get(PrismaService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /comments/:id/like - create a comment like', async () => {
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
      .post(`/comments/${comment.id.toString()}/like`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(204);

    const likeCommentOnDatabase = await prisma.likeComment.findUnique({
      where: {
        userId_commentId: {
          userId: user.id.toString(),
          commentId: comment.id.toString(),
        },
      },
    });

    expect(likeCommentOnDatabase).toBeTruthy();
  });
});

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CommentFactory } from 'test/factories/make-comment';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Fetch Comments On Post E2E', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
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
    jwtService = moduleRef.get(JwtService);
    commentFactory = moduleRef.get(CommentFactory);

    await app.init();
  });

  test('[GET] /posts/:id/comments - fetch comments on post', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const post = await postFactory.makePrismaPost({
      userId: user.id,
    });

    const commentToReply = await commentFactory.makePrismaComment({
      userId: user.id,
      postId: post.id,
    });

    const [comment, comment2] = await Promise.all([
      commentFactory.makePrismaComment({ userId: user.id, postId: post.id }),
      commentFactory.makePrismaComment({ userId: user.id, postId: post.id }),
      commentFactory.makePrismaComment({
        userId: user.id,
        postId: post.id,
        parentId: commentToReply.id,
      }),
    ]);

    const response = await request(app.getHttpServer())
      .get(`/posts/${post.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.comments).toHaveLength(3);
    expect(response.body).toEqual({
      comments: expect.arrayContaining([
        expect.objectContaining({
          id: comment.id.toString(),
          userId: user.id.toString(),
        }),
        expect.objectContaining({
          id: comment2.id.toString(),
          userId: user.id.toString(),
        }),
      ]),
    });
  });
});

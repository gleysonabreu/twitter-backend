import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { CommentFactory } from 'test/factories/make-comment';
import { PostFactory } from 'test/factories/make-post';
import { UserFactory } from 'test/factories/make-user';

describe('Get Comment By Id', () => {
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

  test('[GET] /comments/:id - get comment by id', async () => {
    const user = await userFactory.makePrismaUser();
    const accessToken = jwtService.sign({ sub: user.id.toString() });

    const post = await postFactory.makePrismaPost({
      userId: user.id,
    });
    const comment = await commentFactory.makePrismaComment({
      postId: post.id,
      userId: user.id,
      content: 'Content 01',
    });

    const response = await request(app.getHttpServer())
      .get(`/comments/${comment.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      comment: expect.objectContaining({
        content: 'Content 01',
      }),
    });
  });
});

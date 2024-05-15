import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { CreateAccountController } from './controllers/create-account.controller';
import { RegisterUserUseCase } from '@/domain/user/use-cases/register-user';
import { AuthenticateUserController } from './controllers/authenticate-user.controller';
import { AuthenticateUserUseCase } from '@/domain/user/use-cases/authenticate-user';
import { CreatePostController } from './controllers/create-post.controller';
import { CreatePostUseCase } from '@/domain/post/use-cases/create-post';
import { EditPostController } from './controllers/edit-post.controller';
import { EditPostUseCase } from '@/domain/post/use-cases/edit-post';
import { DeletePostUseCase } from '@/domain/post/use-cases/delete-post';
import { DeletePostController } from './controllers/delete-post.controller';
import { CreateFavoritePostController } from './controllers/create-favorite-post.controller';
import { FavoritePostUseCase } from '@/domain/post/use-cases/favorite-post';
import { DeleteFavoritePostController } from './controllers/delete-favorite-post.controller';
import { DeleteFavoritePostUseCase } from '@/domain/post/use-cases/delete-favorite-post';
import { MeController } from './controllers/me.controller';
import { FindUserByIdUseCase } from '@/domain/user/use-cases/find-user-by-id';
import { FetchUserPostsUseCase } from '@/domain/post/use-cases/fetch-user-posts';
import { FetchUserPostsController } from './controllers/fetch-user-posts.controller';
import { GetPostByIdController } from './controllers/get-post-by-id.controller';
import { FetchFavoritePostsByUserIdController } from './controllers/fetch-favorite-posts-by-user-id.controller';
import { FetchFavoritePostsUseCase } from '@/domain/post/use-cases/fetch-favorite-posts';
import { CreateLikePostController } from './controllers/create-like-post.controller';
import { LikePostUseCase } from '@/domain/post/use-cases/like-post';
import { DeleteLikePostController } from './controllers/delete-like-post.controller';
import { UnLikePostUseCase } from '@/domain/post/use-cases/unlike-post';
import { FetchLikedPostsByUserIdController } from './controllers/fetch-liked-posts-by-user-id.controller';
import { FetchPostsLikedUseCase } from '@/domain/post/use-cases/fetch-posts-liked';
import { GetUserByUsernameUseCase } from '@/domain/user/use-cases/get-user-by-username';
import { FetchFeedProfileController } from './controllers/fetch-feed-profile.controller';
import { FetchFeedProfileUseCase } from '@/domain/post/use-cases/fetch-feed-profile';
import { CreateFollowUserController } from './controllers/create-follow-user.controller';
import { FollowUserUseCase } from '@/domain/user/use-cases/follow-user';
import { FetchFollowingUserController } from './controllers/fetch-following-user.controller';
import { FetchFollowingUserUseCase } from '@/domain/user/use-cases/fetch-following-user';
import { FetchFollowersUserController } from './controllers/fetch-followers-user.controller';
import { FetchFollowersUserUseCase } from '@/domain/user/use-cases/fetch-followers-user';
import { SearchUserController } from './controllers/search-user.controller';
import { SearchUserUseCase } from '@/domain/user/use-cases/search-user';
import { CommentOnPostUseCase } from '@/domain/post/use-cases/comment-on-post';
import { CreateCommentOnPostController } from './controllers/create-comment-on-post.controller';
import { DeleteCommentOnPostController } from './controllers/delete-comment-on-post.controller';
import { DeleteCommentOnPostUseCase } from '@/domain/post/use-cases/delete-comment-on-post';
import { EditCommentOnPostUseCase } from '@/domain/post/use-cases/edit-comment-on-post';
import { EditCommentOnPostController } from './controllers/edit-comment-on-post.controller';
import { FetchCommentsOnPostController } from './controllers/fetch-comments-on-post.controller';
import { FetchCommentsOnPostUseCase } from '@/domain/post/use-cases/fetch-comments-on-post';
import { GetPostWithDetailsByIdUseCase } from '@/domain/post/use-cases/get-post-with-details-by-id';
import { GetCommentByIdController } from './controllers/get-comment-by-id.controller';
import { GetCommentByIdUseCase } from '@/domain/post/use-cases/get-comment-by-id';
import { ReplyCommentUseCase } from '@/domain/post/use-cases/reply-comment';
import { CreateReplyCommentController } from './controllers/create-reply-comment.controller';
import { FetchRepliesController } from './controllers/fetch-replies.controller';
import { FetchReplyCommentsUseCase } from '@/domain/post/use-cases/fetch-reply-comments';
import { GetCommentDetailsByIdController } from './controllers/get-comment-details-by-id.controller';
import { GetCommentDetailsByIdUseCase } from '@/domain/post/use-cases/get-comment-details-by-id';
import { CreateLikeCommentController } from './controllers/create-like-comment.controller';
import { LikeCommentUseCase } from '@/domain/post/use-cases/like-comment';
import { UnLikeCommentUseCase } from '@/domain/post/use-cases/unlike-comment';
import { DeleteLikeCommentController } from './controllers/delete-like-comment.controller';
import { ChangePasswordUseCase } from '@/domain/user/use-cases/change-password';
import { ChangePasswordController } from './controllers/change-password.controller';
import { UpdateAccountController } from './controllers/update-account.controller';
import { UpdateAccountUseCase } from '@/domain/user/use-cases/update-account';
import { DateModule } from '../date/date.module';
import { ForgotPasswordController } from './controllers/forgot-password.controller';
import { ForgotPasswordUseCase } from '@/domain/user/use-cases/forgot-password';
import { ResetPasswordController } from './controllers/reset-password.controller';
import { ResetPasswordUseCase } from '@/domain/user/use-cases/reset-password';
import { StorageModule } from '../storage/storage.module';
import { UploadProfileImageController } from './controllers/update-profile-image.controller';
import { UploadProfileImageUseCase } from '@/domain/user/use-cases/upload-profile-image';
import { UploadCoverImageController } from './controllers/update-cover-image.controller';
import { UploadCoverImageUseCase } from '@/domain/user/use-cases/upload-cover-image';
import { GetUserProfileByUsernameController } from './controllers/get-user-profile-by-username.controller';
import { FindUserDetailsByIdController } from './controllers/find-user-details-by-id.controller';
import { FindUserDetailsByIdUseCase } from '@/domain/user/use-cases/find-user-details-by-id';

@Module({
  imports: [DatabaseModule, CryptographyModule, DateModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    CreatePostController,
    EditPostController,
    DeletePostController,
    CreateFavoritePostController,
    DeleteFavoritePostController,
    MeController,
    FetchUserPostsController,
    GetPostByIdController,
    FetchFavoritePostsByUserIdController,
    CreateLikePostController,
    DeleteLikePostController,
    FetchLikedPostsByUserIdController,
    GetUserProfileByUsernameController,
    FetchFeedProfileController,
    CreateFollowUserController,
    FetchFollowingUserController,
    FetchFollowersUserController,
    SearchUserController,
    CreateCommentOnPostController,
    DeleteCommentOnPostController,
    EditCommentOnPostController,
    FetchCommentsOnPostController,
    GetCommentByIdController,
    CreateReplyCommentController,
    FetchRepliesController,
    GetCommentDetailsByIdController,
    CreateLikeCommentController,
    DeleteLikeCommentController,
    ChangePasswordController,
    UpdateAccountController,
    ForgotPasswordController,
    ResetPasswordController,
    UploadProfileImageController,
    UploadCoverImageController,
    FindUserDetailsByIdController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    CreatePostUseCase,
    EditPostUseCase,
    DeletePostUseCase,
    FavoritePostUseCase,
    DeleteFavoritePostUseCase,
    FindUserByIdUseCase,
    FetchUserPostsUseCase,
    GetPostWithDetailsByIdUseCase,
    FetchFavoritePostsUseCase,
    LikePostUseCase,
    UnLikePostUseCase,
    FetchPostsLikedUseCase,
    GetUserByUsernameUseCase,
    FetchFeedProfileUseCase,
    FollowUserUseCase,
    FetchFollowingUserUseCase,
    FetchFollowersUserUseCase,
    SearchUserUseCase,
    CommentOnPostUseCase,
    DeleteCommentOnPostUseCase,
    EditCommentOnPostUseCase,
    FetchCommentsOnPostUseCase,
    GetCommentByIdUseCase,
    ReplyCommentUseCase,
    FetchReplyCommentsUseCase,
    GetCommentDetailsByIdUseCase,
    LikeCommentUseCase,
    UnLikeCommentUseCase,
    ChangePasswordUseCase,
    UpdateAccountUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    UploadProfileImageUseCase,
    UploadCoverImageUseCase,
    FindUserDetailsByIdUseCase,
  ],
})
export class HttpModule {}

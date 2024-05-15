import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { InvalidUploadTypeError } from './errors/invalid-upload-type-error';
import { UsersRepository } from '../repositories/users-repository';
import { Uploader } from '@/core/storage/uploader';
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found';

type UploadCoverImageUseCaseRequest = {
  fileName: string;
  fileType: string;
  body: Buffer;
  userId: string;
};

type UploadCoverImageUseCaseResponse = Either<
  InvalidUploadTypeError,
  { user: User }
>;

@Injectable()
export class UploadCoverImageUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private uploader: Uploader,
  ) {}
  async execute({
    body,
    fileName,
    fileType,
    userId,
  }: UploadCoverImageUseCaseRequest): Promise<UploadCoverImageUseCaseResponse> {
    if (!/^(image\/(jpeg|png))$/.test(fileType)) {
      return left(new InvalidUploadTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, body, fileType });

    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    user.coverImage = url;

    await this.usersRepository.save(user);
    return right({ user });
  }
}
import { UploadParams, Uploader } from '@/core/storage/uploader';
import { EnvService } from '@/infra/env/env.service';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(private env: EnvService) {
    const cloudFlareId = env.get('CLOUDFLARE_ID');
    const awsAccessKeyId = env.get('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = env.get('AWS_SECRET_ACCESS_KEY');

    this.client = new S3Client({
      endpoint: `https://${cloudFlareId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });
  }

  async upload({
    body,
    fileName,
    fileType,
  }: UploadParams): Promise<{ url: string }> {
    const bucketName = this.env.get('AWS_BUCKET_NAME');
    const uploadId = randomUUID();
    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    );

    return {
      url: uniqueFileName,
    };
  }
}

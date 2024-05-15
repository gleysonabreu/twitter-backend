import { UploadParams, Uploader } from '@/core/storage/uploader';
import { randomUUID } from 'crypto';

type Upload = {
  fileName: string;
  url: string;
};

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID();

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }
}

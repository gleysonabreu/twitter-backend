import { Injectable } from '@nestjs/common';
import { MailPayload, MailRepository } from '../repositories/mail-repository';
import { EnvService } from '@/infra/env/env.service';
import { Resend } from 'resend';

@Injectable()
export class ResendMail implements MailRepository {
  private resend: Resend;

  constructor(private env: EnvService) {
    this.resend = new Resend(this.env.get('RESEND_API_KEY'));
  }

  public send = async (payload: MailPayload): Promise<void> => {
    await this.resend.emails.send(payload);
  };
}

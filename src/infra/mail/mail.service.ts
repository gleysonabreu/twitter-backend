import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import ForgotPasswordEmail from '../mail/templates/forgot-password';
import ResetPasswordEmail from '../mail/templates/reset-password';
import { MailRepository } from './repositories/mail-repository';
import { EventPayloads } from '../event-emitter/event-types';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailRepository) {}

  @OnEvent('user.forgot-password')
  async forgotPasswordMail(data: EventPayloads['user.forgot-password']) {
    const { token, username, email } = data;

    await this.mailService.send({
      from: 'Twitter <onbording@resend.dev>',
      subject: 'Reset password',
      to: email,
      react: ForgotPasswordEmail({
        token: token,
        username: username,
      }),
    });
  }

  @OnEvent('user.reset-password')
  async resetPasswordMail(data: EventPayloads['user.reset-password']) {
    const { username, updatedDate, email } = data;

    await this.mailService.send({
      from: 'Twitter <onbording@resend.dev>',
      subject: 'Reset password',
      to: email,
      react: ResetPasswordEmail({
        updatedDate,
        username: username,
      }),
    });
  }
}

import { Module } from '@nestjs/common';
import { MailRepository } from './repositories/mail-repository';
import { ResendMail } from './implementations/ResendMail';
import { EnvModule } from '../env/env.module';
import { MailService } from './mail.service';

@Module({
  imports: [EnvModule],
  providers: [
    MailService,
    {
      provide: MailRepository,
      useClass: ResendMail,
    },
  ],
  exports: [MailRepository],
})
export class MailModule {}

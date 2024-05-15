import { Global, Module } from '@nestjs/common';
import { TypedEventEmitter } from './typed-event-emitter';
import { EventEmitterModule as EventEmitterModuleNest } from '@nestjs/event-emitter';
import { MailModule } from '../mail/mail.module';

@Global()
@Module({
  imports: [EventEmitterModuleNest.forRoot(), MailModule],
  providers: [TypedEventEmitter],
  exports: [TypedEventEmitter],
})
export class EventEmitterModule {}

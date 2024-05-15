import { Module } from '@nestjs/common';
import { DateRepository } from './repository/date-repository';
import { DayjsProvider } from './implementations/DayjsProvider';

@Module({
  providers: [
    {
      provide: DateRepository,
      useClass: DayjsProvider,
    },
  ],
  exports: [DateRepository],
})
export class DateModule {}

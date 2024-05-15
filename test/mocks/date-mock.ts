import { DateRepository } from '@/infra/date/repository/date-repository';

export class MockDateRepository extends DateRepository {
  compareInHours(start_date: Date, end_date: Date): number {
    return end_date.getTime() - start_date.getTime() / (1000 * 60 * 60);
  }

  convertToUTC(date: Date): string {
    return date.toISOString();
  }

  dateNow(): Date {
    return new Date();
  }

  compareInDays(start_date: Date, end_date: Date): number {
    return Math.floor(
      (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  addDays(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  addHours(hours: number): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  compareIfBefore(start_date: Date, end_date: Date): boolean {
    return start_date < end_date;
  }
}

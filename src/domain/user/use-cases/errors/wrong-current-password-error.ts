import { UseCaseError } from '@/core/errors/use-case-error';

export class WrongCurrentPasswordError extends Error implements UseCaseError {
  constructor() {
    super('Wrong current password');
  }
}

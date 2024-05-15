import { UseCaseError } from '@/core/errors/use-case-error';

export class FavoritePostAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Post already marked as favorite');
  }
}

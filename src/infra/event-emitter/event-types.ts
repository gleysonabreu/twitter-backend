export interface EventPayloads {
  'user.forgot-password': { username: string; token: string; email: string };
  'user.reset-password': { username: string; updatedDate: Date; email: string };
}

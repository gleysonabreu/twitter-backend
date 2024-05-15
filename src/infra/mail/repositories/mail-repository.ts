import { RequireAtLeastOne } from '@/core/types/require-at-least-one';

type EmailRenderOptions = {
  react?: React.ReactElement | React.ReactNode | null;
  text?: string;
  html?: string;
};

export type MailPayload = RequireAtLeastOne<EmailRenderOptions> & {
  from: string;
  to: string;
  subject: string;
};

export abstract class MailRepository {
  abstract send(payload: MailPayload): Promise<void>;
}

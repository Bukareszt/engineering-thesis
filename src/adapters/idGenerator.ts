import { randomUUID } from 'crypto';

export interface IdGenerator {
  generate(): string;
}

export const idGenerator: IdGenerator = {
  generate: () => randomUUID()
};

import { randomUUID } from 'crypto';

export type IdGenerator = () => string;

export const idGenerator: IdGenerator = () => randomUUID();

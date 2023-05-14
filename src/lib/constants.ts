import { envParseString } from '@skyra/env-utilities';
import { join } from 'path';

export const rootDir = join(__dirname, '..', '..');
export const srcDir = join(rootDir, 'src');
export const isRunningDev = envParseString('NODE_ENV') === 'development';

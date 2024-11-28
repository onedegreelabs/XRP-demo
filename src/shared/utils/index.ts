import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EnvService } from '@env/services/env.service';
import { ENVIRONMENT_KEY } from '@env/variables';

const env = new EnvService(new ConfigService());

export async function hash(str: string): Promise<string> {
  return await bcrypt.hash(str, 10);
}

export function generateRandomString(characters: string, num: number): string {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function transformImageURL(key: string) {
  return key ? `${env.get(ENVIRONMENT_KEY.CDN_URL)}/${key}` : null;
}

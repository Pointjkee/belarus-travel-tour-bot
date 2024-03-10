import { DotenvParseOutput, config } from 'dotenv';
import { IConfigService } from './config.interface';

export class ConfigService implements IConfigService {
  private readonly config: DotenvParseOutput | undefined;

  constructor() {
    const { error, parsed } = config();
    // if (error) {
    //   throw new Error('.env is undefined');
    // }
    // if (!parsed) {
    //   throw new Error('.env is empty');
    // }

    if (!error && parsed) {
      this.config = parsed;
    }
  }

  get(key: string): string {
    if (process.env.NODE_ENV !== 'production' && this.config) {
      const res = this.config[key];
      if (!res) {
        throw new Error('no such key');
      }

      return res;
    } else {
      return process.env.TELEGRAM_API_TOKEN || "";
    }
  }
}

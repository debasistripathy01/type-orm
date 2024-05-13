import { TypeOrmModuleOptions } from '@nestjs/typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, thrownMissing: true): string {
    const value = this.env[key];
    if (!value && thrownMissing) {
      throw new Error(
        `Error while getValue config service missing .env ${process.env.key}`,
      );
    }
    return value;
  }
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }
  public getPort() {
    return this.getPort('PORT', true);
  }
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: ['**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      //   cli: {
      //     migrationsDir: 'src/migration',
      //   },

      ssl: this.isProduction(),
    };
  }
}

export { ConfigService };

import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

// Required for typeorm cli - hence using process env
export const ormConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST || "localhost",
  port: +process.env.TYPEORM_PORT || 5432,
  username: process.env.TYPEORM_USERNAME || "postgres",
  password: process.env.TYPEORM_PASSWORD || "postgres",
  database: process.env.NODE_ENV === "test" ? process.env.TYPEORM_TEST_DATABASE : process.env.TYPEORM_DATABASE,
  schema: process.env.TYPEORM_SCHEMA,
  synchronize: process.env.NODE_ENV === "test" ? true : false,
  logging: process.env.TYPEORM_LOGGING == 'true',
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['dist/database/entities/**/*.js'],
  migrations: ['dist/database/migrations/**/*.js'],
};

export const AppDataSource = new DataSource(ormConfig);

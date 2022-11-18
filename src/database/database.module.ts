import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as config from 'config';

const dbConfig = config.get('db');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST') || dbConfig.host,
        port: configService.get('POSTGRES_PORT') || dbConfig.port,
        username: configService.get('POSTGRES_USER') || dbConfig.username,
        password: configService.get('POSTGRES_PASSWORD') || dbConfig.password,
        database: configService.get('POSTGRES_DB_NAME') || dbConfig.database,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: dbConfig.synchronize,
      }),
    }),
  ],
})
export class DatabaseModule {}

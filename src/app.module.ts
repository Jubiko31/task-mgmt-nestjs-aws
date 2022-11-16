import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [ConfigModule.forRoot({}), DatabaseModule, TasksModule, AuthModule],
})
export class AppModule {}

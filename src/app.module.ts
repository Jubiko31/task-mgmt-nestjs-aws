import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [ConfigModule.forRoot({}), DatabaseModule, TasksModule],
})
export class AppModule {}

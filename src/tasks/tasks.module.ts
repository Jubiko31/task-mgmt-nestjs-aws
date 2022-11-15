import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}

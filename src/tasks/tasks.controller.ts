import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UsePipes,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './enums/task-status.enum';
import { Task } from './entities/task.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Users } from 'src/auth/entities/users.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTask(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() users: Users,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, users);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() users: Users,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, users);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() users: Users,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, users);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() users: Users,
  ): Promise<string> {
    return this.tasksService.deleteTask(id, users);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() users: Users,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, status, users);
  }
}

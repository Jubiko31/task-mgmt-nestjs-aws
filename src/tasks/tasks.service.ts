import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './repository/task.repository';
import { TaskStatus } from './enums/task-status.enum';
import { Task } from './entities/task.entity';
import { Users } from 'src/auth/entities/users.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: Users): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, users: Users): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: users.id },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: Users): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, users: Users): Promise<string> {
    const deleted = await this.taskRepository.delete({
      id,
      userId: users.id,
    });
    if (!deleted.affected) {
      throw new NotFoundException(`This task doesn't exist`);
    }
    return 'Task was deleted successfully!';
  }

  async updateStatus(
    id: number,
    status: TaskStatus,
    users: Users,
  ): Promise<Task> {
    const updated = await this.getTaskById(id, users);
    updated.status = status;
    await updated.save();

    return updated;
  }
}

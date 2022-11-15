import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './repository/task.repository';
import { TaskStatus } from './enums/task-status.enum';
import { Task } from './entities/task.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<string> {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted.affected) {
      throw new NotFoundException(`This task doesn't exist`);
    }
    return 'Task was deleted successfully!';
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task> {
    const updated = await this.getTaskById(id);
    updated.status = status;
    await updated.save();

    return updated;
  }
}

import { User } from '../auth/user.entity';
import { Repository, DataSource } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDTO } from './dto/get-task.filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import {
  InternalServerErrorException,
  Logger,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  constructor(private readonly dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }
  async createTasks(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create task for user ${
          user.username
        } , DTO: ${JSON.stringify(createTaskDTO)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete task.user;
    return task;
  }

  async getAllTasks(taskFilter: GetTaskFilterDTO, user: User): Promise<Task[]> {
    const { status } = taskFilter;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    query.where('task.user.id = :userId', { userId: user.id });

    try {
      const tasks = await query.getMany();
      console.log(tasks);
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tasks for user ${
          user.username
        } , DTO: ${JSON.stringify(taskFilter)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}

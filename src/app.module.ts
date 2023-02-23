import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';
import { User } from 'src/auth/user.entity';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...typeOrmConfig, entities: [User, Task] }),
    AuthModule,
    TasksModule,
  ],
})
export class AppModule {}

import { User } from './../auth/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// using sqlite is just for development
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User],
  synchronize: true,
};

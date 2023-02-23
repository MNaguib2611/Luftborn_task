import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// using sqlite is just for development
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
};

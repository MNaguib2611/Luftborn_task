import {
  Logger,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  private logger = new Logger('UserRepository');

  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    this.logger.log('Inside register method');
    const { username, password } = authCredentialsDto;
    const user = this.create();
    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException('Something went Wrong');
      }
    }
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    this.logger.log('Inside login method');
    const { username, password } = authCredentialsDto;
    const user = await this.findOneBy({ username });
    if (user && (await user.validatePassword(password))) {
      return user.username;
    }
    return null;
  }

  private hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

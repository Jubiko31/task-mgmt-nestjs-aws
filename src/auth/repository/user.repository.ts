import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-creditionals.dto';
import { Users } from '../entities/users.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(Users)
export class UserRepository extends Repository<Users> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = this.create();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return 'User account created successfully!';
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

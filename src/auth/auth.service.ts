import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-creditionals.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  signUp(authCredentialsDto: AuthCredentialsDto): string {
    const res = this.userRepository.signUp(authCredentialsDto);

    return res
      ? 'User account created successfully!'
      : 'Error while creating new account';
  }
}

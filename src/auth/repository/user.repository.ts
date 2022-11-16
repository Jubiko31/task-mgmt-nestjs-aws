import { Repository, EntityRepository } from 'typeorm';
import { AuthCredentialsDto } from '../dto/auth-creditionals.dto';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.password = password;

    await user.save();
  }
}

import { Users } from './entities/users.entity';
import * as bcrypt from 'bcrypt';

describe('UserEntity', () => {
  let user: Users;

  beforeEach(() => {
    user = new Users();
    user.password = 'test';
    user.salt = 'salt';
    bcrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockReturnValue('test');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const res = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'salt');
      expect(res).toEqual(true);
    });

    it('returns true as password is not valid', async () => {
      bcrypt.hash.mockReturnValue('test');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const res = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'salt');
      expect(res).toEqual(false);
    });
  });
});

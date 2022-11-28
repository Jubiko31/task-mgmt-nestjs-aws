import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Users } from './entities/users.entity';
import { UserRepository } from './repository/user.repository';
import * as bcrypt from 'bcrypt';

const mockCredentialsDto = {
  username: 'TestUsername',
  password: 'TestPassword',
};

describe('UserRepository', () => {
  let userRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('Sign up user successfully', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });
    it('throws an error that user is already exists', () => {
      save.mockRejectedValue({ code: '23505 ' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });
    it('throws an error that user is already exists', () => {
      save.mockRejectedValue({ code: '1230 ' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user;
    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new Users();
      user.username = 'TestUsername';
      user.validatePassword = jest.fn();
    });

    it('returns username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const res = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(res).toEqual('TestUsername');
    });
    it('returns null as user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const res = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).toHaveBeenCalled();
      expect(res).toBeNull();
    });
    it('returns null as password is not valid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);

      const res = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).toHaveBeenCalled();
      expect(res).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash method to generate a hash for password', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();

      const res = await userRepository.hashPassword('testPassword', 'testSalt');
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(res).toEqual('testHash');
    });
  });
});

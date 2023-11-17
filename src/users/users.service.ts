import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ResponseHelper } from '../common/response.helper';

export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private httpRes: ResponseHelper,
  ) {}

  async getAllUsers() {
    const users = await this.usersRepository.find();
    return this.httpRes.SendHttpResponse(
      'All users fetched successfully',
      HttpStatus.OK,
      users,
    );
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });
    if (user) {
      return this.httpRes.SendHttpResponse(
        'User fetched successfully',
        HttpStatus.OK,
        user,
      );
    }
    return this.httpRes.SendHttpError(
      'Could not find the user',
      HttpStatus.NOT_FOUND,
      user,
    );
  }
}

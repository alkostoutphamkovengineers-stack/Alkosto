import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { UsersEntity } from './entities/users.entity';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  public async findOneUser(params: FindOptionsWhere<UsersEntity>) {
    return await this.repository.findUser(params);
  }

  public async register(entity: Omit<UsersEntity, 'id' | 'activo'>) {
    return this.repository.createUser(entity);
  }
}

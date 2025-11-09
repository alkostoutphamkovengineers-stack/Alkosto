import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from './entities/users.entity';
import { UsersRepository } from './repository/users.repository';
import { UsersTypeorm } from './repository/users.typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UsersRepository,
      useFactory: (dataSource: DataSource) => new UsersTypeorm(dataSource),
      inject: [DataSource],
    },
  ],
  exports: [UsersRepository],
})
export class UsersModule {}

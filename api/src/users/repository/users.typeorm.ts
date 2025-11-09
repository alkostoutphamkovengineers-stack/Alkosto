import { DataSource, FindOptionsWhere, QueryRunner } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { UsersRepository } from './users.repository';

export class UsersTypeorm implements UsersRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async findUser(
    where: FindOptionsWhere<UsersEntity>,
  ): Promise<UsersEntity | null> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        return await queryRunner.manager.findOne(UsersEntity, {
          where,
        });
      });
    } catch (error) {
      throw new Error();
    }
  }

  async createUser(entity: UsersEntity): Promise<UsersEntity> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        return await queryRunner.manager.save(UsersEntity, entity);
      });
    } catch (error) {
      throw new Error();
    }
  }

  private async performTransaction<T>(
    work: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await work(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

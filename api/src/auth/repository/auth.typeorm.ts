import { DataSource, FindOptionsWhere, MoreThan, QueryRunner } from 'typeorm';
import { AuthOptEntity } from '../entities/auth-opt.entity';
import { AuthRepository } from './auth.repository';
import { UsersEntity } from '../entities/users.entity';
import { AuthProviderEntity } from '../entities/auth-provider.entity';

export class AuthTypeorm implements AuthRepository {
  constructor(private readonly dataSource: DataSource) {}

  public async readOptCode(
    where: FindOptionsWhere<AuthOptEntity>,
  ): Promise<AuthOptEntity[] | null> {
    const { otpExpiresAt, ...rest } = where;
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        return await queryRunner.manager.find(AuthOptEntity, {
          where: {
            ...rest,
            otpExpiresAt: MoreThan(new Date()),
          },
        });
      });
    } catch (error) {
      throw new Error();
    }
  }

  public async genOptCode(entity: AuthOptEntity): Promise<AuthOptEntity> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        return await queryRunner.manager.save(AuthOptEntity, entity);
      });
    } catch (error) {
      throw new Error();
    }
  }

  public async updateOptCode(
    id: number,
    entity: Partial<AuthOptEntity>,
  ): Promise<AuthOptEntity | null> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        await queryRunner.manager.update(AuthOptEntity, id, entity);
        return await queryRunner.manager.findOne(AuthOptEntity, {
          where: { id },
        });
      });
    } catch (error) {
      throw new Error();
    }
  }

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

  public async createAuthMethod(
    entity: Omit<AuthProviderEntity, 'id' | 'activo' | 'usuario'>,
  ): Promise<AuthProviderEntity | null> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        return await queryRunner.manager.save(AuthProviderEntity, entity);
      });
    } catch (error) {
      throw new Error();
    }
  }

  public async findPassword(
    where: FindOptionsWhere<AuthProviderEntity>,
  ): Promise<AuthProviderEntity | null> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        return await queryRunner.manager.findOne(AuthProviderEntity, {
          where,
        });
      });
    } catch (error) {
      throw new Error();
    }
  }

  public async updateAuthMethod(
    id: number,
    entity: Partial<AuthProviderEntity>,
  ): Promise<AuthProviderEntity | null> {
    try {
      return await this.performTransaction(async (queryRunner: QueryRunner) => {
        await queryRunner.manager.update(AuthProviderEntity, id, entity);
        return await queryRunner.manager.findOne(AuthProviderEntity, {
          where: { id },
        });
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
      throw new Error();
    } finally {
      await queryRunner.release();
    }
  }
}

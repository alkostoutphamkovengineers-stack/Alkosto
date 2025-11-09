import { FindOptionsWhere } from 'typeorm';
import { AuthOptEntity } from '../entities/auth-opt.entity';
import { UsersEntity } from '../entities/users.entity';
import { AuthProviderEntity } from '../entities/auth-provider.entity';

export abstract class AuthRepository {
  abstract readOptCode(
    where: FindOptionsWhere<AuthOptEntity>,
  ): Promise<AuthOptEntity[] | null>;
  abstract genOptCode(
    entity: Omit<AuthOptEntity, 'id' | 'activo' | 'verified' | 'usuario'>,
  ): Promise<AuthOptEntity>;
  abstract updateOptCode(
    id: number,
    entity: Partial<AuthOptEntity>,
  ): Promise<AuthOptEntity | null>;
  abstract findUser(
    where: FindOptionsWhere<UsersEntity>,
  ): Promise<UsersEntity | null>;
  abstract createAuthMethod(
    entity: Omit<AuthProviderEntity, 'id' | 'activo' | 'usuario' | 'id_tipo_autenticacion' | 'idExterno'>,
  ): Promise<AuthProviderEntity | null>;
  abstract updateAuthMethod(
    id: number,
    entity: Partial<AuthProviderEntity>,
  ): Promise<AuthProviderEntity | null>;
  abstract findPassword(
    entity: FindOptionsWhere<AuthProviderEntity>,
  ): Promise<AuthProviderEntity | null>;
}

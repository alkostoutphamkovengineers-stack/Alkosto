import { DataSource, QueryRunner } from 'typeorm';
import { UsersTypeorm } from './users.typeorm';
import { UsersEntity } from '../entities/users.entity';

describe('UsersTypeorm.createUser', () => {
  let mockSave: jest.Mock;
  let mockManager: any;
  let mockQueryRunner: Partial<QueryRunner>;
  let mockDataSource: Partial<DataSource>;
  let repo: UsersTypeorm;

  const sampleUser = {
    id: 1,
    email: 'test@example.com',
    nombre: 'Test User',
    telefono: '123456789',
  } as unknown as UsersEntity;

  beforeEach(() => {
    mockSave = jest.fn();
    mockManager = { save: mockSave };

    mockQueryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: mockManager,
    };

    mockDataSource = {
      createQueryRunner: jest.fn(() => mockQueryRunner as QueryRunner),
    };

    repo = new UsersTypeorm(mockDataSource as DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save user and commit transaction on success', async () => {
    mockSave.mockResolvedValue(sampleUser);

    const result = await repo.createUser(sampleUser);

    expect(mockDataSource.createQueryRunner).toHaveBeenCalled();
    expect(mockQueryRunner.connect as jest.Mock).toHaveBeenCalled();
    expect(mockQueryRunner.startTransaction as jest.Mock).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalledWith(UsersEntity, sampleUser);
    expect(mockQueryRunner.commitTransaction as jest.Mock).toHaveBeenCalled();
    expect(mockQueryRunner.release as jest.Mock).toHaveBeenCalled();
    expect(result).toBe(sampleUser);
  });

  it('should rollback and throw generic Error when save fails due to duplicate (unique constraint)', async () => {
    mockSave.mockRejectedValue({
      code: '23505',
      message: 'duplicate key value violates unique constraint',
    });

    await expect(repo.createUser(sampleUser)).rejects.toThrow(Error);

    expect(mockQueryRunner.startTransaction as jest.Mock).toHaveBeenCalled();
    expect(mockQueryRunner.rollbackTransaction as jest.Mock).toHaveBeenCalled();
    expect(
      mockQueryRunner.commitTransaction as jest.Mock,
    ).not.toHaveBeenCalled();
    expect(mockQueryRunner.release as jest.Mock).toHaveBeenCalled();
  });

  it('should rollback and throw generic Error when save fails due to invalid format', async () => {
    mockSave.mockRejectedValue(new Error('Invalid format'));

    await expect(repo.createUser(sampleUser)).rejects.toThrow(Error);

    expect(mockQueryRunner.rollbackTransaction as jest.Mock).toHaveBeenCalled();
    expect(
      mockQueryRunner.commitTransaction as jest.Mock,
    ).not.toHaveBeenCalled();
    expect(mockQueryRunner.release as jest.Mock).toHaveBeenCalled();
  });
});

import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { SendOtpEmail } from './use-cases/send-code-opt-email';
import { SendOtpSms } from './use-cases/send-code-opt-sms';
import { SendOtpWhatsapp } from './use-cases/send-code-opt-whatsapp';
import bcrypt from 'bcrypt';

describe('AuthService.loginPassword', () => {
  let authService: AuthService;
  let mockRepository: Partial<AuthRepository>;
  const mockSendEmail = {} as SendOtpEmail;
  const mockSendSMS = {} as SendOtpSms;
  const mockSendWhatsapp = {} as SendOtpWhatsapp;

  beforeEach(() => {
    mockRepository = {
      findUser: jest.fn(),
      findPassword: jest.fn(),
    };
    authService = new AuthService(
      mockRepository as AuthRepository,
      mockSendEmail,
      mockSendSMS,
      mockSendWhatsapp,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return false if user does not exist', async () => {
    (mockRepository.findUser as jest.Mock).mockResolvedValue(null);
    const result = await authService.loginPassword(
      'test@example.com',
      'password',
    );
    expect(result).toBe(false);
  });

  it('should return false if stored password does not exist', async () => {
    (mockRepository.findUser as jest.Mock).mockResolvedValue({ id: 1 });
    (mockRepository.findPassword as jest.Mock).mockResolvedValue(null);
    const result = await authService.loginPassword(
      'test@example.com',
      'password',
    );
    expect(result).toBe(false);
  });

  it('should return false if password does not match', async () => {
    (mockRepository.findUser as jest.Mock).mockResolvedValue({ id: 1 });
    (mockRepository.findPassword as jest.Mock).mockResolvedValue({
      contrasena: 'hashedPassword',
    });
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
    const result = await authService.loginPassword(
      'test@example.com',
      'wrongPassword',
    );
    expect(result).toBe(false);
  });

  it('should return true if password matches', async () => {
    (mockRepository.findUser as jest.Mock).mockResolvedValue({ id: 1 });
    (mockRepository.findPassword as jest.Mock).mockResolvedValue({
      contrasena: 'hashedPassword',
    });
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    const result = await authService.loginPassword(
      'test@example.com',
      'correctPassword',
    );
    expect(result).toBe(true);
  });
});

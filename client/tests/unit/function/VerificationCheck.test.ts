import { validateEmail, validatePassword, validateUsername } from '../../../src/function/VerificationCheck';

describe('VerificationCheck Utility Functions', () => {
  describe('validateEmail', () => {
    it('validates correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('rejects invalid email format', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('validates password with minimum length', () => {
      expect(validatePassword('password123')).toBe(true);
      expect(validatePassword('12345678')).toBe(true);
    });

    it('rejects password shorter than minimum length', () => {
      expect(validatePassword('pass')).toBe(false);
      expect(validatePassword('1234567')).toBe(false);
    });

    it('rejects empty password', () => {
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('validates username with minimum length', () => {
      expect(validateUsername('user')).toBe(true);
      expect(validateUsername('username123')).toBe(true);
    });

    it('rejects username shorter than minimum length', () => {
      expect(validateUsername('ab')).toBe(false);
      expect(validateUsername('u')).toBe(false);
    });

    it('rejects empty username', () => {
      expect(validateUsername('')).toBe(false);
    });
  });
});

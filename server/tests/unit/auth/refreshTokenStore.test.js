const { 
  insertRefreshToken, 
  findRefreshToken, 
  deleteRefreshToken,
  deleteExpiredTokens 
} = require('../../auth/refreshTokenStore');
const db = require('../../config/database/database');

jest.mock('../../config/database/database');

describe('Refresh Token Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insertRefreshToken', () => {
    it('inserts token successfully', async () => {
      db.run.mockImplementation((sql, params, callback) => {
        callback.call({ lastID: 1 }, null);
      });

      const result = await insertRefreshToken({
        token: 'test-token',
        employeeID: 1,
        deviceId: 'device-123',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      expect(result).toBe(1);
      expect(db.run).toHaveBeenCalled();
    });

    it('handles duplicate token error gracefully', async () => {
      db.run.mockImplementation((sql, params, callback) => {
        callback.call(this, { message: 'UNIQUE constraint failed' });
      });

      await expect(insertRefreshToken({
        token: 'duplicate-token',
        employeeID: 1,
        deviceId: 'device-123',
        expiresAt: new Date().toISOString(),
      })).rejects.toThrow();
    });
  });

  describe('findRefreshToken', () => {
    it('finds existing token', async () => {
      const mockToken = {
        id: 1,
        token: 'test-token',
        employeeID: 1,
        deviceId: 'device-123',
        createdAt: new Date().toISOString(),
      };

      db.get.mockImplementation((sql, params, callback) => {
        callback(null, mockToken);
      });

      const result = await findRefreshToken('test-token');

      expect(result).toEqual(mockToken);
      expect(db.get).toHaveBeenCalled();
    });

    it('returns null for non-existent token', async () => {
      db.get.mockImplementation((sql, params, callback) => {
        callback(null, null);
      });

      const result = await findRefreshToken('non-existent-token');

      expect(result).toBeNull();
    });
  });

  describe('deleteRefreshToken', () => {
    it('deletes token successfully', async () => {
      db.run.mockImplementation((sql, params, callback) => {
        callback.call({ changes: 1 }, null);
      });

      const result = await deleteRefreshToken('test-token');

      expect(result).toBe(1);
      expect(db.run).toHaveBeenCalled();
    });
  });

  describe('deleteExpiredTokens', () => {
    it('deletes expired tokens', async () => {
      db.run.mockImplementation((sql, params, callback) => {
        callback.call({ changes: 5 }, null);
      });

      const result = await deleteExpiredTokens();

      expect(result).toBe(5);
      expect(db.run).toHaveBeenCalled();
    });
  });
});

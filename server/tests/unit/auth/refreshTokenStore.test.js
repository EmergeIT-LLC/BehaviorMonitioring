const { 
  insertRefreshToken, 
  findRefreshToken, 
  revokeRefreshToken,
  rotateRefreshToken,
  touchRefreshToken
} = require('../../../auth/refreshTokenStore');

describe('Refresh Token Store', () => {
  let mockDb;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = {
      run: jest.fn(),
      all: jest.fn(),
      get: jest.fn()
    };
  });

  describe('insertRefreshToken', () => {
    it('inserts token successfully', async () => {
      mockDb.run.mockResolvedValue(undefined);

      const result = await insertRefreshToken(mockDb, {
        userId: 1,
        token: 'test-token',
        ttlDays: 7,
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1',
        deviceId: 'device-123',
        lastUsedAt: new Date()
      });

      expect(typeof result).toBe('string'); // Returns expiresAt ISO string
      expect(mockDb.run).toHaveBeenCalled();
    });
  });

  describe('findRefreshToken', () => {
    it('finds existing token', async () => {
      const mockTokens = [{
        id: 1,
        token: 'test-token',
        user_id: 1,
        device_id: 'device-123',
        created_at: new Date().toISOString(),
      }];

      mockDb.all.mockResolvedValue(mockTokens);

      const result = await findRefreshToken(mockDb, 'test-token');

      expect(result).toEqual(mockTokens);
      expect(mockDb.all).toHaveBeenCalled();
    });

    it('returns empty array for non-existent token', async () => {
      mockDb.all.mockResolvedValue([]);

      const result = await findRefreshToken(mockDb, 'non-existent-token');

      expect(result).toEqual([]);
    });
  });

  describe('revokeRefreshToken', () => {
    it('revokes token successfully', async () => {
      mockDb.run.mockResolvedValue(undefined);

      await revokeRefreshToken(mockDb, 'test-token');

      expect(mockDb.run).toHaveBeenCalled();
    });
  });

  describe('rotateRefreshToken', () => {
    it('rotates token successfully', async () => {
      mockDb.run.mockResolvedValue(undefined);

      await rotateRefreshToken(mockDb, 'old-token', 'new-token');

      expect(mockDb.run).toHaveBeenCalled();
    });
  });

  describe('touchRefreshToken', () => {
    it('updates last used timestamp', async () => {
      mockDb.run.mockResolvedValue(undefined);

      await touchRefreshToken(mockDb, 'test-token');

      expect(mockDb.run).toHaveBeenCalled();
    });
  });
});

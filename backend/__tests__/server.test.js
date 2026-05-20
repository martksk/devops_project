process.env.SUPABASE_URL = 'https://mock.supabase.co';
process.env.SUPABASE_ANON_KEY = 'mock-anon-key';

const request = require('supertest');

// Set up Supabase mocks
const mockSupabase = {
  from: jest.fn(),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase,
}));

const app = require('../server');

describe('Voting Service Backend API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return 200 and healthy status information', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual('Healthy');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/characters', () => {
    it('should return a list of characters ordered by votes', async () => {
      const mockCharacters = [
        { id: '1', name: 'Hero Alpha', image_url: 'http://alpha', votes: 12 },
        { id: '2', name: 'Hero Beta', image_url: 'http://beta', votes: 8 },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: mockCharacters, error: null });
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const res = await request(app).get('/api/characters');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockCharacters);
      
      expect(mockSupabase.from).toHaveBeenCalledWith('characters');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('votes', { ascending: false });
    });

    it('should return 500 when Supabase query fails', async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: 'Database failure' } });
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const res = await request(app).get('/api/characters');
      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Database failure' });
    });
  });

  describe('POST /api/vote', () => {
    it('should increment votes for a character successfully', async () => {
      const charId = '123e4567-e89b-12d3-a456-426614174000';
      
      const mockSingle = jest.fn().mockResolvedValue({ data: { votes: 10 }, error: null });
      const mockEqSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEqSelect });

      const mockEqUpdate = jest.fn().mockResolvedValue({ error: null });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEqUpdate });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'characters') {
          return {
            select: mockSelect,
            update: mockUpdate,
          };
        }
      });

      const res = await request(app)
        .post('/api/vote')
        .send({ id: charId });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ success: true });

      expect(mockSupabase.from).toHaveBeenCalledWith('characters');
      expect(mockSelect).toHaveBeenCalledWith('votes');
      expect(mockEqSelect).toHaveBeenCalledWith('id', charId);
      expect(mockSingle).toHaveBeenCalled();

      expect(mockUpdate).toHaveBeenCalledWith({ votes: 11 });
      expect(mockEqUpdate).toHaveBeenCalledWith('id', charId);
    });

    it('should return 400 if character ID is not provided', async () => {
      const res = await request(app)
        .post('/api/vote')
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ error: 'Character ID is required' });
    });

    it('should return 500 if Supabase update fails', async () => {
      const charId = '123e4567-e89b-12d3-a456-426614174000';

      const mockSingle = jest.fn().mockResolvedValue({ data: { votes: 10 }, error: null });
      const mockEqSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEqSelect });

      const mockEqUpdate = jest.fn().mockResolvedValue({ error: { message: 'Write failed' } });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEqUpdate });

      mockSupabase.from.mockImplementation((table) => {
        return {
          select: mockSelect,
          update: mockUpdate,
        };
      });

      const res = await request(app)
        .post('/api/vote')
        .send({ id: charId });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual({ error: 'Write failed' });
    });
  });
});

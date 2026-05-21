import { GET as getHealth } from '../app/api/health/route';
import { GET as getCharacters } from '../app/api/characters/route';
import { POST as postVote } from '../app/api/vote/route';
import { supabase } from '../lib/supabase';

// Mock Supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('API Route Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return 200 and healthy status information', async () => {
      const res = await getHealth();
      expect(res.status).toEqual(200);
      const data = await res.json();
      expect(data.status).toEqual('Healthy');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('uptime');
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
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const res = await getCharacters();
      expect(res.status).toEqual(200);
      const data = await res.json();
      expect(data).toEqual(mockCharacters);

      expect(supabase.from).toHaveBeenCalledWith('characters');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('votes', { ascending: false });
    });

    it('should return 500 when Supabase query fails', async () => {
      const mockOrder = jest.fn().mockResolvedValue({ data: null, error: { message: 'Database failure' } });
      const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
      (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const res = await getCharacters();
      expect(res.status).toEqual(500);
      const data = await res.json();
      expect(data).toEqual({ error: 'Database failure' });
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

      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'characters') {
          return {
            select: mockSelect,
            update: mockUpdate,
          };
        }
      });

      const req = new Request('http://localhost/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: charId }),
      });

      const res = await postVote(req);
      expect(res.status).toEqual(200);
      const data = await res.json();
      expect(data).toEqual({ success: true });

      expect(supabase.from).toHaveBeenCalledWith('characters');
      expect(mockSelect).toHaveBeenCalledWith('votes');
      expect(mockEqSelect).toHaveBeenCalledWith('id', charId);
      expect(mockSingle).toHaveBeenCalled();

      expect(mockUpdate).toHaveBeenCalledWith({ votes: 11 });
      expect(mockEqUpdate).toHaveBeenCalledWith('id', charId);
    });

    it('should return 400 if character ID is not provided', async () => {
      const req = new Request('http://localhost/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const res = await postVote(req);
      expect(res.status).toEqual(400);
      const data = await res.json();
      expect(data).toEqual({ error: 'Character ID is required' });
    });

    it('should return 500 if Supabase update fails', async () => {
      const charId = '123e4567-e89b-12d3-a456-426614174000';

      const mockSingle = jest.fn().mockResolvedValue({ data: { votes: 10 }, error: null });
      const mockEqSelect = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEqSelect });

      const mockEqUpdate = jest.fn().mockResolvedValue({ error: { message: 'Write failed' } });
      const mockUpdate = jest.fn().mockReturnValue({ eq: mockEqUpdate });

      (supabase.from as jest.Mock).mockImplementation((table) => {
        return {
          select: mockSelect,
          update: mockUpdate,
        };
      });

      const req = new Request('http://localhost/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: charId }),
      });

      const res = await postVote(req);
      expect(res.status).toEqual(500);
      const data = await res.json();
      expect(data).toEqual({ error: 'Write failed' });
    });
  });
});

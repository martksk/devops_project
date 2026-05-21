import { render, screen, act } from '@testing-library/react';
import Home from '../app/page';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: '1', name: 'Test Character 1', image_url: '', votes: 10 },
      { id: '2', name: 'Test Character 2', image_url: '', votes: 5 },
    ]),
  })
) as jest.Mock;

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders character names and vote counts', async () => {
    await act(async () => {
      render(<Home />);
    });

    expect(screen.getByText('Test Character 1')).toBeInTheDocument();
    expect(screen.getByText('Test Character 2')).toBeInTheDocument();
    expect(screen.getByText('10 VOTES')).toBeInTheDocument();
    expect(screen.getByText('5 VOTES')).toBeInTheDocument();
  });

  it('renders the Vote button for each character', async () => {
    await act(async () => {
      render(<Home />);
    });
    
    const voteButtons = screen.getAllByRole('button', { name: /vote/i });
    expect(voteButtons).toHaveLength(2);
  });
});

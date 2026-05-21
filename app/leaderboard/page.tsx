import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface Character {
  id: string;
  name: string;
  image_url: string;
  votes: number;
}

export default async function LeaderboardPage() {
  let characters: Character[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbError } = await supabase
      .from('characters')
      .select('*')
      .order('votes', { ascending: false });

    if (dbError) {
      throw new Error(dbError.message);
    }
    characters = data || [];
  } catch (err: any) {
    error = err.message;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0b0e14] text-white flex flex-col items-center justify-center p-6">
        <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-lg backdrop-blur-md">
          <h1 className="text-2xl font-bold text-red-400 mb-2">System Error</h1>
          <p className="text-gray-300">{error || 'Failed to load leaderboard data. Please try again later.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0e14] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0b0e14] to-[#0b0e14] text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
              Leaderboard
            </h1>
            <p className="text-blue-300/60 font-medium tracking-widest uppercase text-sm mt-2">
              Character Ranking Statistics
            </p>
          </div>
          <Link 
            href="/"
            className="px-6 py-2 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-all duration-300 text-blue-400 font-bold flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Voting
          </Link>
        </div>

        <div className="space-y-4">
          {characters?.map((character: Character, index: number) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            
            // Visual accents for Top 3
            const rankStyles = {
              1: "border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.15)] text-yellow-400",
              2: "border-gray-300/50 bg-gray-300/5 shadow-[0_0_20px_rgba(209,213,219,0.15)] text-gray-300",
              3: "border-orange-400/50 bg-orange-400/5 shadow-[0_0_20px_rgba(251,146,60,0.15)] text-orange-400",
            }[rank as 1 | 2 | 3] || "border-blue-500/10 bg-white/5 text-blue-400/60";

            return (
              <div 
                key={character.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-sm transition-all duration-500 hover:translate-x-2 ${rankStyles}`}
              >
                <div className="flex-shrink-0 w-12 text-center">
                  <span className={`text-2xl font-black italic ${isTop3 ? 'text-inherit' : 'text-gray-600'}`}>
                    #{rank}
                  </span>
                </div>

                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-current/20 bg-[#1a1f29]">
                  {character.image_url ? (
                    <img 
                      src={character.image_url} 
                      alt={character.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
                      ?
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <h2 className={`text-xl font-bold tracking-tight ${isTop3 ? 'text-white' : 'text-gray-300'}`}>
                    {character.name}
                  </h2>
                </div>

                <div className="flex-shrink-0">
                  <div className={`px-4 py-1.5 rounded-lg border font-mono font-bold ${isTop3 ? 'border-inherit bg-inherit' : 'border-blue-500/20 bg-blue-500/5 text-blue-400'}`}>
                    {character.votes} VOTES
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

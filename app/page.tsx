"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { voteForCharacter } from "./actions";

interface Character {
  id: string;
  name: string;
  image_url: string;
  votes: number;
}

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const fetchCharacters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/characters`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch characters");
      const data = await res.json();
      setCharacters(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCharacters = async () => {
      await fetchCharacters();
    };

    void loadCharacters();
  }, []);

  const handleVote = async (id: string) => {
    try {
      const res = await voteForCharacter(id);
      if (res.success) {
        fetchCharacters();
      } else {
        console.error("Vote failed:", res.error);
      }
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0e14] text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0e14] text-red-500">
        Error: {error}
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0b0e14] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0b0e14] to-[#0b0e14] text-white p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
              Character Voting
            </h1>
            <p className="text-blue-300/60 font-medium tracking-widest uppercase text-sm mt-2">
              Cast your vote for your favorite character
            </p>
          </div>
          <Link 
            href="/leaderboard"
            className="px-6 py-2 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-all duration-300 text-blue-400 font-bold flex items-center gap-2 group self-start md:self-auto"
          >
            View Leaderboard
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.map((char) => (
            <div
              key={char.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-hover hover:border-blue-500/50"
            >
              <div className="h-48 rounded-xl overflow-hidden mb-4 bg-gray-800">
                {char.image_url && (
                  <img
                    src={char.image_url}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h2 className="text-2xl font-bold mb-2">{char.name}</h2>
              <p className="text-blue-400 font-mono mb-6">{char.votes} VOTES</p>
              <button
                onClick={() => handleVote(char.id)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors"
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { voteForCharacter, addCharacter } from "./actions";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterImage, setNewCharacterImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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

  const handleAddCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacterName.trim()) {
      setFormError("Character name is required");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const res = await addCharacter(newCharacterName, newCharacterImage);
      if (res.success) {
        setNewCharacterName("");
        setNewCharacterImage("");
        setIsModalOpen(false);
        await fetchCharacters();
      } else {
        setFormError(res.error || "Failed to add character");
      }
    } catch (err: any) {
      setFormError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("File size must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCharacterImage(reader.result as string);
        setFormError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearFile = () => {
    setNewCharacterImage("");
    const fileInput = document.getElementById("avatar-file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
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
    <main className="min-h-screen bg-[#0b0e14] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#0b0e14] to-[#0b0e14] text-white font-sans pb-12">
      {/* Top Sticky Navbar */}
      <header className="border-b border-white/5 bg-[#0b0e14]/50 backdrop-blur-md sticky top-0 z-40 py-4 px-6 md:px-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="text-2xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300">
              AuraRank
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-all duration-300">
              v1.0
            </span>
          </Link>
          <span className="text-[10px] text-gray-500 font-mono hidden sm:inline uppercase tracking-widest">
            The Interactive Avatar Arena
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6 md:p-12 pt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
              Character Voting
            </h1>
            <p className="text-blue-300/60 font-medium tracking-widest uppercase text-sm mt-2">
              Cast your vote for your favorite character
            </p>
          </div>
          <div className="flex flex-wrap gap-4 self-start md:self-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 rounded-full transition-all duration-300 text-purple-400 font-bold flex items-center gap-2 group cursor-pointer"
            >
              Add Character
              <span className="group-hover:scale-110 transition-transform">+</span>
            </button>
            <Link
              href="/leaderboard"
              className="px-6 py-2 border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-all duration-300 text-blue-400 font-bold flex items-center gap-2 group"
            >
              View Leaderboard
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
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
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors cursor-pointer"
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Glassmorphism Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0b0e14]/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#131823]/90 border border-white/10 rounded-3xl p-8 max-w-md w-full backdrop-blur-lg shadow-2xl relative animate-scale-up">
            <h2 className="text-3xl font-black tracking-tight uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)]">
              Add New Character
            </h2>

            <form onSubmit={handleAddCharacter} className="space-y-6">
              {/* Dynamic Live Avatar Preview */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-500/30 bg-[#1a1f29] mb-2 flex items-center justify-center">
                  <img
                    src={
                      newCharacterImage.trim()
                        ? newCharacterImage.trim()
                        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newCharacterName.trim() || "DefaultSeed")}`
                    }
                    alt="Live Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-mono text-purple-400/60 uppercase tracking-widest">
                  Live Avatar Preview
                </span>
              </div>

              {formError && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {formError}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-blue-300/60">
                  Character Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hero Gamma"
                  value={newCharacterName}
                  onChange={(e) => setNewCharacterName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-xl text-white outline-none transition-all placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-blue-300/60">
                  Character Image (Optional)
                </label>
                
                <input
                  type="file"
                  accept="image/*"
                  id="avatar-file-input"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {!newCharacterImage ? (
                  <label
                    htmlFor="avatar-file-input"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-2xl p-6 cursor-pointer bg-white/5 hover:bg-white/10 transition-all text-center group"
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📁</span>
                    <span className="text-sm text-gray-300 font-bold">Browse Image File</span>
                    <span className="text-[10px] text-gray-500 mt-1">PNG, JPG, SVG, GIF (Max 5MB)</span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between bg-white/5 border border-purple-500/20 rounded-2xl p-4 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">✅</span>
                      <div className="text-left">
                        <p className="text-sm font-bold text-purple-400">Custom Image Loaded</p>
                        <p className="text-[10px] text-gray-500">Ready for submission</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-gray-500 italic mt-1">
                  Or leave blank to dynamically generate a unique Dicebear avatar from the name!
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormError(null);
                  }}
                  className="flex-1 py-3 border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 font-bold transition-all text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

"use server";

import { revalidatePath } from "next/cache";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://devops-project-1rpp.onrender.com";

export async function voteForCharacter(characterId: string) {
  try {
    const res = await fetch(`${API_URL}/api/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: characterId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to vote");
    }

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating votes:", err);
    return { success: false, error: err.message };
  }
}

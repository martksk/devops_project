"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export async function voteForCharacter(characterId: string) {
  try {
    if (!characterId) {
      throw new Error("Character ID is required");
    }

    const { data, error: fetchError } = await supabase
      .from('characters')
      .select('votes')
      .eq('id', characterId)
      .single();

    if (fetchError) throw fetchError;

    const { error: updateError } = await supabase
      .from('characters')
      .update({ votes: (data.votes || 0) + 1 })
      .eq('id', characterId);

    if (updateError) throw updateError;

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error updating votes:", err);
    return { success: false, error: err.message };
  }
}

export async function addCharacter(name: string, imageUrl?: string) {
  try {
    if (!name || name.trim() === "") {
      throw new Error("Character name is required");
    }

    const finalImageUrl = imageUrl?.trim() 
      ? imageUrl.trim() 
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`;

    const { error } = await supabase
      .from('characters')
      .insert({
        name: name.trim(),
        image_url: finalImageUrl,
        votes: 0
      });

    if (error) throw error;

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error adding character:", err);
    return { success: false, error: err.message };
  }
}


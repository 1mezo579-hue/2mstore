"use server";

import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getBranches() {
  const { data, error } = await supabase.from('Branch').select('*');
  if (error) { console.error(error); return []; }
  // Add counts
  return (data || []).map((b: any) => ({ ...b, itemCount: 0, saleCount: 0, ticketCount: 0 }));
}

export async function createBranch(name: string, location: string) {
  const { data, error } = await supabase.from('Branch').insert([{ name, location }]).select().single();
  if (error) return { success: false, error: "حدث خطأ أثناء إضافة الفرع." };
  revalidatePath("/dashboard");
  return { success: true, branch: data };
}

"use server";

import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getInventoryItems() {
  const { data, error } = await supabase.from('InventoryItem').select('*').order('createdAt', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function addInventoryItem(data: any) {
  const id = `item_${Date.now()}`;
  const { error } = await supabase.from('InventoryItem').insert([{ ...data, id, branchId: 1 }]);
  if (error) return { success: false, error: "حدث خطأ أثناء إضافة الصنف." };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteInventoryItem(id: string) {
  const { error } = await supabase.from('InventoryItem').delete().eq('id', id);
  if (error) return { success: false, error: "حدث خطأ أثناء الحذف." };
  revalidatePath("/dashboard");
  return { success: true };
}

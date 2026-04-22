"use server";

import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  const { data, error } = await supabase.from('User').select('*').order('createdAt', { ascending: false });
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function createUser(data: any) {
  const id = `u_${Date.now()}`;
  const { error } = await supabase.from('User').insert([{ ...data, id }]);
  if (error) return { success: false, error: "فشل في إنشاء المستخدم." };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateUser(id: string, data: any) {
  const { error } = await supabase.from('User').update(data).eq('id', id);
  if (error) return { success: false, error: "فشل في تحديث المستخدم." };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteUser(id: string) {
  const { error } = await supabase.from('User').delete().eq('id', id);
  if (error) return { success: false, error: "فشل في حذف المستخدم." };
  revalidatePath("/dashboard");
  return { success: true };
}

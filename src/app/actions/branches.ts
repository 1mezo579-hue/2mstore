"use server";

import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getBranches() {
  const { data, error } = await supabase.from('Branch').select('*');
  if (error) { console.error(error); return []; }

  const branches = await Promise.all((data || []).map(async (b: any) => {
    const [{ count: itemCount }, { count: saleCount }, { count: ticketCount }] = await Promise.all([
      supabase.from('InventoryItem').select('id', { count: 'exact', head: true }).eq('branchId', b.id),
      supabase.from('Sale').select('id', { count: 'exact', head: true }).eq('branchId', b.id),
      supabase.from('MaintenanceTicket').select('id', { count: 'exact', head: true }).eq('branchId', b.id),
    ]);
    return { ...b, itemCount: itemCount || 0, saleCount: saleCount || 0, ticketCount: ticketCount || 0 };
  }));

  return branches;
}

export async function createBranch(name: string, location: string) {
  const { data, error } = await supabase.from('Branch').insert([{ name, location }]).select().single();
  if (error) return { success: false, error: "حدث خطأ أثناء إضافة الفرع." };
  revalidatePath("/dashboard");
  return { success: true, branch: data };
}

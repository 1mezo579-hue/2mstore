"use server";

import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getInventoryItems() {
  const { data, error } = await supabase.from('InventoryItem').select('*').order('createdAt', { ascending: false });
  if (error) { 
    console.error("FETCH ERROR InventoryItem:", error.message); 
    return []; 
  }
  return data || [];
}

export async function addInventoryItem(data: any) {
  try {
    const id = `item_${Date.now()}`;
    
    // First, try to get a valid branchId if none is provided
    let branchId = data.branchId;
    if (!branchId) {
      const { data: branches } = await supabase.from('Branch').select('id').limit(1);
      if (branches && branches.length > 0) {
        branchId = branches[0].id;
      } else {
        // Fallback to 1 but this might still fail if DB constraints are strict
        branchId = 1;
      }
    }

    const { error } = await supabase.from('InventoryItem').insert([{ 
      ...data, 
      id, 
      branchId 
    }]);
    
    if (error) {
      console.error("Supabase Inventory Insert Error:", error);
      return { success: false, error: `فشل الحفظ: ${error.message}` };
    }
    
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e: any) {
    console.error("Inventory Add Catch:", e);
    return { success: false, error: e.message || "حدث خطأ غير متوقع" };
  }
}

export async function updateInventoryItem(id: string, data: any) {
  const { error } = await supabase.from('InventoryItem').update({
    name: data.name,
    category: data.category,
    price: data.price,
    quantity: data.quantity,
  }).eq('id', id);
  if (error) return { success: false, error: "حدث خطأ أثناء تعديل الصنف." };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteInventoryItem(id: string) {
  const { error } = await supabase.from('InventoryItem').delete().eq('id', id);
  if (error) return { success: false, error: "حدث خطأ أثناء الحذف." };
  revalidatePath("/dashboard");
  return { success: true };
}

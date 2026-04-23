"use server";

import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getPOSItems() {
  const { data, error } = await supabase.from('InventoryItem').select('*').gt('quantity', 0).order('name', { ascending: true });
  if (error) { console.error(error); return []; }
  return data || [];
}

export async function processSale(data: any) {
  // 1. Create sale
  const { data: sale, error: saleErr } = await supabase
    .from('Sale')
    .insert([{ branchId: data.branchId || 1, totalAmount: data.totalAmount, tradeInValue: data.tradeInAmount || 0 }])
    .select().single();
  if (saleErr) return { success: false, error: "فشلت عملية البيع." };

  // 2. Process items
  for (const item of data.items) {
    await supabase.from('SaleItem').insert([{ saleId: sale.id, inventoryItemId: item.id, quantity: item.quantity, price: item.sellPrice || item.price }]);
    const { data: cur } = await supabase.from('InventoryItem').select('quantity').eq('id', item.id).single();
    if (cur) await supabase.from('InventoryItem').update({ quantity: cur.quantity - item.quantity }).eq('id', item.id);
  }

  revalidatePath("/dashboard");
  return { success: true, saleId: sale.id };
}

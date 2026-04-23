"use server";

import { supabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getMaintenanceTickets() {
  const { data, error } = await supabase
    .from('MaintenanceTicket')
    .select('*, Customer(*)')
    .order('createdAt', { ascending: false });
  if (error) { console.error(error); return []; }
  return (data || []).map((t: any) => ({ ...t, customerName: t.Customer?.name, customerPhone: t.Customer?.phone }));
}

export async function createMaintenanceTicket(data: any) {
  // Find or create customer
  let { data: customer } = await supabase.from('Customer').select('*').eq('phone', data.customerPhone).single();
  if (!customer) {
    const { data: newC } = await supabase.from('Customer').insert([{ name: data.customerName, phone: data.customerPhone }]).select().single();
    customer = newC;
  }

  const { error } = await supabase.from('MaintenanceTicket').insert([{
    branchId: 1, customerId: customer?.id, deviceType: data.deviceType,
    issue: data.issue, cost: data.estimatedCost || 0, status: 'RECEIVED'
  }]);
  if (error) return { success: false, error: "حدث خطأ أثناء إنشاء تذكرة الصيانة." };
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTicketStatus(ticketId: any, status: string) {
  const { error } = await supabase.from('MaintenanceTicket').update({ status }).eq('id', ticketId);
  if (error) return { success: false, error: "حدث خطأ أثناء تحديث الحالة." };
  revalidatePath("/dashboard");
  return { success: true };
}

"use server";

import { supabase } from "@/lib/db";

export async function getDashboardStats() {
  try {
    // Inventory count & value
    const { data: items } = await supabase.from('InventoryItem').select('price, quantity');
    const totalItems = items?.length || 0;
    const lowStock = items?.filter((i: any) => (i.quantity || 0) < 5).length || 0;
    const inventoryValue = items?.reduce((s: number, i: any) => s + ((Number(i.price) || 0) * (Number(i.quantity) || 0)), 0) || 0;

    // Maintenance tickets
    const { data: tickets } = await supabase.from('MaintenanceTicket').select('status');
    const totalTickets = tickets?.length || 0;
    const pendingTickets = tickets?.filter((t: any) => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length || 0;

    // Today's sales
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data: sales } = await supabase.from('Sale').select('totalAmount, createdAt').gte('createdAt', today.toISOString());
    const todaySales = sales?.reduce((s: number, sale: any) => s + (Number(sale.totalAmount) || 0), 0) || 0;
    const todaySalesCount = sales?.length || 0;

    // Recent sales for log
    const { data: recentSales } = await supabase
      .from('Sale')
      .select('id, totalAmount, createdAt')
      .order('createdAt', { ascending: false })
      .limit(5);

    // Recent maintenance
    const { data: recentMaint } = await supabase
      .from('MaintenanceTicket')
      .select('id, deviceType, status, createdAt, Customer(name)')
      .order('createdAt', { ascending: false })
      .limit(5);

    return {
      totalItems,
      lowStock,
      inventoryValue,
      totalTickets,
      pendingTickets,
      todaySales,
      todaySalesCount,
      recentSales: recentSales || [],
      recentMaint: (recentMaint || []).map((m: any) => ({ ...m, customerName: m.Customer?.name || 'غير معروف' })),
    };
  } catch (e) {
    console.error("getDashboardStats error:", e);
    return {
      totalItems: 0, lowStock: 0, inventoryValue: 0,
      totalTickets: 0, pendingTickets: 0,
      todaySales: 0, todaySalesCount: 0,
      recentSales: [], recentMaint: [],
    };
  }
}

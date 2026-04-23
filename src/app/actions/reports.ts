"use server";

import { supabase } from "@/lib/db";

export async function getReportsData() {
  try {
    // Sales by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: sales } = await supabase
      .from('Sale')
      .select('id, totalAmount, createdAt')
      .gte('createdAt', sevenDaysAgo.toISOString())
      .order('createdAt', { ascending: false });

    const { data: allSales } = await supabase
      .from('Sale')
      .select('id, totalAmount, createdAt');

    const { data: tickets } = await supabase
      .from('MaintenanceTicket')
      .select('id, status, cost, deviceType, createdAt');

    const { data: items } = await supabase
      .from('InventoryItem')
      .select('id, name, category, sellPrice, quantity');

    // Group sales by day
    const salesByDay: Record<string, number> = {};
    (sales || []).forEach((s: any) => {
      const day = new Date(s.createdAt).toLocaleDateString("ar-EG", { weekday: "short", day: "numeric" });
      salesByDay[day] = (salesByDay[day] || 0) + (Number(s.totalAmount) || 0);
    });

    // Category breakdown
    const byCategory: Record<string, number> = {};
    (items || []).forEach((item: any) => {
      const cat = item.category || "أخرى";
      byCategory[cat] = (byCategory[cat] || 0) + ((Number(item.sellPrice) || 0) * (Number(item.quantity) || 0));
    });

    // Maintenance by status
    const ticketsByStatus = {
      PENDING: (tickets || []).filter((t: any) => t.status === 'PENDING').length,
      IN_PROGRESS: (tickets || []).filter((t: any) => t.status === 'IN_PROGRESS').length,
      DONE: (tickets || []).filter((t: any) => t.status === 'DONE').length,
    };

    const totalRevenue = (allSales || []).reduce((s: number, sale: any) => s + (Number(sale.totalAmount) || 0), 0);
    const maintenanceRevenue = (tickets || []).filter((t: any) => t.status === 'DONE').reduce((s: number, t: any) => s + (Number(t.cost) || 0), 0);

    return {
      totalRevenue,
      maintenanceRevenue,
      totalSalesCount: (allSales || []).length,
      totalTickets: (tickets || []).length,
      salesByDay,
      byCategory,
      ticketsByStatus,
      recentSales: (sales || []).slice(0, 10),
      lowStockItems: (items || []).filter((i: any) => (i.quantity || 0) < 5),
    };
  } catch (e) {
    console.error("getReportsData error:", e);
    return {
      totalRevenue: 0, maintenanceRevenue: 0,
      totalSalesCount: 0, totalTickets: 0,
      salesByDay: {}, byCategory: {},
      ticketsByStatus: { PENDING: 0, IN_PROGRESS: 0, DONE: 0 },
      recentSales: [], lowStockItems: [],
    };
  }
}

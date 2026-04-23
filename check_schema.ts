import { supabase } from "./src/lib/db";

async function checkSchema() {
  const { data, error } = await supabase.from('InventoryItem').select('*').limit(1);
  if (error) {
    console.error("Error fetching InventoryItem:", error);
  } else {
    console.log("InventoryItem Sample Data:", data[0]);
    if (data[0]) {
      console.log("Keys:", Object.keys(data[0]));
    } else {
      console.log("Table is empty, trying to get columns via RPC or just guessing...");
    }
  }
}

checkSchema();

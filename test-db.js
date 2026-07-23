import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://unfveyhxbfnshjdadcfn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZnZleWh4YmZuc2hqZGFkY2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzAxMjksImV4cCI6MjA3NzE0NjEyOX0.63Vehg5KUmul6XpwcpgVmX_biozmtkfri32_t4ZgHZ8'
);

async function check() {
  const { data, error } = await supabase.from('recurring_expenses').select('*');
  console.log(JSON.stringify(data, null, 2));
}

check();

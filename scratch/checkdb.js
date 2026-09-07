import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://pkvnujfbfqggoocylpdt.supabase.co', // use actual or throw
  process.env.VITE_SUPABASE_ANON_KEY || 'fake'
)

async function check() {
  const { data: rec } = await supabase.from('recurring_expenses').select('*')
  console.log("Recurring Expenses:", JSON.stringify(rec, null, 2))
  
  const { data: inst } = await supabase.from('recurring_expense_installments').select('*')
  console.log("Recurring Installments:", JSON.stringify(inst, null, 2))
}
check()

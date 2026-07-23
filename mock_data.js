import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://unfveyhxbfnshjdadcfn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVuZnZleWh4YmZuc2hqZGFkY2ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NzAxMjksImV4cCI6MjA3NzE0NjEyOX0.63Vehg5KUmul6XpwcpgVmX_biozmtkfri32_t4ZgHZ8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Inserindo contratos fixos fictícios...');
  
  const mockExpenses = [
    { name: 'Pró-labore Diretor', category: 'folha', amount: 5000, value_type: 'fixed', is_active: true, recurrence_type: 'mensal' },
    { name: 'Aluguel Comercial', category: 'infraestrutura', amount: 2500, value_type: 'fixed', is_active: true, recurrence_type: 'mensal' },
    { name: 'Energia Elétrica', category: 'infraestrutura', amount: 600, value_type: 'variable', is_active: true, recurrence_type: 'mensal' }
  ];

  const { data: insertedExpenses, error: insExpErr } = await supabase.from('recurring_expenses').insert(mockExpenses).select();
  
  if (insExpErr) {
    console.error('Erro ao inserir contas fixas:', insExpErr);
    return;
  }
  
  console.log('Contas cadastradas. Inserindo parcelas...');

  const today = new Date();
  const overdueDate = new Date(today);
  overdueDate.setDate(overdueDate.getDate() - 3); // 3 dias atrás
  
  const soonDate = new Date(today);
  soonDate.setDate(soonDate.getDate() + 4); // Daqui a 4 dias

  const variableDate = new Date(today);
  variableDate.setDate(variableDate.getDate() + 2); // Daqui a 2 dias

  const mocks = [];
  
  // 1. Atrasado
  if (insertedExpenses.length > 0) {
    mocks.push({
      recurring_expense_id: insertedExpenses[0].id,
      due_date: overdueDate.toISOString().split('T')[0],
      value: insertedExpenses[0].amount || 1500,
      status: 'pendente'
    });
  }

  // 2. Próximos 7 dias
  if (insertedExpenses.length > 1) {
    mocks.push({
      recurring_expense_id: insertedExpenses[1].id,
      due_date: soonDate.toISOString().split('T')[0],
      value: insertedExpenses[1].amount || 850,
      status: 'pendente'
    });
  }

  // 3. Aguardando Valor (Variável)
  if (insertedExpenses.length > 2) {
    mocks.push({
      recurring_expense_id: insertedExpenses[2].id,
      due_date: variableDate.toISOString().split('T')[0],
      value: null,
      status: 'aguardando_valor'
    });
  }

  const { error: insErr } = await supabase.from('recurring_expense_installments').insert(mocks);
  
  if (insErr) {
    console.error('Erro ao inserir parcelas:', insErr);
  } else {
    console.log('Sucesso! Parcelas e contas criadas.');
  }
}

run();

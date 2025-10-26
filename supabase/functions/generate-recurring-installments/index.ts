import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting recurring installments generation...');

    let payload: Record<string, unknown> = {};
    try {
      if (req.headers.get('content-type')?.includes('application/json')) {
        payload = await req.json();
      }
    } catch (parseError) {
      console.warn('Could not parse request body for generate-recurring-installments:', parseError);
    }

    const expenseId = typeof payload.expenseId === 'string' ? payload.expenseId : undefined;
    const monthsAheadRaw = Number(payload.monthsAhead);
    const monthsAhead = Number.isFinite(monthsAheadRaw) ? Math.min(Math.max(monthsAheadRaw, 1), 12) : 3;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch active recurring expenses
    let expensesQuery = supabase
      .from('recurring_expenses')
      .select('*')
      .eq('is_active', true);

    if (expenseId) {
      expensesQuery = expensesQuery.eq('id', expenseId);
    }

    const { data: expenses, error: fetchError } = await expensesQuery;

    if (fetchError) {
      console.error('Error fetching expenses:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${expenses?.length || 0} active recurring expenses`);

    const today = new Date();
    const installmentsToCreate = [];

    const recurrenceMonths: Record<string, number> = {
      'mensal': 1,
      'bimestral': 2,
      'trimestral': 3,
      'semestral': 6,
      'anual': 12,
    };

    for (const expense of expenses || []) {
      console.log(`Processing expense: ${expense.name}`);
      
      const monthsToAdd = recurrenceMonths[expense.recurrence_type] || 1;

      const periodsToGenerate = Math.max(1, Math.ceil(monthsAhead / monthsToAdd));

      for (let i = 0; i < periodsToGenerate; i++) {
        const referenceDate = new Date(today);
        referenceDate.setMonth(referenceDate.getMonth() + (i * monthsToAdd));
        referenceDate.setDate(1); // First day of the month
        
        const referenceMonth = referenceDate.toISOString().split('T')[0];
        
        // Check if installment already exists
        const { data: existing } = await supabase
          .from('recurring_expense_installments')
          .select('id')
          .eq('recurring_expense_id', expense.id)
          .eq('reference_month', referenceMonth)
          .maybeSingle();
        
        if (existing) {
          console.log(`Installment already exists for ${expense.name} - ${referenceMonth}`);
          continue;
        }
        
        // Calculate due date
        const dueDate = new Date(referenceDate);
        dueDate.setDate(Math.min(expense.due_day, new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0).getDate()));
        
        // Check if it's before start_date or after end_date
        if (dueDate < new Date(expense.start_date)) {
          console.log(`Due date ${dueDate.toISOString()} is before start date ${expense.start_date}`);
          continue;
        }
        
        if (expense.end_date && dueDate > new Date(expense.end_date)) {
          console.log(`Due date ${dueDate.toISOString()} is after end date ${expense.end_date}`);
          continue;
        }
        
        installmentsToCreate.push({
          user_id: expense.user_id,
          recurring_expense_id: expense.id,
          supplier_id: expense.supplier_id,
          reference_month: referenceMonth,
          value: expense.amount,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pendente',
        });
      }
    }

    console.log(`Creating ${installmentsToCreate.length} installments...`);

    if (installmentsToCreate.length > 0) {
      const { error: insertError } = await supabase
        .from('recurring_expense_installments')
        .insert(installmentsToCreate);

      if (insertError) {
        console.error('Error inserting installments:', insertError);
        throw insertError;
      }
    }

    console.log('Generation complete!');

    return new Response(
      JSON.stringify({ 
        success: true, 
        generated: installmentsToCreate.length,
        message: `Successfully generated ${installmentsToCreate.length} installments`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-recurring-installments:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

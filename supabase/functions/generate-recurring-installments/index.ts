import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const getDueDateForExpense = (referenceDate: Date, expense: Record<string, unknown>) => {
  const rule = (expense.due_rule_type as string) ?? 'specific_day';
  const base = new Date(referenceDate);
  base.setDate(1);
  const daysInMonth = getDaysInMonth(base);

  if (rule === 'days_after_start') {
    const offsetRaw = typeof expense.due_day_offset === 'number' ? expense.due_day_offset : 0;
    const safeOffset = Math.max(0, Math.min(offsetRaw, daysInMonth - 1));
    base.setDate(1 + safeOffset);
    return base;
  }

  const desiredDayRaw = typeof expense.due_day === 'number' ? expense.due_day : 1;
  const safeDay = Math.max(1, Math.min(desiredDayRaw, daysInMonth));
  base.setDate(safeDay);
  return base;
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
    const rebuildModeRaw = typeof payload.rebuildMode === 'string' ? payload.rebuildMode : undefined;
    const validRebuildModes = new Set(['replace-upcoming', 'remove-upcoming']);
    const rebuildMode = rebuildModeRaw && validRebuildModes.has(rebuildModeRaw) ? rebuildModeRaw : null;
    const rebuildFrom = typeof payload.rebuildFrom === 'string' ? payload.rebuildFrom : undefined;

    const baseDate = new Date();
    const todayISO = baseDate.toISOString().split('T')[0];
    const rebuildFromDate = rebuildFrom ? new Date(rebuildFrom) : baseDate;
    const rebuildFromISO = Number.isNaN(rebuildFromDate.getTime())
      ? todayISO
      : rebuildFromDate.toISOString().split('T')[0];
    const rebuildReferenceDate = Number.isNaN(rebuildFromDate.getTime()) ? new Date(baseDate) : new Date(rebuildFromDate);
    rebuildReferenceDate.setDate(1);
    const rebuildReferenceISO = rebuildReferenceDate.toISOString().split('T')[0];

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch active recurring expenses
    let expensesQuery = supabase
      .from('recurring_expenses')
      .select('*');

    if (expenseId) {
      expensesQuery = expensesQuery.eq('id', expenseId);
      if (rebuildMode !== 'remove-upcoming') {
        expensesQuery = expensesQuery.eq('is_active', true);
      }
    } else {
      expensesQuery = expensesQuery.eq('is_active', true);
    }

    const { data: expenses, error: fetchError } = await expensesQuery;

    if (fetchError) {
      console.error('Error fetching expenses:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${expenses?.length || 0} active recurring expenses`);

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

      if ((rebuildMode === 'replace-upcoming' || rebuildMode === 'remove-upcoming') && expense.id) {
        const { error: deleteError } = await supabase
          .from('recurring_expense_installments')
          .delete()
          .eq('recurring_expense_id', expense.id)
          .neq('status', 'pago')
          .gte('reference_month', rebuildReferenceISO);

        if (deleteError) {
          console.error('Error removing existing installments:', deleteError);
          throw deleteError;
        }

        if (rebuildMode === 'remove-upcoming') {
          console.log(`Removed upcoming installments for ${expense.name} (mode: remove-upcoming)`);
          continue;
        }
      }

      if (!expense.is_active) {
        console.log(`Skipping generation for ${expense.name} because it is inactive.`);
        continue;
      }
      
      const monthsToAdd = recurrenceMonths[expense.recurrence_type] || 1;

      const periodsToGenerate = Math.max(1, Math.ceil(monthsAhead / monthsToAdd));

      for (let i = 0; i < periodsToGenerate; i++) {
        const referenceDate = new Date(baseDate);
        referenceDate.setMonth(referenceDate.getMonth() + (i * monthsToAdd));
        referenceDate.setDate(1); // First day of the month
        
        const referenceMonth = referenceDate.toISOString().split('T')[0];
        
        // Support multiple due days (expense.due_days as array)
        const isVariableValue = (expense.value_type as string) === 'variable';
        const baseAmount = typeof expense.amount === 'number' ? Number(expense.amount) : null;

        const dueDaysArray = Array.isArray(expense.due_days) && expense.due_days.length > 0
          ? expense.due_days.map((d: unknown) => Number(d)).filter((n) => Number.isInteger(n) && n >= 1 && n <= getDaysInMonth(referenceDate))
          : null;

        if (dueDaysArray && dueDaysArray.length > 0) {
          for (const desiredDay of dueDaysArray) {
            const candidate = new Date(referenceDate);
            const safeDay = Math.max(1, Math.min(desiredDay, getDaysInMonth(candidate)));
            candidate.setDate(safeDay);

            // Check if it's before start_date or after end_date
            if (candidate < new Date(expense.start_date)) {
              console.log(`Due date ${candidate.toISOString()} is before start date ${expense.start_date}`);
              continue;
            }
            if (expense.end_date && candidate > new Date(expense.end_date)) {
              console.log(`Due date ${candidate.toISOString()} is after end date ${expense.end_date}`);
              continue;
            }

            const dueDateISO = candidate.toISOString().split('T')[0];

            // Check if installment already exists for this specific due date
            const { data: existingForDay } = await supabase
              .from('recurring_expense_installments')
              .select('id')
              .eq('recurring_expense_id', expense.id)
              .eq('reference_month', referenceMonth)
              .eq('due_date', dueDateISO)
              .maybeSingle();

            if (existingForDay) {
              console.log(`Installment already exists for ${expense.name} - ${referenceMonth} - ${dueDateISO}`);
              continue;
            }

            installmentsToCreate.push({
              user_id: expense.user_id,
              recurring_expense_id: expense.id,
              supplier_id: expense.supplier_id,
              reference_month: referenceMonth,
              value: isVariableValue ? null : baseAmount,
              due_date: dueDateISO,
              status: isVariableValue ? 'aguardando_valor' : 'pendente',
            });
          }
        } else {
          // Calculate due date following the configured rule
          const dueDate = getDueDateForExpense(referenceDate, expense);

          // Check if it's before start_date or after end_date
          if (dueDate < new Date(expense.start_date)) {
            console.log(`Due date ${dueDate.toISOString()} is before start date ${expense.start_date}`);
            continue;
          }

          if (expense.end_date && dueDate > new Date(expense.end_date)) {
            console.log(`Due date ${dueDate.toISOString()} is after end date ${expense.end_date}`);
            continue;
          }

          const dueDateISO = dueDate.toISOString().split('T')[0];

          // Check if installment already exists for this specific due date
          const { data: existingForDay } = await supabase
            .from('recurring_expense_installments')
            .select('id')
            .eq('recurring_expense_id', expense.id)
            .eq('reference_month', referenceMonth)
            .eq('due_date', dueDateISO)
            .maybeSingle();

          if (existingForDay) {
            console.log(`Installment already exists for ${expense.name} - ${referenceMonth} - ${dueDateISO}`);
            continue;
          }

          installmentsToCreate.push({
            user_id: expense.user_id,
            recurring_expense_id: expense.id,
            supplier_id: expense.supplier_id,
            reference_month: referenceMonth,
            value: isVariableValue ? null : baseAmount,
            due_date: dueDateISO,
            status: isVariableValue ? 'aguardando_valor' : 'pendente',
          });
        }
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

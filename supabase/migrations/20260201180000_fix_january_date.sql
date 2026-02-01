-- Fix incorrect date: Change February 2026 closings to January 2026
-- This is a one-time data correction script
UPDATE public.financial_closings
SET month = '2026-01'
WHERE month = '2026-02';

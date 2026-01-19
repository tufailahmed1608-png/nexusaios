-- Fix enterprise_signals RLS policies to restrict access by role
-- Only Program Manager, PMO, and Admin roles should have access

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view all signals" ON public.enterprise_signals;
DROP POLICY IF EXISTS "Authenticated users can insert signals" ON public.enterprise_signals;
DROP POLICY IF EXISTS "Authenticated users can update signals" ON public.enterprise_signals;
DROP POLICY IF EXISTS "Authenticated users can delete signals" ON public.enterprise_signals;

-- Create new role-restricted policies

-- SELECT: Only Program Manager, PMO, Executive, and Admin can view signals
CREATE POLICY "Authorized roles can view signals"
ON public.enterprise_signals
FOR SELECT
USING (
  has_role(auth.uid(), 'program_manager'::app_role) OR
  has_role(auth.uid(), 'pmo'::app_role) OR
  has_role(auth.uid(), 'executive'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- INSERT: Only PMO and Admin can create signals
CREATE POLICY "PMO and Admin can insert signals"
ON public.enterprise_signals
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'pmo'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- UPDATE: Only PMO and Admin can update signals
CREATE POLICY "PMO and Admin can update signals"
ON public.enterprise_signals
FOR UPDATE
USING (
  has_role(auth.uid(), 'pmo'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- DELETE: Only PMO and Admin can delete signals
CREATE POLICY "PMO and Admin can delete signals"
ON public.enterprise_signals
FOR DELETE
USING (
  has_role(auth.uid(), 'pmo'::app_role) OR
  has_role(auth.uid(), 'admin'::app_role)
);
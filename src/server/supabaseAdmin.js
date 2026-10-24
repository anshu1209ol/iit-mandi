/**
 * Server-Side Supabase Administration Module
 *
 * CRITICAL SECURITY RULE:
 * This module is STRICTLY FOR SERVER-SIDE EXECUTION (Node.js, Edge Functions, SSR).
 * Never import or execute this file in browser bundles.
 * It accesses SUPABASE_SERVICE_ROLE_KEY to perform privileged administrative mutations
 * and write tamper-evident audit logs.
 */

import { createClient } from '@supabase/supabase-js';

// Guard: prevent bundling or execution in browser environment
if (typeof window !== 'undefined') {
  throw new Error(
    'CRITICAL SECURITY ERROR: supabaseAdmin.js cannot be loaded in a browser context. Service-role credentials must remain strictly server-side.'
  );
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isServerAdminConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceRoleKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseServiceRoleKey.includes('your-service-role-key')
);

export const supabaseAdmin = isServerAdminConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Server-side audit logging helper
 */
export async function logAuditEvent({
  actorId = null,
  action,
  entityType,
  entityId,
  oldData = null,
  newData = null,
  ipAddress = null,
}) {
  if (!supabaseAdmin) {
    console.warn('[Audit Log (Local)]: ', { action, entityType, entityId, actorId });
    return { success: true, local: true };
  }

  try {
    const { data, error } = await supabaseAdmin.from('audit_logs').insert([
      {
        actor_id: actorId,
        action,
        entity_type: entityType,
        entity_id: String(entityId),
        old_data: oldData,
        new_data: newData,
        ip_address: ipAddress,
      },
    ]);

    if (error) {
      console.error('Failed to write audit log to Supabase:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception writing audit log:', err);
    return { success: false, error: err };
  }
}

/**
 * Server-side check for user admin role
 * Verifies against the public.admin_roles table with service role authority.
 */
export async function verifyUserAdminRole(userId, requiredRole = null) {
  if (!supabaseAdmin || !userId) {
    return false;
  }

  try {
    let query = supabaseAdmin
      .from('admin_roles')
      .select('role')
      .eq('user_id', userId);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return false;
    }

    if (!requiredRole) {
      return true;
    }

    return data.some(
      (r) => r.role === requiredRole || r.role === 'super_admin'
    );
  } catch (err) {
    console.error('Failed to verify admin role on server:', err);
    return false;
  }
}

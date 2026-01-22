/**
 * Helper functions for querying the external Supabase database
 * These bypass local type checking for tables that exist only on the external DB
 */

import { externalSupabase } from './externalClient';

// Type-safe query helper that bypasses local schema validation
export const extQuery = (tableName: string) => {
  return (externalSupabase.from(tableName as any) as any);
};

// Helper for storage operations
export const extStorage = (bucketName: string) => {
  return externalSupabase.storage.from(bucketName);
};

// Helper for function invocations
export const extFunctions = {
  invoke: async (functionName: string, options?: { body?: any }) => {
    return externalSupabase.functions.invoke(functionName, options);
  }
};

// Re-export the client for auth operations
export { externalSupabase };

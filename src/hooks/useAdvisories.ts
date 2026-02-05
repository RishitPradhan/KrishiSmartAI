import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Advisory {
  id: string;
  title: string;
  title_regional: string | null;
  content: string;
  content_regional: string | null;
  category: string | null;
  season: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useAdvisories() {
  return useQuery({
    queryKey: ['advisories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advisories')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Advisory[];
    },
  });
}

export function useCreateAdvisory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (advisory: Omit<Advisory, 'id' | 'created_by' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('advisories')
        .insert({ ...advisory, created_by: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
    },
  });
}

export function useUpdateAdvisory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Advisory> & { id: string }) => {
      const { data, error } = await supabase
        .from('advisories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
    },
  });
}

export function useDeleteAdvisory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('advisories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
    },
  });
}

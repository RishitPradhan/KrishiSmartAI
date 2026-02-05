import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

export interface ResidueRecommendation {
  id: string;
  user_id: string;
  crop_type: string;
  residue_type: string;
  quantity_kg: number | null;
  suggested_methods: string[] | null;
  estimated_income: number | null;
  step_by_step_guidance: Record<string, unknown> | null;
  created_at: string;
}

export function useResidueRecommendations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['residue-recommendations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('residue_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ResidueRecommendation[];
    },
    enabled: !!user,
  });
}

export function useCreateResidueRecommendation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recommendation: { 
      crop_type: string; 
      residue_type: string; 
      quantity_kg?: number | null;
      suggested_methods?: string[] | null;
      estimated_income?: number | null;
      step_by_step_guidance?: Record<string, unknown> | null;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const insertData = {
        crop_type: recommendation.crop_type,
        residue_type: recommendation.residue_type,
        quantity_kg: recommendation.quantity_kg ?? null,
        suggested_methods: recommendation.suggested_methods ?? null,
        estimated_income: recommendation.estimated_income ?? null,
        step_by_step_guidance: (recommendation.step_by_step_guidance as Json) ?? null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('residue_recommendations')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residue-recommendations', user?.id] });
    },
  });
}

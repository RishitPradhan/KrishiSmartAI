import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CropAnalysis {
  id: string;
  user_id: string;
  image_url: string;
  crop_type: string | null;
  detected_disease: string | null;
  confidence_score: number | null;
  treatment_steps: string[] | null;
  pesticide_recommendation: string | null;
  prevention_tips: string[] | null;
  analysis_status: string;
  created_at: string;
}

export function useCropAnalyses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['crop-analyses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('crop_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CropAnalysis[];
    },
    enabled: !!user,
  });
}

export function useCreateCropAnalysis() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (analysis: Omit<CropAnalysis, 'id' | 'user_id' | 'created_at'>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('crop_analyses')
        .insert({ ...analysis, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crop-analyses', user?.id] });
    },
  });
}

-- Create profiles table for farmer details
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    location TEXT,
    farm_size TEXT,
    primary_crops TEXT[],
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT false,
    language_preference TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crop_analyses table for disease detection results
CREATE TABLE public.crop_analyses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    crop_type TEXT,
    detected_disease TEXT,
    confidence_score NUMERIC(5, 2),
    treatment_steps TEXT[],
    pesticide_recommendation TEXT,
    prevention_tips TEXT[],
    analysis_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create residue_recommendations table
CREATE TABLE public.residue_recommendations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_type TEXT NOT NULL,
    residue_type TEXT NOT NULL,
    quantity_kg NUMERIC(10, 2),
    suggested_methods TEXT[],
    estimated_income NUMERIC(10, 2),
    step_by_step_guidance JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create advisories table for admin-managed content
CREATE TABLE public.advisories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    title_regional TEXT,
    content TEXT NOT NULL,
    content_regional TEXT,
    category TEXT,
    season TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.residue_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Crop analyses policies
CREATE POLICY "Users can view their own analyses"
ON public.crop_analyses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analyses"
ON public.crop_analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
ON public.crop_analyses FOR DELETE
USING (auth.uid() = user_id);

-- Residue recommendations policies
CREATE POLICY "Users can view their own recommendations"
ON public.residue_recommendations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations"
ON public.residue_recommendations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations"
ON public.residue_recommendations FOR DELETE
USING (auth.uid() = user_id);

-- Advisories policies (public read, admin write)
CREATE POLICY "Anyone can view active advisories"
ON public.advisories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage advisories"
ON public.advisories FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.is_admin = true
    )
);

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$;

-- Trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advisories_updated_at
    BEFORE UPDATE ON public.advisories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for crop images
INSERT INTO storage.buckets (id, name, public)
VALUES ('crop-images', 'crop-images', true);

-- Storage policies for crop images
CREATE POLICY "Users can upload their own crop images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'crop-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view crop images"
ON storage.objects FOR SELECT
USING (bucket_id = 'crop-images');

CREATE POLICY "Users can delete their own crop images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'crop-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
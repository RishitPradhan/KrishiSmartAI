import { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateCropAnalysis } from '@/hooks/useCropAnalyses';
import { 
  Camera, 
  Upload, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Pill, 
  Shield, 
  Stethoscope,
  Image as ImageIcon
} from 'lucide-react';

// Mock AI analysis function - replace with actual AI service
async function analyzeCropImage(imageUrl: string): Promise<{
  detected_disease: string | null;
  confidence_score: number;
  treatment_steps: string[];
  pesticide_recommendation: string;
  prevention_tips: string[];
  crop_type: string;
}> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response - in production, this would call an AI API
  const diseases = [
    {
      disease: 'Late Blight',
      crop: 'Tomato',
      confidence: 87.5,
      treatment: ['Remove infected leaves immediately', 'Apply copper-based fungicide', 'Improve air circulation', 'Water at base, not leaves'],
      pesticide: 'Mancozeb 75% WP @ 2g/L or Copper Oxychloride @ 3g/L',
      prevention: ['Use disease-resistant varieties', 'Maintain proper spacing', 'Avoid overhead irrigation', 'Remove crop debris after harvest']
    },
    {
      disease: 'Powdery Mildew',
      crop: 'Wheat',
      confidence: 92.3,
      treatment: ['Apply sulfur-based fungicide', 'Prune affected areas', 'Increase air circulation'],
      pesticide: 'Sulfur 80% WP @ 2.5g/L or Triadimefon @ 1g/L',
      prevention: ['Plant resistant varieties', 'Avoid overcrowding', 'Water in morning']
    },
    {
      disease: null,
      crop: 'Rice',
      confidence: 95.8,
      treatment: [],
      pesticide: 'No treatment needed - crop appears healthy',
      prevention: ['Continue good farming practices', 'Monitor regularly']
    }
  ];
  
  const result = diseases[Math.floor(Math.random() * diseases.length)];
  
  return {
    detected_disease: result.disease,
    confidence_score: result.confidence,
    treatment_steps: result.treatment,
    pesticide_recommendation: result.pesticide,
    prevention_tips: result.prevention,
    crop_type: result.crop
  };
}

export default function DiseaseDetectionPage() {
  const { user } = useAuth();
  const createAnalysis = useCreateCropAnalysis();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    detected_disease: string | null;
    confidence_score: number;
    treatment_steps: string[];
    pesticide_recommendation: string;
    prevention_tips: string[];
    crop_type: string;
  } | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !user) return;

    setUploading(true);
    
    try {
      // Upload image to Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${selectedImage.name}`;
      const { error: uploadError } = await supabase.storage
        .from('crop-images')
        .upload(fileName, selectedImage);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('crop-images')
        .getPublicUrl(fileName);

      setUploading(false);
      setAnalyzing(true);

      // Analyze the image with AI
      const analysisResult = await analyzeCropImage(publicUrl);
      setResult(analysisResult);

      // Save to database
      await createAnalysis.mutateAsync({
        image_url: publicUrl,
        crop_type: analysisResult.crop_type,
        detected_disease: analysisResult.detected_disease,
        confidence_score: analysisResult.confidence_score,
        treatment_steps: analysisResult.treatment_steps,
        pesticide_recommendation: analysisResult.pesticide_recommendation,
        prevention_tips: analysisResult.prevention_tips,
        analysis_status: 'completed'
      });

      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Crop Disease Detection
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload a photo of your crop to detect diseases using AI
          </p>
        </div>

        {/* Upload Section */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Upload Crop Image
            </CardTitle>
            <CardDescription>
              Take a clear photo of the affected plant leaves for best results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                  transition-all duration-200
                  ${previewUrl 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Selected crop"
                      className="max-h-64 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-muted-foreground">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedImage || uploading || analyzing}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
                {selectedImage && (
                  <Button variant="outline" onClick={resetAnalysis}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Disease Status */}
            <Card className={`border-0 shadow-card ${result.detected_disease ? 'bg-warning/5' : 'bg-success/5'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    result.detected_disease ? 'bg-warning/20' : 'bg-success/20'
                  }`}>
                    {result.detected_disease ? (
                      <AlertCircle className="w-7 h-7 text-warning" />
                    ) : (
                      <CheckCircle className="w-7 h-7 text-success" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold">
                      {result.detected_disease || 'No Disease Detected'}
                    </h3>
                    <p className="text-muted-foreground">
                      Crop: {result.crop_type} • Confidence: {result.confidence_score}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Treatment Steps */}
            {result.treatment_steps.length > 0 && (
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Stethoscope className="w-5 h-5 text-primary" />
                    Treatment Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {result.treatment_steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Pesticide Recommendation */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Pill className="w-5 h-5 text-accent" />
                  Pesticide Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-accent/10">
                  <p className="text-foreground font-medium">{result.pesticide_recommendation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Prevention Tips */}
            {result.prevention_tips.length > 0 && (
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-success" />
                    Prevention Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.prevention_tips.map((tip, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                        <span className="text-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* New Analysis Button */}
            <Button onClick={resetAnalysis} variant="outline" className="w-full">
              Start New Analysis
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

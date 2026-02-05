import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCropAnalyses } from '@/hooks/useCropAnalyses';
import { useResidueRecommendations } from '@/hooks/useResidueRecommendations';
import { 
  History, 
  Camera, 
  Recycle, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  Calendar
} from 'lucide-react';

export default function HistoryPage() {
  const { data: analyses, isLoading: loadingAnalyses } = useCropAnalyses();
  const { data: recommendations, isLoading: loadingRecommendations } = useResidueRecommendations();

  const isLoading = loadingAnalyses || loadingRecommendations;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Analysis History
          </h1>
          <p className="text-muted-foreground mt-1">
            View your previous crop analyses and residue recommendations
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="diseases" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="diseases" className="gap-2">
              <Camera className="w-4 h-4" />
              Disease Scans
            </TabsTrigger>
            <TabsTrigger value="residue" className="gap-2">
              <Recycle className="w-4 h-4" />
              Residue Plans
            </TabsTrigger>
          </TabsList>

          {/* Disease Analyses Tab */}
          <TabsContent value="diseases">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : analyses?.length === 0 ? (
              <Card className="border-0 shadow-card">
                <CardContent className="py-12 text-center">
                  <Camera className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    No Analyses Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Upload your first crop image to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analyses?.map((analysis) => (
                  <Card key={analysis.id} className="border-0 shadow-card card-hover overflow-hidden">
                    <div className="h-40 bg-muted">
                      <img
                        src={analysis.image_url}
                        alt="Crop analysis"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          analysis.detected_disease 
                            ? 'bg-warning/10' 
                            : 'bg-success/10'
                        }`}>
                          {analysis.detected_disease ? (
                            <AlertCircle className="w-4 h-4 text-warning" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-success" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">
                            {analysis.detected_disease || 'Healthy Crop'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {analysis.crop_type || 'Unknown crop'}
                          </p>
                        </div>
                      </div>

                      {analysis.confidence_score && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Confidence</span>
                            <span className="font-medium text-foreground">
                              {analysis.confidence_score}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${analysis.confidence_score}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {new Date(analysis.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Residue Recommendations Tab */}
          <TabsContent value="residue">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : recommendations?.length === 0 ? (
              <Card className="border-0 shadow-card">
                <CardContent className="py-12 text-center">
                  <Recycle className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                    No Recommendations Yet
                  </h3>
                  <p className="text-muted-foreground">
                    Get your first residue reuse recommendation
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {recommendations?.map((rec) => (
                  <Card key={rec.id} className="border-0 shadow-card">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                          <Recycle className="w-6 h-6 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="font-medium text-foreground">
                              {rec.crop_type} - {rec.residue_type}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
                              {rec.quantity_kg}kg
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {rec.suggested_methods?.map((method, index) => (
                              <span 
                                key={index}
                                className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                              >
                                {method}
                              </span>
                            ))}
                          </div>

                          {rec.estimated_income && (
                            <p className="text-sm text-success font-medium mb-2">
                              Estimated Income: ₹{rec.estimated_income.toFixed(0)}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(rec.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCropAnalyses } from '@/hooks/useCropAnalyses';
import { useResidueRecommendations } from '@/hooks/useResidueRecommendations';
import { useAdvisories } from '@/hooks/useAdvisories';
import { useProfile } from '@/hooks/useProfile';
import { 
  Camera, 
  Recycle, 
  BookOpen, 
  History, 
  TrendingUp, 
  AlertTriangle,
  Leaf,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickActions = [
  {
    title: 'Upload Crop Image',
    description: 'Detect diseases with AI analysis',
    icon: Camera,
    path: '/disease-detection',
    color: 'bg-success/10 text-success',
  },
  {
    title: 'Residue Advisor',
    description: 'Get reuse recommendations',
    icon: Recycle,
    path: '/residue-advisor',
    color: 'bg-accent/20 text-accent-foreground',
  },
  {
    title: 'Advisory Updates',
    description: 'Seasonal farming tips',
    icon: BookOpen,
    path: '/advisories',
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'View History',
    description: 'Previous analysis results',
    icon: History,
    path: '/history',
    color: 'bg-warning/10 text-warning',
  },
];

export default function DashboardPage() {
  const { data: profile } = useProfile();
  const { data: analyses } = useCropAnalyses();
  const { data: recommendations } = useResidueRecommendations();
  const { data: advisories } = useAdvisories();

  const recentAnalyses = analyses?.slice(0, 3) || [];
  const totalAnalyses = analyses?.length || 0;
  const totalRecommendations = recommendations?.length || 0;
  const diseasesDetected = analyses?.filter(a => a.detected_disease)?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              Welcome back, {profile?.full_name || 'Farmer'}! 🌾
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your farm today
            </p>
          </div>
          <Link to="/disease-detection">
            <Button className="gap-2">
              <Camera className="w-4 h-4" />
              New Scan
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-hover border-0 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <p className="font-heading text-3xl font-bold text-foreground">{totalAnalyses}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Diseases Found</p>
                  <p className="font-heading text-3xl font-bold text-foreground">{diseasesDetected}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover border-0 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Residue Plans</p>
                  <p className="font-heading text-3xl font-bold text-foreground">{totalRecommendations}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-heading text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.path} to={action.path}>
                  <Card className="card-hover h-full border-0 shadow-card cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                      <ArrowRight className="w-4 h-4 mt-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity & Advisories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Analyses */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Recent Analyses</CardTitle>
              <CardDescription>Your latest crop scans</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAnalyses.length === 0 ? (
                <div className="text-center py-8">
                  <Leaf className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No analyses yet</p>
                  <Link to="/disease-detection">
                    <Button variant="outline" size="sm" className="mt-3">
                      Start Your First Scan
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAnalyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden">
                        <img
                          src={analysis.image_url}
                          alt="Crop"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {analysis.detected_disease || 'Healthy'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {analysis.crop_type || 'Unknown crop'}
                        </p>
                      </div>
                      {analysis.confidence_score && (
                        <span className="text-sm font-medium text-primary">
                          {analysis.confidence_score}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Latest Advisories */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Latest Advisories</CardTitle>
              <CardDescription>Seasonal farming tips</CardDescription>
            </CardHeader>
            <CardContent>
              {!advisories?.length ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No advisories available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {advisories.slice(0, 3).map((advisory) => (
                    <div
                      key={advisory.id}
                      className="p-4 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{advisory.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {advisory.content}
                          </p>
                          {advisory.season && (
                            <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent-foreground">
                              {advisory.season}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

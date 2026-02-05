import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdvisories } from '@/hooks/useAdvisories';
import { BookOpen, Calendar, Tag, Loader2 } from 'lucide-react';

const categoryColors: Record<string, string> = {
  'pest-control': 'bg-warning/10 text-warning',
  'irrigation': 'bg-blue-500/10 text-blue-600',
  'fertilizer': 'bg-success/10 text-success',
  'weather': 'bg-purple-500/10 text-purple-600',
  'market': 'bg-accent/20 text-accent-foreground',
  'default': 'bg-primary/10 text-primary'
};

const seasonColors: Record<string, string> = {
  'kharif': 'bg-success/10 text-success',
  'rabi': 'bg-blue-500/10 text-blue-600',
  'zaid': 'bg-warning/10 text-warning',
  'all': 'bg-muted text-muted-foreground'
};

export default function AdvisoriesPage() {
  const { data: advisories, isLoading } = useAdvisories();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Knowledge Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Seasonal farming advisories and best practices
          </p>
        </div>

        {/* Advisories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : advisories?.length === 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                No Advisories Yet
              </h3>
              <p className="text-muted-foreground">
                Check back later for seasonal farming tips and guidance
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {advisories?.map((advisory) => (
              <Card key={advisory.id} className="border-0 shadow-card card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="font-heading text-lg leading-tight">
                        {advisory.title}
                      </CardTitle>
                      {advisory.title_regional && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {advisory.title_regional}
                        </p>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">
                    {advisory.content}
                  </p>
                  {advisory.content_regional && (
                    <p className="text-muted-foreground mt-2 text-sm italic">
                      {advisory.content_regional}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {advisory.category && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        categoryColors[advisory.category] || categoryColors.default
                      }`}>
                        <Tag className="w-3 h-3" />
                        {advisory.category}
                      </span>
                    )}
                    {advisory.season && (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        seasonColors[advisory.season.toLowerCase()] || seasonColors.all
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {advisory.season}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    {new Date(advisory.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

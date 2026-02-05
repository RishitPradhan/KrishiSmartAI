import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Leaf, 
  Camera, 
  Recycle, 
  BookOpen, 
  ArrowRight, 
  CheckCircle,
  Sprout,
  CloudSun,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: Camera,
    title: 'Disease Detection',
    description: 'Upload crop photos and get instant AI-powered disease diagnosis with treatment recommendations.'
  },
  {
    icon: Recycle,
    title: 'Residue Advisor',
    description: 'Transform agricultural waste into valuable resources with smart reuse recommendations.'
  },
  {
    icon: BookOpen,
    title: 'Knowledge Center',
    description: 'Access seasonal farming advisories and best practices in multiple languages.'
  },
  {
    icon: Shield,
    title: 'Crop Protection',
    description: 'Get pesticide recommendations and prevention tips to protect your crops.'
  }
];

const benefits = [
  'AI-powered instant crop disease detection',
  'Personalized treatment recommendations',
  'Turn crop residue into income',
  'Multi-language support for regional farmers',
  'Track your farming history and analytics',
  'Seasonal advisory updates'
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 leaf-pattern opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sprout className="w-4 h-4" />
              AI-Powered Farming Solutions
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Smart Farming for a{' '}
              <span className="gradient-text">Sustainable Future</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              KrishiSmart AI helps farmers detect crop diseases, manage residue efficiently, 
              and make data-driven decisions for better yields and sustainable agriculture.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" className="gap-2 px-8">
                  Start Free Today
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  <Camera className="w-4 h-4" />
                  Try Disease Detection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Farm Smarter
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From disease detection to residue management, we've got you covered
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-card card-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Farmers Love KrishiSmart AI
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of farmers who are already using AI to improve their farming practices 
                and increase their yields while practicing sustainable agriculture.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/auth" className="inline-block mt-8">
                <Button size="lg" className="gap-2">
                  Get Started for Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-primary/5 rounded-3xl p-8 relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-full animate-float" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-success/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
                
                <div className="bg-card rounded-2xl shadow-card-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Disease Detected</p>
                      <p className="text-sm text-muted-foreground">Late Blight on Tomato</p>
                    </div>
                    <span className="ml-auto text-sm font-medium text-primary">87%</span>
                  </div>
                  
                  <div className="h-px bg-border" />
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <Recycle className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Income Generated</p>
                      <p className="text-sm text-muted-foreground">From Rice Straw Residue</p>
                    </div>
                    <span className="ml-auto text-sm font-medium text-success">₹15,000</span>
                  </div>
                  
                  <div className="h-px bg-border" />
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CloudSun className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">New Advisory</p>
                      <p className="text-sm text-muted-foreground">Rabi Season Tips</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Leaf className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Join the smart farming revolution today. Free to start, no credit card required.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="gap-2 px-8">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} KrishiSmart AI. Built for Indian Farmers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

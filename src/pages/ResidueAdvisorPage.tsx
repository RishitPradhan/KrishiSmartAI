import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useCreateResidueRecommendation } from '@/hooks/useResidueRecommendations';
import { 
  Recycle, 
  Loader2, 
  Leaf, 
  DollarSign, 
  ListChecks,
  Sprout,
  Flame,
  Bug,
  Wheat
} from 'lucide-react';

const cropTypes = [
  'Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Maize', 'Soybean', 
  'Groundnut', 'Mustard', 'Potato', 'Tomato', 'Other'
];

const residueTypes = [
  'Straw', 'Stalks', 'Husks', 'Leaves', 'Roots', 'Shells', 'Other'
];

// Mock AI recommendation function - replace with actual AI service
async function getResidueRecommendation(
  cropType: string, 
  residueType: string, 
  quantity: number
): Promise<{
  suggested_methods: string[];
  estimated_income: number;
  step_by_step_guidance: Record<string, string[]>;
}> {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1500));

  const methods = [
    {
      name: 'Composting',
      icon: 'compost',
      steps: [
        'Collect and shred the residue into small pieces',
        'Mix with green materials in 3:1 ratio (brown:green)',
        'Add water to maintain 50-60% moisture',
        'Turn the pile every 2-3 weeks',
        'Compost will be ready in 2-3 months'
      ],
      income: quantity * 2.5
    },
    {
      name: 'Biofuel Production',
      icon: 'fuel',
      steps: [
        'Dry the residue to reduce moisture to 10-15%',
        'Store in a dry place away from rain',
        'Contact local biofuel collection centers',
        'Arrange for pickup or delivery',
        'Receive payment based on dry weight'
      ],
      income: quantity * 3.2
    },
    {
      name: 'Animal Feed',
      icon: 'feed',
      steps: [
        'Ensure residue is free from pesticide contamination',
        'Chop into small digestible pieces',
        'Mix with other feed components as needed',
        'Store in dry ventilated area',
        'Can be sold to local dairy farmers'
      ],
      income: quantity * 1.8
    },
    {
      name: 'Mushroom Farming',
      icon: 'mushroom',
      steps: [
        'Sterilize the straw/residue thoroughly',
        'Prepare spawn and inoculate the substrate',
        'Maintain humidity at 80-90%',
        'Keep temperature between 20-28°C',
        'Harvest mushrooms in 3-4 weeks'
      ],
      income: quantity * 15
    }
  ];

  return {
    suggested_methods: methods.map(m => m.name),
    estimated_income: methods.reduce((sum, m) => sum + m.income, 0) / methods.length,
    step_by_step_guidance: methods.reduce((acc, m) => {
      acc[m.name] = m.steps;
      return acc;
    }, {} as Record<string, string[]>)
  };
}

const methodIcons: Record<string, React.ReactNode> = {
  'Composting': <Leaf className="w-5 h-5" />,
  'Biofuel Production': <Flame className="w-5 h-5" />,
  'Animal Feed': <Bug className="w-5 h-5" />,
  'Mushroom Farming': <Sprout className="w-5 h-5" />,
};

export default function ResidueAdvisorPage() {
  const createRecommendation = useCreateResidueRecommendation();
  
  const [cropType, setCropType] = useState('');
  const [residueType, setResidueType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    suggested_methods: string[];
    estimated_income: number;
    step_by_step_guidance: Record<string, string[]>;
  } | null>(null);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cropType || !residueType || !quantity) {
      toast.error('Please fill in all fields');
      return;
    }

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    setLoading(true);
    
    try {
      const recommendation = await getResidueRecommendation(cropType, residueType, quantityNum);
      setResult(recommendation);
      
      // Save to database
      await createRecommendation.mutateAsync({
        crop_type: cropType,
        residue_type: residueType,
        quantity_kg: quantityNum,
        suggested_methods: recommendation.suggested_methods,
        estimated_income: recommendation.estimated_income,
        step_by_step_guidance: recommendation.step_by_step_guidance
      });

      toast.success('Recommendation generated!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate recommendation');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCropType('');
    setResidueType('');
    setQuantity('');
    setResult(null);
    setExpandedMethod(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Crop Residue Advisor
          </h1>
          <p className="text-muted-foreground mt-1">
            Turn agricultural waste into valuable resources
          </p>
        </div>

        {/* Input Form */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="w-5 h-5 text-primary" />
              Residue Details
            </CardTitle>
            <CardDescription>
              Enter your crop residue information to get personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crop-type">Crop Type</Label>
                  <Select value={cropType} onValueChange={setCropType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residue-type">Residue Type</Label>
                  <Select value={residueType} onValueChange={setResidueType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {residueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 500"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wheat className="w-4 h-4 mr-2" />
                      Get Recommendations
                    </>
                  )}
                </Button>
                {result && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Income Estimate */}
            <Card className="border-0 shadow-card bg-success/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-success" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      Estimated Income Potential
                    </h3>
                    <p className="text-2xl font-bold text-success">
                      ₹{result.estimated_income.toFixed(0)} - ₹{(result.estimated_income * 1.5).toFixed(0)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Based on {quantity}kg of {residueType.toLowerCase()} from {cropType}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reuse Methods */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListChecks className="w-5 h-5 text-primary" />
                  Suggested Reuse Methods
                </CardTitle>
                <CardDescription>
                  Click on a method to see step-by-step guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.suggested_methods.map((method) => (
                    <div key={method}>
                      <button
                        onClick={() => setExpandedMethod(expandedMethod === method ? null : method)}
                        className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                          expandedMethod === method 
                            ? 'bg-primary/10 ring-2 ring-primary' 
                            : 'bg-secondary/50 hover:bg-secondary'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            expandedMethod === method ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            {methodIcons[method] || <Recycle className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{method}</h4>
                            <p className="text-sm text-muted-foreground">
                              Click to view detailed steps
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Steps */}
                      {expandedMethod === method && result.step_by_step_guidance[method] && (
                        <div className="mt-2 ml-4 p-4 rounded-lg bg-card border border-border animate-fade-in">
                          <h5 className="font-medium text-foreground mb-3">Step-by-Step Guide</h5>
                          <ol className="space-y-2">
                            {result.step_by_step_guidance[method].map((step, index) => (
                              <li key={index} className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">
                                  {index + 1}
                                </span>
                                <span className="text-muted-foreground">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Ruler, 
  Sprout,
  Loader2,
  Save
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [primaryCrops, setPrimaryCrops] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form when profile loads
  useState(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setFarmSize(profile.farm_size || '');
      setPrimaryCrops(profile.primary_crops?.join(', ') || '');
    }
  });

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        full_name: fullName,
        phone,
        location,
        farm_size: farmSize,
        primary_crops: primaryCrops.split(',').map(c => c.trim()).filter(Boolean)
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-heading">
                    {profile?.full_name || 'Farmer'}
                  </CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
              <Button
                variant={isEditing ? "outline" : "default"}
                onClick={() => {
                  if (isEditing) {
                    // Reset form
                    setFullName(profile?.full_name || '');
                    setPhone(profile?.phone || '');
                    setLocation(profile?.location || '');
                    setFarmSize(profile?.farm_size || '');
                    setPrimaryCrops(profile?.primary_crops?.join(', ') || '');
                  }
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full-name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                ) : (
                  <p className="text-foreground py-2">
                    {profile?.full_name || 'Not set'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <p className="text-foreground py-2">{user?.email}</p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                ) : (
                  <p className="text-foreground py-2">
                    {profile?.phone || 'Not set'}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Location
                </Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Village, District, State"
                  />
                ) : (
                  <p className="text-foreground py-2">
                    {profile?.location || 'Not set'}
                  </p>
                )}
              </div>

              {/* Farm Size */}
              <div className="space-y-2">
                <Label htmlFor="farm-size" className="flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-muted-foreground" />
                  Farm Size
                </Label>
                {isEditing ? (
                  <Input
                    id="farm-size"
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    placeholder="e.g., 5 acres"
                  />
                ) : (
                  <p className="text-foreground py-2">
                    {profile?.farm_size || 'Not set'}
                  </p>
                )}
              </div>

              {/* Primary Crops */}
              <div className="space-y-2">
                <Label htmlFor="crops" className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-muted-foreground" />
                  Primary Crops
                </Label>
                {isEditing ? (
                  <Input
                    id="crops"
                    value={primaryCrops}
                    onChange={(e) => setPrimaryCrops(e.target.value)}
                    placeholder="Rice, Wheat, Cotton"
                  />
                ) : (
                  <p className="text-foreground py-2">
                    {profile?.primary_crops?.join(', ') || 'Not set'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <Button 
                onClick={handleSave} 
                disabled={updateProfile.isPending}
                className="w-full"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Language</span>
                <span className="text-foreground">
                  {profile?.language_preference === 'en' ? 'English' : profile?.language_preference || 'English'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Account Type</span>
                <span className="text-foreground">
                  {profile?.is_admin ? 'Administrator' : 'Farmer'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

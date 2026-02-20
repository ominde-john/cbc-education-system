import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SchoolLevel } from '@/types/enums';
import { Loader2, Building2, Users, GraduationCap } from 'lucide-react';

interface SchoolSetupWizardProps {
  onComplete?: () => void;
}

export default function SchoolSetupWizard({ onComplete }: SchoolSetupWizardProps) {
  const { user, login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [schoolData, setSchoolData] = useState({
    name: '',
    code: '',
    level: SchoolLevel.PRIMARY,
    county: '',
    subCounty: '',
    ward: '',
    address: '',
    phoneNumber: '',
    email: '',
    website: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setSchoolData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Create school record
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: schoolData.name,
          code: schoolData.code,
          level: schoolData.level,
          county: schoolData.county,
          sub_county: schoolData.subCounty,
          ward: schoolData.ward,
          address: schoolData.address,
          phone_number: schoolData.phoneNumber,
          email: schoolData.email,
          website: schoolData.website,
          is_active: true,
        })
        .select()
        .single();

      if (schoolError) {
        throw schoolError;
      }

      // Update user with school_id
      const { error: userError } = await supabase
        .from('users')
        .update({ school_id: school.id })
        .eq('id', user.id);

      if (userError) {
        // Rollback school creation if user update fails
        await supabase.from('schools').delete().eq('id', school.id);
        throw userError;
      }

      toast({
        title: 'School Setup Complete',
        description: `Welcome to ${schoolData.name}! Your school has been successfully configured.`,
      });

      // Refresh user data
      await login(user.email, 'temp_password'); // Note: This is a workaround since we don't have the actual password
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error setting up school:', error);
      toast({
        title: 'Setup Failed',
        description: 'Failed to set up your school. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name *</Label>
              <Input
                id="schoolName"
                value={schoolData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your school name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolCode">School Code</Label>
              <Input
                id="schoolCode"
                value={schoolData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                placeholder="e.g., ABC123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolLevel">School Level *</Label>
              <select
                id="schoolLevel"
                value={schoolData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={SchoolLevel.ECDE}>ECDE</option>
                <option value={SchoolLevel.PRIMARY}>Primary</option>
                <option value={SchoolLevel.JUNIOR_SECONDARY}>Junior Secondary</option>
                <option value={SchoolLevel.SENIOR_SECONDARY}>Senior Secondary</option>
              </select>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schoolEmail">School Email *</Label>
              <Input
                id="schoolEmail"
                type="email"
                value={schoolData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="school@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schoolPhone">School Phone Number *</Label>
              <Input
                id="schoolPhone"
                type="tel"
                value={schoolData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="+254 7XX XXX XXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={schoolData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://school.com"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="county">County *</Label>
              <Input
                id="county"
                value={schoolData.county}
                onChange={(e) => handleInputChange('county', e.target.value)}
                placeholder="Enter county"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subCounty">Sub-County *</Label>
              <Input
                id="subCounty"
                value={schoolData.subCounty}
                onChange={(e) => handleInputChange('subCounty', e.target.value)}
                placeholder="Enter sub-county"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ward">Ward</Label>
              <Input
                id="ward"
                value={schoolData.ward}
                onChange={(e) => handleInputChange('ward', e.target.value)}
                placeholder="Enter ward"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Physical Address *</Label>
              <Textarea
                id="address"
                value={schoolData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter school address"
                required
              />
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Setup Summary</h4>
              <p className="text-sm text-blue-700">
                Once you complete this setup, you'll be able to:
              </p>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• Add teachers and learners</li>
                <li>• Manage school data</li>
                <li>• Generate reports</li>
                <li>• Access all school features</li>
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">School Setup</CardTitle>
            <CardDescription>Configure your school to get started</CardDescription>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div className={`h-2 rounded-full ${s <= step ? 'bg-blue-500' : 'bg-gray-200'}`} />
              <p className="text-xs text-gray-500 mt-1 text-center">
                {s === 1 && 'Basic Info'}
                {s === 2 && 'Contact Info'}
                {s === 3 && 'Location'}
              </p>
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {renderStep()}
        
        <div className="flex justify-between mt-6 space-x-3">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step === 3 ? (
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !schoolData.name || !schoolData.email || !schoolData.phoneNumber || !schoolData.address || !schoolData.county || !schoolData.subCounty}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={step === 3 || !schoolData.name || !schoolData.email || !schoolData.phoneNumber || !schoolData.address || !schoolData.county || !schoolData.subCounty}
            >
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

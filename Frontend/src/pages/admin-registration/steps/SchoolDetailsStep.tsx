import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SchoolRegistrationStep2 } from '@/types/school';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  initialData: SchoolRegistrationStep2;
  onSubmit: (data: SchoolRegistrationStep2) => void;
  onBack: () => void;
}

export default function SchoolDetailsStep({ initialData, onSubmit, onBack }: Props) {
  const [formData, setFormData] = useState<SchoolRegistrationStep2>(initialData);

  const handleChange = (field: keyof SchoolRegistrationStep2, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid =
    formData.county &&
    formData.subCounty &&
    formData.ward &&
    formData.physicalAddress &&
    formData.postalAddress &&
    formData.phoneNumber &&
    formData.email;

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { duration: 0.35, delay },
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Section: Location */}
      <motion.div {...fadeUp(0.02)}>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent" />
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Location</span>
          <div className="h-px flex-1 bg-gradient-to-l from-emerald-200 to-transparent" />
        </div>
      </motion.div>

      {/* County + Sub-County */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div className="space-y-1.5" {...fadeUp(0.05)}>
          <Label htmlFor="county" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            County <span className="text-red-500">*</span>
          </Label>
          <Input
            id="county"
            value={formData.county}
            onChange={(e) => handleChange('county', e.target.value)}
            placeholder="e.g., Nairobi"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>

        <motion.div className="space-y-1.5" {...fadeUp(0.1)}>
          <Label htmlFor="subCounty" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Sub-County <span className="text-red-500">*</span>
          </Label>
          <Input
            id="subCounty"
            value={formData.subCounty}
            onChange={(e) => handleChange('subCounty', e.target.value)}
            placeholder="e.g., Westlands"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>
      </div>

      {/* Ward + Physical Address */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div className="space-y-1.5" {...fadeUp(0.15)}>
          <Label htmlFor="ward" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Ward <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ward"
            value={formData.ward}
            onChange={(e) => handleChange('ward', e.target.value)}
            placeholder="e.g., Parklands"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>

        <motion.div className="space-y-1.5" {...fadeUp(0.2)}>
          <Label htmlFor="physicalAddress" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Physical Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="physicalAddress"
            value={formData.physicalAddress}
            onChange={(e) => handleChange('physicalAddress', e.target.value)}
            placeholder="e.g., Waiyaki Way"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>
      </div>

      {/* Postal Address */}
      <motion.div className="space-y-1.5" {...fadeUp(0.25)}>
        <Label htmlFor="postalAddress" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
          Postal Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="postalAddress"
          value={formData.postalAddress}
          onChange={(e) => handleChange('postalAddress', e.target.value)}
          placeholder="e.g., P.O. Box 123-00100, Nairobi"
          className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-300"
          required
        />
      </motion.div>

      {/* Section: Contact */}
      <motion.div {...fadeUp(0.28)}>
        <div className="flex items-center gap-2 mb-4 mt-2">
          <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent" />
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Contact</span>
          <div className="h-px flex-1 bg-gradient-to-l from-emerald-200 to-transparent" />
        </div>
      </motion.div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div className="space-y-1.5" {...fadeUp(0.3)}>
          <Label htmlFor="phoneNumber" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="e.g., +254 712 345 678"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>

        <motion.div className="space-y-1.5" {...fadeUp(0.35)}>
          <Label htmlFor="email" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Official Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g., info@school.ac.ke"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>
      </div>

      {/* Website */}
      <motion.div className="space-y-1.5" {...fadeUp(0.4)}>
        <Label htmlFor="website" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
          Website <span className="text-gray-300 text-[10px] normal-case tracking-normal">(Optional)</span>
        </Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          placeholder="e.g., https://www.school.ac.ke"
          className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-gray-300"
        />
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex items-center justify-between pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.45 }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 h-12 px-5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={!isValid}
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-8 rounded-xl text-base font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-200 disabled:opacity-40 disabled:shadow-none"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </form>
  );
}

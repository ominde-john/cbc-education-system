import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SchoolRegistrationStep3, AdministratorRole } from '@/types/school';
import { ArrowLeft, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface Props {
  initialData: SchoolRegistrationStep3;
  onSubmit: (data: SchoolRegistrationStep3) => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function AdminDetailsStep({ initialData, onSubmit, onBack, isLoading }: Props) {
  const [formData, setFormData] = useState<SchoolRegistrationStep3>(initialData);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = <K extends keyof SchoolRegistrationStep3>(
    field: K,
    value: SchoolRegistrationStep3[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid =
    formData.fullName &&
    formData.tscNo &&
    formData.role &&
    formData.phoneNumber &&
    formData.email &&
    formData.username &&
    formData.password;

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 16 } as const,
    animate: { opacity: 1, y: 0 } as const,
    transition: { duration: 0.35, delay },
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Info banner */}
      <motion.div
        className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-800 font-medium leading-relaxed">
          This user will become the <strong>Super Admin</strong> for the school with full access to manage the school account.
        </p>
      </motion.div>

      {/* Section: Personal */}
      <motion.div {...fadeUp(0.05)}>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent" />
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Personal Details</span>
          <div className="h-px flex-1 bg-gradient-to-l from-amber-200 to-transparent" />
        </div>
      </motion.div>

      {/* Full Name */}
      <motion.div className="space-y-1.5" {...fadeUp(0.08)}>
        <Label htmlFor="fullName" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Enter full name"
          className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-gray-300"
          required
        />
      </motion.div>

      {/* TSC No + Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div className="space-y-1.5" {...fadeUp(0.12)}>
          <Label htmlFor="tscNo" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            TSC No. <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tscNo"
            value={formData.tscNo}
            onChange={(e) => handleChange('tscNo', e.target.value)}
            placeholder="e.g., TSC/12345"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>

        <motion.div className="space-y-1.5" {...fadeUp(0.16)}>
          <Label htmlFor="role" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Role <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.role || ''}
            onValueChange={(value) => handleChange('role', value as AdministratorRole)}
          >
            <SelectTrigger id="role" className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AdministratorRole.HEADTEACHER}>Headteacher</SelectItem>
              <SelectItem value={AdministratorRole.PRINCIPAL}>Principal</SelectItem>
              <SelectItem value={AdministratorRole.DIRECTOR}>Director</SelectItem>
              <SelectItem value={AdministratorRole.ADMINISTRATOR}>Administrator</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* Phone + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div className="space-y-1.5" {...fadeUp(0.2)}>
          <Label htmlFor="phoneNumber" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            placeholder="e.g., +254 712 345 678"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>

        <motion.div className="space-y-1.5" {...fadeUp(0.24)}>
          <Label htmlFor="email" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g., admin@school.ac.ke"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>
      </div>

      {/* National ID */}
      <motion.div className="space-y-1.5" {...fadeUp(0.28)}>
        <Label htmlFor="nationalIdOrPassport" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
          National ID / Passport <span className="text-gray-300 text-[10px] normal-case tracking-normal">(Optional)</span>
        </Label>
        <Input
          id="nationalIdOrPassport"
          value={formData.nationalIdOrPassport}
          onChange={(e) => handleChange('nationalIdOrPassport', e.target.value)}
          placeholder="e.g., 12345678"
          className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-gray-300"
        />
      </motion.div>

      {/* Section: Credentials */}
      <motion.div {...fadeUp(0.32)}>
        <div className="flex items-center gap-2 mb-4 mt-2">
          <div className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent" />
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Credentials</span>
          <div className="h-px flex-1 bg-gradient-to-l from-amber-200 to-transparent" />
        </div>
      </motion.div>

      {/* Username + Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div className="space-y-1.5" {...fadeUp(0.36)}>
          <Label htmlFor="username" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Username <span className="text-red-500">*</span>
          </Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="Choose a username"
            className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-gray-300"
            required
          />
        </motion.div>

        <motion.div className="space-y-1.5" {...fadeUp(0.4)}>
          <Label htmlFor="password" className="text-[13px] font-semibold text-gray-800 tracking-wide uppercase">
            Password <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Create a strong password"
              className="h-12 text-base bg-gray-50 border-gray-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all pr-12 placeholder:text-gray-300"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            Min 8 chars: uppercase, lowercase, number & special char
          </p>
        </motion.div>
      </div>

      {/* 2FA */}
      <motion.div
        className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 hover:bg-white hover:border-amber-200 transition-all cursor-pointer"
        {...fadeUp(0.44)}
        onClick={() => handleChange('twoFactorAuth', !formData.twoFactorAuth)}
      >
        <Checkbox
          id="twoFactorAuth"
          checked={formData.twoFactorAuth}
          onCheckedChange={(checked) => handleChange('twoFactorAuth', checked === true)}
          className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
        />
        <Label htmlFor="twoFactorAuth" className="text-sm font-medium cursor-pointer flex-1 text-gray-700">
          Enable Two-Factor Authentication
          <span className="text-gray-400 font-normal ml-1">(Recommended)</span>
        </Label>
      </motion.div>

      {/* Actions */}
      <motion.div
        className="flex items-center justify-between pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.48 }}
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 h-12 px-5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 rounded-xl text-base font-semibold shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all duration-200 disabled:opacity-40 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registering...
            </>
          ) : (
            'Complete Registration'
          )}
        </Button>
      </motion.div>
    </form>
  );
}

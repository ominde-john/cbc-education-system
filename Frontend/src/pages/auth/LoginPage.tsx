import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2, ArrowLeft, Building2, Shield, GraduationCap, Users } from 'lucide-react';

type LoginUserType = 'admin' | 'super_admin' | 'teacher' | 'parent';

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [userType, setUserType] = useState<LoginUserType>('admin');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      await login(formData.email, formData.password);
      
      toast({
        title: 'Welcome Back',
        description: `Successfully signed in.`,
      });

      switch (userType) {
        case 'super_admin':
        case 'admin':
          navigate('/school-admin/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/portal');
          break;
        case 'parent':
          navigate('/parent/portal');
          break;
        default:
          navigate('/school-admin/dashboard');
      }
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(
        error,
        'Invalid email or password. Please try again.'
      );
      setSubmitError(errorMsg);
      toast({
        title: 'Sign In Failed',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  const roles = [
    { type: 'admin' as const, label: 'Administrator', icon: Building2 },
    { type: 'super_admin' as const, label: 'Super Admin', icon: Shield },
    { type: 'teacher' as const, label: 'Teacher', icon: GraduationCap },
    { type: 'parent' as const, label: 'Parent', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex flex-col relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

   
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-20">
        {/* Card Container */}
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
          
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[550px]">
            
            {/* LEFT SIDE - Roles Selection */}
            <div className="border-r border-gray-200 p-8 bg-gradient-to-b from-white to-blue-50/30 flex flex-col">
                    <div className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </div> 
              {/* Logo and Title */}
              <div className="mb-10 animate-slide-in-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  CBC
                </h1>
                <p className="text-gray-600 text-sm font-medium">
                  Education System
                </p>
              </div>

              {/* Role Selection */}
              <div className="space-y-4 flex-1">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-6">
                  Select Your Role
                </p>
                
                <div className="space-y-3">
                  {roles.map((role, index) => {
                    const Icon = role.icon;
                    const isSelected = userType === role.type;
                    return (
                      <button
                        key={role.type}
                        type="button"
                        onClick={() => setUserType(role.type)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 animate-fade-in-down`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-110'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-left flex-1">
                          <p className={`text-sm font-medium transition-colors duration-300 ${
                            isSelected ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {role.label}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Info */}
              <div className="mt-12 pt-8 border-t border-gray-200 animate-fade-in-up">
                <p className="text-xs text-gray-500 text-center">
                  © 2026 CBC Education System
                </p>
              </div>
            </div>

            {/* RIGHT SIDE - Login Form */}
            <div className="p-8 flex flex-col justify-between bg-gray-50/50 relative animate-slide-in-right">
              
              {/* Header */}
              <div className="space-y-1 mb-8 animate-fade-in">
                <h2 className="text-3xl font-bold text-gray-900">
                  Sign in
                </h2>
                <p className="text-sm text-gray-600">
                  to access your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 flex-1 animate-fade-in-up">
                
                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm text-red-700 animate-shake">
                    {submitError}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-400 transition-all duration-300 bg-white hover:border-gray-400"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 placeholder-gray-400 transition-all duration-300 bg-white hover:border-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center pt-1">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer accent-blue-600 transition-all duration-300"
                  />
                  <label htmlFor="remember" className="ml-2.5 text-sm text-gray-700 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mt-8 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              {/* Forgot Password Link */}
              <div className="text-center pt-4 animate-fade-in-up">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.7s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out 0.2s both;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        /* Smooth transitions */
        input, button, select {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
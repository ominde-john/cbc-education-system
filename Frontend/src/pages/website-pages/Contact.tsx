import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Mail, Building2, ChevronDown, CreditCard,
  Clock, Users, GraduationCap, HeadphonesIcon, MessageSquare, Shield,
  ArrowRight, Send, CheckCircle2, Sparkles, Globe, Zap, Star
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/* Animation Variants */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* Data */
const contactInfo = [
  {
    icon: Phone,
    label: "Phone Support",
    value: "+254 111 276 271",
    subtext: "Mon–Fri, 8AM–6PM EAT",
    href: "tel:+254111276271",
    color: 'blue',
  },
  {
    icon: Mail,
    label: "Email Support",
    value: "contact@noneaa.com",
    subtext: "We respond within 24 hours",
    href: "mailto:contact@noneaa.com",
    color: 'emerald',
  },
  {
    icon: MapPin,
    label: "Headquarters",
    value: "Westlands, Nairobi",
    subtext: "Kenya",
    href: "#",
    color: 'purple',
  },
  {
    icon: Building2,
    label: "Regional Offices",
    value: "Mombasa, Kisumu, Nakuru",
    subtext: "3 locations across Kenya",
    href: "#",
    color: 'amber',
  }
];

const supportOptions = [
  {
    icon: GraduationCap,
    title: "Schools & Institutions",
    description: "Looking to implement CBE in your school? We'll walk you through onboarding, training, and setup.",
    color: 'blue',
  },
  {
    icon: HeadphonesIcon,
    title: "Technical Support",
    description: "Experiencing issues with the platform? Our technical team can help troubleshoot and resolve problems quickly.",
    color: 'rose',
  },
  {
    icon: Users,
    title: "Partnership Inquiries",
    description: "Interested in collaborating? We work with NGOs, government bodies, and education partners across East Africa.",
    color: 'emerald',
  },
  {
    icon: MessageSquare,
    title: "General Inquiries",
    description: "Have questions about our pricing, features, or how NONEAA works? We're happy to help.",
    color: 'purple',
  }
];

const faqs = [
  {
    question: "How does NONEAA help with CBE assessment?",
    answer: "NONEAA provides comprehensive CBE assessment tools that track learner competencies across all 7 CBC areas, generate detailed reports, and help teachers identify where students need additional support. Our platform aligns fully with Kenya's KICD curriculum framework."
  },
  // ... (add the rest of your faqs)
];

const paymentMethods = [
  { name: "M-Pesa", color: "from-green-500 to-green-600" },
  { name: "Visa", color: "from-blue-500 to-blue-600" },
  { name: "Mastercard", color: "from-red-500 to-orange-500" },
  { name: "PayPal", color: "from-indigo-500 to-indigo-600" },
  { name: "Bank Transfer", color: "from-slate-500 to-slate-600" }
];

const colorMap: Record<string, { bg: string; iconBg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
  purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
  amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
  rose: { bg: 'bg-rose-50', iconBg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' },
};

type ContactErrors = {
  fullName?: string;
  email?: string;
  message?: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    school: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: string; message: string } | null>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [expandedFaq, setExpandedFaq] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const field = name as keyof ContactErrors;
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = (): ContactErrors => {
    const newErrors: ContactErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!formData.email.trim() || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch('https://ywcrsgaxftooovqipkdr.supabase.co/functions/v1/message-received-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          institution: formData.school,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({
          type: 'success',
          message: "Thank you! Your message has been received. We'll get back to you within 24 hours."
        });
        setFormData({ fullName: '', email: '', phone: '', school: '', subject: '', message: '' });
        setErrors({});
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error(error);
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or contact us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8edf5]">
      <Header />
      {/* Paste all your original sections here (Hero, Form, Support, FAQ, Payment, CTA) */}
      <Footer />
    </div>
  );
}

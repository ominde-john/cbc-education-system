import React, { useState } from 'react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  school: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    school: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });
    
    try {
      // 1. Hardcoded target Edge Function endpoint route URL
      const functionUrl = 'https://ywcrsgaxftooovqipkdr.supabase.co/functions/v1/contact';
      
      // 2. Your provided secure public anon validation key string
      const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3Y3JzZ2F4ZnRvb292cWlwa2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExODc5MjAsImV4cCI6MjA4Njc2MzkyMH0.kpA6-eGL_6Sxn13fm2p1GqJP4aoaZfhBE-binFkRfQk";

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ✅ SECURE CONNECTION PASS: Handshake clearance for the API gateway
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          school: formData.school,
          subject: formData.subject,
          message: formData.message
        }),
      });

      // Catch edge failures like 404 or server-thrown exceptions
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'The server rejected the message package context.');
      }

      // Success Path! Reset fields and update notification Banner
      setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        school: '',
        subject: '',
        message: '',
      });

    } catch (err: any) {
      console.error("Submission Failure Logged:", err);
      setStatus({ 
        type: 'error', 
        message: 'Something went wrong. Please try again.' 
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Us</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Full Name *</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Email Address *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@school.edu"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="+254..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Institution / School</label>
          <input
            type="text"
            name="school"
            value={formData.school}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="University Name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Subject</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="General Inquiry"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Message *</label>
          <textarea
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write your message details here..."
          />
        </div>

        <button
          type="submit"
          disabled={status.type === 'loading'}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {status.type === 'loading' ? 'Sending...' : 'Send Message →'}
        </button>

        {/* UI Status Banner Area Notification Context */}
        {status.type === 'success' && (
          <div className="mt-4 p-4 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
            {status.message}
          </div>
        )}

        {status.type === 'error' && (
          <div className="mt-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>{status.message}</span>
          </div>
        )}
      </form>
    </div>
  );
}

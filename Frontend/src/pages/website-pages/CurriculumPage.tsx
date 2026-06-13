import { motion } from 'framer-motion';
import {
  BookOpen, Target, BarChart3, Users, Layers, FileText,
  CheckCircle2, ArrowRight, GraduationCap, Lightbulb
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const curriculumAreas = [
  {
    title: 'Language Activities',
    grades: 'Pre-Primary 1 & 2',
    strands: ['Listening & Speaking', 'Reading', 'Writing', 'Book & Print Awareness'],
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Mathematics',
    grades: 'Grade 1–6',
    strands: ['Numbers', 'Measurement', 'Geometry', 'Data Handling & Probability'],
    color: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    title: 'Integrated Science',
    grades: 'Grade 4–6',
    strands: ['Living Things & Environment', 'Materials & Energy', 'Earth & Space', 'Health & Safety'],
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Social Studies',
    grades: 'Grade 4–6',
    strands: ['Citizenship', 'People & Population', 'Culture & Society', 'Resources & Economic Activities'],
    color: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    title: 'Creative Arts & Sports',
    grades: 'Grade 1–6',
    strands: ['Performing Arts', 'Visual Arts', 'Physical Education', 'Swimming'],
    color: 'bg-rose-50 border-rose-200',
    iconBg: 'bg-rose-100 text-rose-600',
  },
  {
    title: 'Religious Education',
    grades: 'Grade 1–6',
    strands: ['Christian / Islamic / Hindu Education', 'Moral Values', 'Community Service', 'Spiritual Growth'],
    color: 'bg-cyan-50 border-cyan-200',
    iconBg: 'bg-cyan-100 text-cyan-600',
  },
];

const managementFeatures = [
  {
    icon: Layers,
    title: 'Strand & Sub-Strand Tracking',
    description: 'Organize learning areas by strands and sub-strands as defined by KICD. Track progress at every level of the curriculum hierarchy.',
  },
  {
    icon: Target,
    title: 'Competency Level Assessment',
    description: 'Record learner competencies using the 4-level scale: Exceeding Expectations, Meeting Expectations, Approaching Expectations, and Below Expectations.',
  },
  {
    icon: BarChart3,
    title: 'Progress Reports',
    description: 'Generate term-end reports that show each learner\'s competency levels across all learning areas, strands, and indicators.',
  },
  {
    icon: FileText,
    title: 'Rubric Customisation',
    description: 'Use KICD-aligned rubrics or create custom assessment criteria for formative and summative assessments.',
  },
  {
    icon: Users,
    title: 'Teacher Allocation',
    description: 'Assign teachers to specific learning areas and grade levels. Teachers only see the subjects and classes allocated to them.',
  },
  {
    icon: Lightbulb,
    title: 'Learning Outcomes Mapping',
    description: 'Map each assessment to specific learning outcomes and indicators so you always know what competencies are being measured.',
  },
];

const gradeLevels = [
  { level: 'Pre-Primary', grades: 'PP1 & PP2', age: '4–5 years', areas: 5 },
  { level: 'Lower Primary', grades: 'Grade 1–3', age: '6–8 years', areas: 6 },
  { level: 'Upper Primary', grades: 'Grade 4–6', age: '9–11 years', areas: 8 },
  { level: 'Junior Secondary', grades: 'Grade 7–9', age: '12–14 years', areas: 12 },
  { level: 'Senior Secondary', grades: 'Grade 10–12', age: '15–17 years', areas: 'Pathways' },
];

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-block text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
              Curriculum Management
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-5">
              Manage Kenya's CBC Curriculum with Confidence
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Noneaa gives schools a complete system to organise, track, and assess the Competency-Based Curriculum. From Pre-Primary to Senior Secondary — manage every learning area, strand, and competency indicator in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grade Level Structure */}
      <section className="py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              CBC Grade Level Structure
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">
              The 2-6-3-3-3 system organises learners from Pre-Primary through Senior Secondary, each with defined learning areas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {gradeLevels.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="text-center p-5 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mx-auto mb-3">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{item.level}</h3>
                <p className="text-xs text-slate-500 mb-2">{item.grades} • {item.age}</p>
                <p className="text-xs font-medium text-blue-600">
                  {typeof item.areas === 'number' ? `${item.areas} Learning Areas` : item.areas}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Areas */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Learning Areas & Strands
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">
              Each learning area is broken into strands and sub-strands. Noneaa tracks competency at every level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {curriculumAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`rounded-xl border p-5 ${area.color}`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${area.iconBg}`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{area.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{area.grades}</p>
                <div className="space-y-1.5">
                  {area.strands.map((strand) => (
                    <div key={strand} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      {strand}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Management Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              What You Can Do with Noneaa
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">
              Practical tools for teachers and administrators to manage the CBC curriculum day-to-day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Start Managing Your Curriculum Today
          </h2>
          <p className="text-slate-300 mb-8 text-sm leading-relaxed">
            Whether you're a single school or a school group, Noneaa scales to your needs. Set up learning areas, assign teachers, and begin tracking competencies in under an hour.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/get-started"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Talk to Our Team
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

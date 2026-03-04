import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  GraduationCap, 
  ArrowLeft,
  Languages,
  Calculator,
  Leaf,
  Utensils,
  Church,
  Palette,
  Activity
} from 'lucide-react';

export default function Grade1() {
  const navigate = useNavigate();

  const learningAreas = [
    {
      id: 'english',
      title: 'English Activities',
      description: 'Learn reading, writing, and speaking skills',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      id: 'kiswahili',
      title: 'Kiswahili Activities',
      description: 'Soma, andika na ongea Kiswahili',
      icon: Languages,
      color: 'from-emerald-500 to-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      id: 'mathematical',
      title: 'Mathematical Activities',
      description: 'Numbers, counting, and basic math',
      icon: Calculator,
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-200',
    },
    {
      id: 'environmental',
      title: 'Environmental Activities',
      description: 'Explore nature and our environment',
      icon: Leaf,
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-200',
    },
    {
      id: 'hygiene',
      title: 'Hygiene and Nutrition',
      description: 'Learn about healthy living and eating',
      icon: Utensils,
      color: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      id: 'religious',
      title: 'Religious Education Activities',
      description: 'Spiritual and moral development',
      icon: Church,
      color: 'from-indigo-500 to-indigo-600',
      borderColor: 'border-indigo-200',
    },
    {
      id: 'creative',
      title: 'Creative Arts',
      description: 'Express yourself through art and music',
      icon: Palette,
      color: 'from-pink-500 to-pink-600',
      borderColor: 'border-pink-200',
    },
    {
      id: 'phe',
      title: 'Physical and Health Education (PHE)',
      description: 'Stay active and healthy with sports',
      icon: Activity,
      color: 'from-cyan-500 to-cyan-600',
      borderColor: 'border-cyan-200',
    },
  ];

  const handleLearningAreaClick = (areaId: string) => {
    // Navigate to specific learning area (to be implemented later)
    // Future implementation: navigate(`/student/grade/1/${areaId}`);
    console.log(`Clicked on ${areaId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/student/learning-materials')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Grades
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">CBE Education</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Page Title */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              <BookOpen className="h-4 w-4" />
              Grade 1 Learning Areas
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              Grade 1 Learning Materials
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select a learning area to explore activities, resources, and lessons
            </p>
          </div>

          {/* Learning Areas Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {learningAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                >
                  <Card
                    className={`group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${area.borderColor} hover:border-primary overflow-hidden h-full`}
                    onClick={() => handleLearningAreaClick(area.id)}
                  >
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className={`mb-4 mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${area.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{area.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {area.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  About Grade 1 Learning
                </CardTitle>
                <CardDescription>
                  Comprehensive learning areas aligned with the CBE curriculum for Grade 1
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Select Learning Area</h4>
                      <p className="text-xs text-muted-foreground">
                        Choose from 8 learning areas designed for Grade 1
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-600 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Explore Activities</h4>
                      <p className="text-xs text-muted-foreground">
                        Engage with interactive and age-appropriate content
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-cyan-600 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Learn & Grow</h4>
                      <p className="text-xs text-muted-foreground">
                        Build foundational skills for future learning
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

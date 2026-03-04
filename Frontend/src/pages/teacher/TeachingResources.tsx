import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, GraduationCap, ArrowLeft, FileText, Video, Presentation } from 'lucide-react';

export default function TeachingResources() {
  const navigate = useNavigate();

  // Generate grade buttons for Grade 1 to Grade 10
  const grades = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleGradeClick = (grade: number) => {
    // Navigate to the specific grade resources (to be implemented later)
    // Future implementation: navigate(`/teacher/grade/${grade}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
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
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
            >
              <BookOpen className="h-4 w-4" />
              Teacher Resources Portal
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
              Teaching Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access comprehensive teaching materials, lesson plans, and resources for grades 1-10
            </p>
          </div>

          {/* Grade Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {grades.map((grade, index) => (
              <motion.div
                key={grade}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <Card
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary overflow-hidden"
                  onClick={() => handleGradeClick(grade)}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="mb-3 mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-2xl font-bold text-white">{grade}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">Grade {grade}</h3>
                      <p className="text-sm text-muted-foreground">
                        Teaching Resources
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                  About Teaching Resources
                </CardTitle>
                <CardDescription>
                  Access comprehensive teaching resources aligned with the CBE curriculum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Lesson Plans</h4>
                      <p className="text-xs text-muted-foreground">
                        Detailed lesson plans and teaching guides for each grade level
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <Video className="h-4 w-4 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Multimedia Content</h4>
                      <p className="text-xs text-muted-foreground">
                        Videos, presentations, and interactive teaching materials
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <Presentation className="h-4 w-4 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Assessment Tools</h4>
                      <p className="text-xs text-muted-foreground">
                        Rubrics, worksheets, and assessment materials for CBE
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

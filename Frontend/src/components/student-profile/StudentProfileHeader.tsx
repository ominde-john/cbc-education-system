import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Edit2, Download, Share2 } from 'lucide-react';

interface StudentHeaderProps {
  student: {
    id: string;
    name: string;
    email: string;
    phone: string;
    grade: string;
    class: string;
    image: string;
    school: string;
    dateOfBirth: string;
    status: 'active' | 'inactive' | 'graduated';
  };
  onEdit?: () => void;
}

const StudentProfileHeader: React.FC<StudentHeaderProps> = ({ student, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200';
      case 'inactive':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200';
      case 'graduated':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-md dark:shadow-lg">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge className={`absolute bottom-2 right-2 capitalize ${getStatusColor(student.status)}`}>
                  {student.status}
                </Badge>
              </div>
            </div>

            {/* Student Information */}
            <div className="flex-1 flex flex-col justify-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {student.name}
                </h1>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {student.grade}
                  </Badge>
                  <Badge variant="secondary" className="text-sm">
                    Class {student.class}
                  </Badge>
                </div>
              </div>

              {/* Contact & Location Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm">{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm">{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{student.school}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-sm font-medium">ID:</span>
                  <span className="text-sm font-mono">{student.id}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 justify-center">
              <Button
                onClick={onEdit}
                variant="default"
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentProfileHeader;

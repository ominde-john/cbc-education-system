// CBE Curriculum Data Types
export interface CurriculumCompetency {
  id: string;
  code: string;
  description: string;
  level: string;
}

export interface CurriculumSubStrand {
  id: string;
  name: string;
  competencies: CurriculumCompetency[];
}

export interface CurriculumStrand {
  id: string;
  name: string;
  subStrands: CurriculumSubStrand[];
}

export interface CurriculumLearningArea {
  id: string;
  name: string;
  description: string;
  strands: CurriculumStrand[];
}

// Sample curriculum data structure
export const curriculumData: CurriculumLearningArea[] = [
  {
    id: 'la-1',
    name: 'English Language',
    description: 'Development of communication skills in English',
    strands: [
      {
        id: 'strand-1',
        name: 'Listening and Speaking',
        subStrands: [
          {
            id: 'substrand-1',
            name: 'Listening',
            competencies: [
              {
                id: 'comp-1',
                code: 'ENG-LS-1',
                description: 'Listen attentively to oral instructions and stories',
                level: 'Grade 1'
              }
            ]
          }
        ]
      }
    ]
  }
];

// Helper functions
export function getTotalStrands(): number {
  return curriculumData.reduce((total, area) => total + area.strands.length, 0);
}

export function getTotalCompetencies(): number {
  let total = 0;
  curriculumData.forEach(area => {
    area.strands.forEach(strand => {
      strand.subStrands.forEach(subStrand => {
        total += subStrand.competencies.length;
      });
    });
  });
  return total;
}

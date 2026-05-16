export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image?: string;
  linkedin?: string;
  email?: string;
  github?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Ominde",
    role: "CEO & Founder",
    linkedin: "https://linkedin.com/in/johnominde",
    email: "johnzjohn.com",
    image:"https://www.teksoft.co.ke/assets/john-ominde-CkKgcyW1.jpg"
  },
  {
    id: 2,
    name: "Jeremy Bravoge",
    role: "Director of Technology",
    linkedin: "https://linkedin.com/in/jeremybravoge",
    github: "https://github.com/jeremybravoge",
    email: "jeremy@teksoft.co.com",
    image:"https://jeremy.teksoft.co.ke/lovable-uploads/Gemini_Generated_Image_nnkeoannkeoannke.png"
  },
 
     {
    id:4,
    name: "LIVINGSTONE ODUOR",
    role: "Full stack software engineer",
    linkedin: "https://linkedin.com/victoriawamboi",
    github: "https://github.com/victoriawamboi",
    email: "wamboi11@gmail.com",
    image:"/public/WhatsApp Image 2026-02-09 at 12.29.32 AM.jpeg"
  },
    {
    id: 3,
    name: "Victoria Wamboi",
    role: "Digital Marketing Lead",
    image:"/victoria.png",
    linkedin: "https://linkedin.com/bossy",
    github: "https://github.com/bossy",
    email: "bossy@gmail.com"
  },
  
];

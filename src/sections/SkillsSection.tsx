import React from 'react';
import { Code, LayoutGrid, Cog, GitBranch } from 'lucide-react';

const skills = [
  {
    category: 'Frontend Development',
    icon: <Code size={24} />,
    skills: ['React.js', 'React Native', 'JavaScript (ES6+)', 'TypeScript', 'CSS3']
  },
  {
    category: 'Build Tools & Package Managers',
    icon: <Cog size={24} />,
    skills: ['Webpack', 'Vite', 'Babel', 'NPM', 'Yarn']
  },
  {
    category: 'Testing & Automation',
    icon: <LayoutGrid size={24} />,
    skills: ['Jest', 'React Testing Library', 'Cypress', 'Maestro']
  },
  {
    category: 'Other Expertise',
    icon: <GitBranch size={24} />,
    skills: ['Performance Optimization', 'Responsive Design', 'Cross-Browser Compatibility', 'Git']
  }
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            My <span className="text-blue-600">Skills</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            I've developed expertise in various technologies and methodologies throughout my career,
            focusing on delivering high-quality, user-centric solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600 mb-4">
                {skillGroup.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {skillGroup.category}
              </h3>
              
              <ul className="space-y-2">
                {skillGroup.skills.map((skill, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
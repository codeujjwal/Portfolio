import { GraduationCap } from "lucide-react";

const educations = [
  {
    degree: "Master of Science (MS)",
    specialization: "Computer Science",
    description:
      "Advanced studies focusing on software architecture, design patterns, system scalability, and project management methodologies.",
  },
  {
    degree: "Bachelor of Technology (B.Tech)",
    specialization: "Computer Science Engineering",
    description:
      "A comprehensive program covering fundamental and advanced concepts in computer science, software development, algorithms, and systems design.",
  },
];

const EducationSection = () => {
  return (
    <section
      id="education"
      className="py-20 bg-gray-800"
      style={{
        backgroundColor: "transparent",
        borderTop: "1px solid rgb(55 65 81)",
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <span className="text-blue-400">Education</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            My academic background has provided a strong foundation for my
            professional career.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid gap-8">
            {educations.map((edu, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700 shadow-glow transition-all duration-300 hover:border-blue-400/50 flex flex-col md:flex-row gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-blue-400/20 flex items-center justify-center text-blue-400">
                    <GraduationCap size={32} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {edu.degree}
                  </h3>

                  {edu.specialization && (
                    <p className="text-blue-400 font-medium mb-3">
                      with specialization in {edu.specialization}
                    </p>
                  )}

                  <p className="text-gray-300">{edu.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;

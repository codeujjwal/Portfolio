import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "XplorOut",
    description:
      "XplorOut is an AI-based travel planner that generates personalized itineraries based on destination, month, budget, and travel preferences. Using React and MobX, it recommends optimal routes, stays, and activities, helping users save time and effort while enjoying a smooth, responsive, and engaging trip planning experience.",
    tech: ["React", "MobX", "Node.js", "MongoDB", "Gemini"],
    demoLink: "https://www.xplorout.com/",
    githubLink: "https://github.com/xplorOut",
    image:
      "https://i.postimg.cc/s2TThmKM/Screenshot-2025-05-10-at-3-51-41-PM.png",
  },
  {
    title: "Resumind",
    description:
      "Resumind is an AI-powered platform that analyzes resumes for formatting, keyword alignment, and ATS compatibility. Built with React and Redux, it offers personalized suggestions to enhance job success. Its modular architecture and test-driven approach ensure performance, scalability, and a seamless user experience for resume improvement.",
    tech: ["React", "Prime/react", "Gemini", "Node.js"],
    demoLink: "https://resumind.in/",
    githubLink: "https://github.com/resumelyzer",
    image:
      "https://i.postimg.cc/nV9Zxnns/Screenshot-2025-05-22-at-8-45-45-AM.png",
  },
  {
    title: "Portfolio",
    description:
      "A modern, responsive portfolio showcasing my work as a Front-End Engineer, built with React. Highlights projects, skills, and experience across web and mobile development. Designed for clarity and performance, the site reflects my passion for crafting intuitive UIs, writing clean code, and solving real-world problems through technology.",
    tech: ["React", "Tailwaind", "Typescript"],
    demoLink: "https://codeujjwal.in/",
    githubLink: "https://github.com/codeujjwal/portfolio",
    image:
      "https://i.postimg.cc/52z8q33P/Screenshot-2025-05-10-at-4-00-14-PM.png",
  },
];

const ProjectsSection = () => {
  return (
    <section
      id="projects"
      className="py-20 bg-gray-50"
      style={{
        backgroundColor: "transparent",
        borderBottom: "1px solid rgb(55 65 81)",
      }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured <span className="text-blue-600">Projects</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Here are some of my notable projects that showcase my skills and
            experience in building modern web applications. For more visit my
            github
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 transition-all duration-300 hover:shadow-glow hover:border-blue-400/50"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-inherit"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <a
                    href={project.demoLink}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={18} />
                    Live Demo
                  </a>
                  <a
                    href={project.githubLink}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={18} />
                    Source Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

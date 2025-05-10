import { Briefcase } from "lucide-react";

const experiences = [
  {
    company: "Asian Footwear",
    location: "Gurugram",
    position: "Software Engineer",
    period: "Jan 2025 – Present",
    achievements: [
      "Built Udyog, a vendor app (iOS & Android) for bidding on material requirements.",
      "Developed ERP modules including user/role management, attendance, and 20+ features.",
      "Created SalesTrack, a sales team app with GPS tracking, attendance, and order management.",
      "Built Tashan, a full-featured distributor portal (mobile + web) for order tracking, transactions, and scheme management.",
      "Developed a reports web app to visualize business-wide analytics.",
    ],
  },
  {
    company: "Ruptok Fintech",
    location: "Delhi",
    position: "Senior Software Engineer",
    period: "Oct 2022 – Dec 2024",
    achievements: [
      "Led frontend for SaaS platforms in accounting, invoicing, and UPI payments.",
      "Built Fracto Pay, a finance app integrating UPI, net banking, and cards.",
      "Developed an AI-powered OCR for automating document data extraction.",
      "Designed India's first online gold/jewelry lending/sales platform with 1000+ items.",
      "Built Lender App to manage ₹400 crore in loans, streamlining workflows for 300+ staff.",
    ],
  },
  {
    company: "Squareware",
    location: "Remote",
    position: "Frontend Developer",
    period: "Nov 2021 – Sept 2022",
    achievements: [
      "Built a mobile app from scratch using React Native with perfect UI fidelity.",
      "Wrote maintainable, testable code and integrated Redux for state management.",
      "Implemented unit and end-to-end tests using Jest and Maestro, cutting bugs by 30%.",
    ],
  },
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Work <span className="text-blue-400">Experience</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            I've had the opportunity to work on diverse projects across
            different domains, enhancing my skills and expertise along the way.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-400/30"></div>

          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`mb-12 md:flex ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div
                className={`md:w-1/2 ${
                  index % 2 === 0 ? "md:pr-8" : "md:pl-8"
                }`}
              >
                <div
                  className={`relative ${index % 2 !== 0 && "md:text-right"}`}
                >
                  <div
                    className="hidden md:block absolute top-0 w-4 h-4 rounded-full bg-blue-400 shadow-glow"
                    style={{
                      [index % 2 === 0 ? "right" : "left"]: "-35px",
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  ></div>

                  <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 transition-all duration-300 hover:shadow-glow hover:border-blue-400/50">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-400/20 text-blue-400 mb-3">
                      <Briefcase size={20} />
                    </div>

                    <h3 className="text-xl font-bold text-white">
                      {exp.company}
                    </h3>
                    <p className="text-gray-300 mb-2">
                      {exp.location} — {exp.position}
                    </p>
                    <p className="text-blue-400 font-medium mb-4">
                      {exp.period}
                    </p>

                    <ul className="space-y-2">
                      {exp.achievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          className="text-gray-300 flex items-start"
                        >
                          <span className="mr-2 text-blue-400 mt-1.5">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

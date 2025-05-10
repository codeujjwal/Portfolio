import { useEffect, useRef } from "react";
import { ArrowDown, Code, Terminal, Laptop, Bug } from "lucide-react";
import Background3D from "../components/Background3D";

const HeroSection = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slideUp");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative pt-20 pb-16 overflow-hidden"
    >
      <Background3D />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6" ref={textRef}>
            <div className="space-y-2 opacity-0 animate-fadeIn">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                <span className="text-blue-400 neon-text">Ujjwal</span> Sharma
              </h1>
              <h2 className="text-xl sm:text-2xl text-gray-300 font-medium">
                Front-End Engineer
              </h2>
            </div>

            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed opacity-0 animate-fadeIn animation-delay-200">
              "Crafting fast, responsive, and intuitive user experiences."
            </p>

            <div className="bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl border border-blue-400/20 mt-6 max-w-2xl transform transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-glow opacity-0 animate-fadeIn animation-delay-400">
              <p className="text-gray-300 leading-relaxed">
                I'm Ujjwal Sharma, a Front-End Engineer with 4+ years of
                experience building scalable, high-performance web and mobile
                applications using React.js and React Native. I started coding
                in 10th grade and have been passionate ever since about turning
                complex ideas into intuitive, user-friendly products. Skilled in
                Redux, Redux Saga, and crafting pixel-perfect, responsive UIs,
                I'm known for writing clean, maintainable code and delivering
                high-quality software on time.
              </p>
            </div>

            <div className="pt-6 opacity-0 animate-fadeIn animation-delay-600">
              <a
                href="#skills"
                className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-6 py-3 rounded-lg font-medium transition-all hover:bg-blue-500/30 hover:shadow-glow border border-blue-400/50"
              >
                Explore My Work
                <ArrowDown size={18} className="animate-bounce" />
              </a>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center opacity-0 animate-fadeIn animation-delay-800">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600/30 to-purple-400/30 backdrop-blur-3xl shadow-glow animate-float"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-blue-400/20 hover:border-blue-400/50 transition-all duration-300 hover:shadow-glow">
                    <Code className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-purple-400/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-glow">
                    <Terminal className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-teal-400/20 hover:border-teal-400/50 transition-all duration-300 hover:shadow-glow">
                    <Laptop className="w-8 h-8 text-teal-400" />
                  </div>
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-teal-400/20 hover:border-blue-700/50 transition-all duration-300 hover:shadow-glow">
                    <Bug className="w-8 h-8 text-blue-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#skills" className="text-blue-400 hover:text-blue-300">
          <ArrowDown size={24} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;

import { useState, useEffect } from "react";
import { Link } from "react-router";
import Layout from "@/react-app/components/Layout";
import Banner from "@/react-app/components/Banner";
import TestimonialsSlider from "@/react-app/components/TestimonialsSlider";
import PromoBanner from "@/react-app/components/PromoBanner";
import LogoAnimated from "@/react-app/components/LogoAnimated";
import { 
  PenTool, 
  Image, 
  Calendar, 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  Zap,
  Target,
  Clock,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: PenTool,
    title: "Content Studio",
    description: "Crie posts incríveis com IA em segundos",
    color: "from-blue-500 to-cyan-500",
    href: "/content-studio"
  },
  {
    icon: Image,
    title: "Editor Gráfico", 
    description: "Designs profissionais com templates personalizáveis",
    color: "from-purple-500 to-pink-500",
    href: "/editor"
  },
  {
    icon: Calendar,
    title: "Agendamento",
    description: "Programe seus posts para o momento ideal",
    color: "from-green-500 to-emerald-500", 
    href: "/calendar"
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Analise o desempenho e otimize resultados",
    color: "from-orange-500 to-red-500",
    href: "/analytics"
  }
];

const stats = [
  { label: "Posts Criados", value: "2.5K+", icon: Zap },
  { label: "Tempo Economizado", value: "150h", icon: Clock },
  { label: "Engajamento Médio", value: "+85%", icon: TrendingUp },
  { label: "Clientes Satisfeitos", value: "500+", icon: Target }
];

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const loadFont = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    loadFont();
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        {/* Header */}
        <header className="relative z-50 px-6 py-4 border-b border-white/10">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <LogoAnimated size="md" />
                <span className="text-2xl font-bold text-white">Veo</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/content-studio" className="text-white/80 hover:text-white transition-colors text-sm">Content Studio</Link>
              <Link to="/post-suggestions" className="text-white/80 hover:text-white transition-colors text-sm">Post Suggestions</Link>
              <Link to="/editor" className="text-white/80 hover:text-white transition-colors text-sm">Editor</Link>
              <Link to="/brand-kit" className="text-white/80 hover:text-white transition-colors text-sm">Brand Kit</Link>
              <Link to="/calendar" className="text-white/80 hover:text-white transition-colors text-sm">Calendário</Link>
              <Link to="/pricing" className="text-white/80 hover:text-white transition-colors text-sm">Planos</Link>
              <Link 
                to="/content-studio" 
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Começar
              </Link>
            </div>
          </nav>
        </header>

        {/* Promo Banner */}
        <PromoBanner />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Banner */}
          <Banner />

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-white">
                  Powered by OpenAI & Google Gemini
                </span>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Marketing Digital
              </span>
              <br />
              <span className="text-white">
                com Poucos Cliques
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-10">
              Crie conteúdo profissional para todas as redes sociais com IA avançada. 
              Posts, vídeos, stories e landing pages em minutos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/content-studio"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Começar Agora</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/pricing"
                className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Ver Planos</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/70">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Tudo que você precisa em um só lugar
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Ferramentas profissionais de marketing digital com inteligência artificial
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isHovered = hoveredFeature === index;
                
                return (
                  <Link
                    key={index}
                    to={feature.href}
                    className="group block"
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <div className={`relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden ${
                      isHovered ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
                    }`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      
                      <p className="text-white/70 mb-4">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300">
                        <span>Explorar</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Testimonials Section */}
          <TestimonialsSlider />

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Pronto para revolucionar seu marketing digital?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já estão criando conteúdo incrível com nossa plataforma
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/content-studio"
                className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span>Criar Primeiro Projeto</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center space-x-2 border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
              >
                <span>Ver Planos</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

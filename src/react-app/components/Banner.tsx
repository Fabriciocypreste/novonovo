import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { 
  PenTool, 
  Image, 
  Calendar, 
  BarChart3,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Palette
} from 'lucide-react';

interface BannerProps {
  currentPage?: string;
}

export default function Banner({ }: BannerProps) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const location = useLocation();

  const banners = [
    {
      id: 'content-studio',
      title: 'Content Studio',
      description: 'Crie posts, vídeos e landing pages com IA',
      icon: <PenTool className="w-8 h-8" />,
      gradient: 'from-blue-500 to-purple-600',
      href: '/content-studio',
      features: ['IA Avançada', 'Múltiplas Plataformas', 'Geração Automática']
    },
    {
      id: 'post-suggestions',
      title: 'Post Suggestions',
      description: 'Gere 10 variações de posts para qualquer tema',
      icon: <PenTool className="w-8 h-8" />,
      gradient: 'from-cyan-500 to-blue-600',
      href: '/post-suggestions',
      features: ['10 Variações', 'Múltiplos Estilos', 'Copy & Export']
    },
    {
      id: 'editor',
      title: 'Editor Gráfico',
      description: 'Designs profissionais com templates personalizáveis',
      icon: <Image className="w-8 h-8" />,
      gradient: 'from-purple-500 to-pink-600',
      href: '/editor',
      features: ['Templates Pro', 'Editor Visual', 'Export HD']
    },
    {
      id: 'brand-kit',
      title: 'Brand Kit',
      description: 'Configure sua identidade visual completa',
      icon: <Palette className="w-8 h-8" />,
      gradient: 'from-pink-500 to-rose-600',
      href: '/brand-kit',
      features: ['Cores & Fontes', 'Logo Upload', 'Tom de Voz']
    },
    {
      id: 'calendar',
      title: 'Agendamento Inteligente',
      description: 'Programe seus posts para o momento ideal',
      icon: <Calendar className="w-8 h-8" />,
      gradient: 'from-green-500 to-blue-500',
      href: '/calendar',
      features: ['Auto-Schedule', 'Analytics', 'Múltiplas Contas']
    },
    {
      id: 'analytics',
      title: 'Analytics Avançado',
      description: 'Insights detalhados para otimizar resultados',
      icon: <BarChart3 className="w-8 h-8" />,
      gradient: 'from-orange-500 to-red-500',
      href: '/analytics',
      features: ['ROI Tracking', 'Relatórios', 'Previsões IA']
    }
  ];

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  // Don't show banner on the current page
  const currentBannerData = banners[currentBanner];
  const isCurrentPage = location.pathname === currentBannerData.href;

  if (isCurrentPage) {
    // Show the next banner if we're on the current page
    const nextBanner = banners[(currentBanner + 1) % banners.length];
    return <BannerContent banner={nextBanner} />;
  }

  return <BannerContent banner={currentBannerData} />;
}

function BannerContent({ banner }: { banner: any }) {
  return (
    <div className="relative overflow-hidden bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Icon */}
          <div className={`w-16 h-16 bg-gradient-to-r ${banner.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
            {banner.icon}
          </div>

          {/* Content */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
              <span>{banner.title}</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </h3>
            <p className="text-white/80 text-lg mb-3">{banner.description}</p>
            
            {/* Features */}
            <div className="flex items-center space-x-4">
              {banner.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                  <span className="text-white/70 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-right">
          <Link
            to={banner.href}
            className={`group inline-flex items-center space-x-3 bg-gradient-to-r ${banner.gradient} hover:scale-105 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300`}
          >
            <span>Explorar</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <div className="mt-2 text-white/60 text-sm">
            Teste grátis por 7 dias
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 opacity-20">
        <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute bottom-4 left-20 opacity-20">
        <Target className="w-4 h-4 text-blue-400 animate-bounce" />
      </div>
    </div>
  );
}

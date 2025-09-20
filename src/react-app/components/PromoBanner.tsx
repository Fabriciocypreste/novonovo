import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

interface PromoSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
}

const getPageSlides = (pathname: string): PromoSlide[] => {
  const baseSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=300&fit=crop",
      title: "IA Avançada",
      subtitle: "Conteúdo profissional em segundos",
      cta: "Criar Agora",
      href: "/content-studio"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=300&fit=crop",
      title: "Analytics Poderoso",
      subtitle: "Métricas que realmente importam",
      cta: "Ver Dados",
      href: "/analytics"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=300&fit=crop",
      title: "Editor Profissional",
      subtitle: "Designs incríveis sem esforço",
      cta: "Criar Design",
      href: "/editor"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&h=300&fit=crop",
      title: "Agendamento Smart",
      subtitle: "Publique no momento ideal",
      cta: "Agendar",
      href: "/calendar"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=300&fit=crop",
      title: "Brand Kit",
      subtitle: "Sua marca, sua identidade",
      cta: "Personalizar",
      href: "/brand-kit"
    }
  ];

  // Customize slides based on current page
  switch (pathname) {
    case '/content-studio':
      return [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=300&fit=crop",
          title: "Content Studio Pro",
          subtitle: "IA que entende sua marca",
          cta: "Explorar",
          href: "/content-studio"
        },
        ...baseSlides.slice(1)
      ];
    case '/editor':
      return [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=300&fit=crop",
          title: "Editor Avançado",
          subtitle: "Templates profissionais",
          cta: "Criar Design",
          href: "/editor"
        },
        ...baseSlides.filter(s => s.id !== 3)
      ];
    case '/calendar':
      return [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&h=300&fit=crop",
          title: "Calendário Inteligente",
          subtitle: "Otimize seus horários",
          cta: "Agendar",
          href: "/calendar"
        },
        ...baseSlides.filter(s => s.id !== 4)
      ];
    case '/analytics':
      return [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=300&fit=crop",
          title: "Analytics Pro",
          subtitle: "Insights que geram resultados",
          cta: "Ver Relatórios",
          href: "/analytics"
        },
        ...baseSlides.filter(s => s.id !== 2)
      ];
    default:
      return baseSlides;
  }
};

export default function PromoBanner() {
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = getPageSlides(location.pathname);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-20 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80" />
            </div>
            
            <div className="relative h-full flex items-center justify-between max-w-7xl mx-auto px-6">
              <div className="flex items-center space-x-6">
                <div>
                  <h3 className="text-lg font-bold text-white">{slide.title}</h3>
                  <p className="text-white/80 text-sm">{slide.subtitle}</p>
                </div>
              </div>
              
              <a
                href={slide.href}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-200 border border-white/30"
              >
                {slide.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-8 h-1 transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

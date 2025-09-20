import { useState, useEffect } from 'react';
import { Link } from "react-router";
import Layout from "@/react-app/components/Layout";
import Banner from "@/react-app/components/Banner";
import PromoBanner from "@/react-app/components/PromoBanner";
import LogoAnimated from "@/react-app/components/LogoAnimated";
import { 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Video, 
  Image, 
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Wand2,
  Upload,
  X
} from 'lucide-react';

export default function ContentStudio() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadFont = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    loadFont();
  }, []);

  const quickActions = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Calendário",
      color: "from-blue-500 to-blue-600",
      href: "/calendar"
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Editor",
      color: "from-green-500 to-green-600",
      href: "/editor"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Analytics",
      color: "from-orange-500 to-orange-600",
      href: "/analytics"
    }
  ];

  const contentTypes = [
    { id: 'all', label: 'Todos', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'posts', label: 'Posts', icon: <FileText className="w-4 h-4" /> },
    { id: 'videos', label: 'Vídeos', icon: <Video className="w-4 h-4" /> },
    { id: 'landing', label: 'Landing Pages', icon: <Image className="w-4 h-4" /> }
  ];

  const themes = [
    'Marketing Digital',
    'E-commerce',
    'Saúde e Bem-estar',
    'Tecnologia',
    'Educação',
    'Imobiliário',
    'Alimentação',
    'Moda e Beleza'
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('usage_type', 'reference');

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setReferenceImage(result.data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleGenerateContent = async () => {
    if (selectedThemes.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themes: selectedThemes,
          content_types: ['post', 'video', 'landing_page'],
          platforms: ['instagram', 'facebook', 'twitter', 'youtube', 'linkedin'],
          reference_image: referenceImage
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        // Handle successful generation
        console.log('Generated content:', result.data);
      } else {
        console.error('Generation failed:', result.error);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
        {/* Header */}
        <header className="relative z-50 px-6 py-4 border-b border-white/10">
          <nav className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar ao Início</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <LogoAnimated size="md" />
              <span className="text-2xl font-bold text-white">Veo</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/content-studio" 
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Content Studio
              </Link>
              <Link to="/post-suggestions" className="text-white/80 hover:text-white transition-colors text-sm">Post Suggestions</Link>
              <Link to="/editor" className="text-white/80 hover:text-white transition-colors text-sm">Editor</Link>
              <Link to="/brand-kit" className="text-white/80 hover:text-white transition-colors text-sm">Brand Kit</Link>
              <Link to="/calendar" className="text-white/80 hover:text-white transition-colors text-sm">Calendário</Link>
              <Link to="/pricing" className="text-white/80 hover:text-white transition-colors text-sm">Planos</Link>
            </div>
          </nav>
        </header>

        {/* Promo Banner */}
        <PromoBanner />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Banner */}
          <Banner currentPage="content-studio" />

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              {/* Selected Themes */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
                <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Temas Selecionados</span>
                </h3>
                
                <div className="space-y-2 mb-4">
                  {themes.map((theme) => (
                    <label key={theme} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedThemes.includes(theme)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedThemes([...selectedThemes, theme]);
                          } else {
                            setSelectedThemes(selectedThemes.filter(t => t !== theme));
                          }
                        }}
                        className="rounded border-white/30 bg-white/10 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                      />
                      <span className="text-white/80 text-sm">{theme}</span>
                    </label>
                  ))}
                </div>

                {/* Image Reference Upload */}
                <div className="mb-4">
                  <label className="text-white/80 text-sm font-medium mb-2 block">
                    Imagem de Referência (Opcional)
                  </label>
                  
                  {referenceImage ? (
                    <div className="relative">
                      <img 
                        src={referenceImage} 
                        alt="Reference" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setReferenceImage(null)}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="block w-full border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-white/60 mx-auto mb-2" />
                      <p className="text-white/80 text-sm">Upload de referência</p>
                      <p className="text-white/60 text-xs">Para inspirar a geração</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button 
                  onClick={handleGenerateContent}
                  disabled={selectedThemes.length === 0 || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>{isGenerating ? 'Gerando...' : 'Gerar Tudo'}</span>
                </button>
                <p className="text-white/60 text-xs mt-2 text-center">
                  Post + Vídeo + Landing page para cada tema
                </p>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Ações Rápidas</h3>
                
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.href}
                      className={`w-full bg-gradient-to-r ${action.color} hover:scale-105 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2`}
                    >
                      {action.icon}
                      <span>{action.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Content Studio</h1>
                <p className="text-white/70 text-lg">
                  Criação integrada de posts, vídeos e landing pages
                </p>
              </div>

              {/* Content Type Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveTab(type.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === type.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white/5 backdrop-blur-sm border border-white/10 text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {type.icon}
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Empty State */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-purple-400" />
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Seus conteúdos aparecerão aqui
                </h3>
                <p className="text-white/70 mb-8 max-w-md mx-auto">
                  Clique em "Gerar Tudo" para começar a criar conteúdo automático para seus temas selecionados.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Criar Manualmente</span>
                  </button>
                  <Link 
                    to="/editor"
                    className="border border-white/30 text-white px-8 py-3 rounded-xl font-medium hover:bg-white/10 transition-all duration-200"
                  >
                    Ir para Editor
                  </Link>
                </div>
              </div>

              {/* Content Grid - Would show generated content */}
              {selectedThemes.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {selectedThemes.map((theme, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 mb-4">
                        <h4 className="text-white font-semibold">{theme}</h4>
                        <p className="text-white/80 text-sm">3 conteúdos gerados</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-white/70 text-sm">
                          <FileText className="w-4 h-4 text-green-400" />
                          <span>Post criado</span>
                        </div>
                        <div className="flex items-center space-x-3 text-white/70 text-sm">
                          <Video className="w-4 h-4 text-blue-400" />
                          <span>Vídeo gerado</span>
                        </div>
                        <div className="flex items-center space-x-3 text-white/70 text-sm">
                          <Image className="w-4 h-4 text-purple-400" />
                          <span>Landing page</span>
                        </div>
                      </div>
                      
                      <button className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200">
                        Ver Conteúdos
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

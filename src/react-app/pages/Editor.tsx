import { useState, useEffect } from 'react';
import { Link } from "react-router";
import Layout from "@/react-app/components/Layout";
import Banner from "@/react-app/components/Banner";
import PromoBanner from "@/react-app/components/PromoBanner";
import LogoAnimated from "@/react-app/components/LogoAnimated";
import { 
  ArrowLeft, 
  Sparkles, 
  Image, 
  Type, 
  Palette, 
  Layers,
  Download,
  Save,
  Undo,
  Redo,
  Grid,
  Square
} from 'lucide-react';

export default function Editor() {
  const [selectedTemplate, setSelectedTemplate] = useState('corporativo');
  const [selectedTool, setSelectedTool] = useState('select');

  useEffect(() => {
    const loadFont = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    loadFont();
  }, []);

  const templates = [
    {
      id: 'minimalista',
      name: 'Minimalista Horizontal',
      size: '1080x1080',
      preview: 'bg-gradient-to-r from-gray-100 to-gray-200'
    },
    {
      id: 'corporativo',
      name: 'Corporativo Horizontal',
      size: '1080x1080',
      preview: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      id: 'criativo',
      name: 'Criativo Horizontal',
      size: '1080x1080',
      preview: 'bg-gradient-to-r from-purple-400 to-pink-500'
    }
  ];

  const socialTemplates = [
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      size: '1080x1080',
      platform: 'Instagram'
    },
    {
      id: 'facebook-post', 
      name: 'Facebook Post',
      size: '1200x630',
      platform: 'Facebook'
    },
    {
      id: 'youtube-thumbnail',
      name: 'YouTube Thumbnail',
      size: '1280x720',
      platform: 'YouTube'
    }
  ];

  const tools = [
    { id: 'select', icon: <Layers className="w-4 h-4" />, name: 'Selecionar' },
    { id: 'text', icon: <Type className="w-4 h-4" />, name: 'Texto' },
    { id: 'shapes', icon: <Square className="w-4 h-4" />, name: 'Formas' },
    { id: 'images', icon: <Image className="w-4 h-4" />, name: 'Imagens' },
    { id: 'background', icon: <Palette className="w-4 h-4" />, name: 'Fundo' }
  ];

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
              <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                <Undo className="w-4 h-4" />
              </button>
              <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                <Redo className="w-4 h-4" />
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
              <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
          </nav>
        </header>

        {/* Promo Banner */}
        <PromoBanner />

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Banner */}
          <Banner currentPage="editor" />

          <div className="flex gap-8">
            {/* Left Sidebar - Templates and Tools */}
            <div className="w-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-y-auto p-4">
              {/* Templates Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Grid className="w-4 h-4 text-purple-400" />
                  <h3 className="text-white font-semibold text-sm">Templates</h3>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white/70 text-xs font-medium mb-2">Cartões de Visita</h4>
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`cursor-pointer rounded-lg border transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'border-purple-400 bg-purple-500/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className={`h-16 rounded-t-lg ${template.preview}`}></div>
                      <div className="p-2">
                        <p className="text-white text-xs font-medium">{template.name}</p>
                        <p className="text-white/60 text-xs">{template.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media Templates */}
              <div className="mb-6">
                <h4 className="text-white/70 text-xs font-medium mb-2">Redes Sociais</h4>
                <div className="space-y-2">
                  {socialTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="cursor-pointer rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 p-3"
                    >
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-12 rounded mb-2"></div>
                      <p className="text-white text-xs font-medium">{template.name}</p>
                      <p className="text-white/60 text-xs">{template.size}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-4">Ferramentas</h3>
                <div className="space-y-1">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedTool === tool.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tool.icon}
                      <span>{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col">
              {/* Canvas Header */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-6 py-3 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">Editor Gráfico</span>
                    <span className="text-white/60 text-sm">Corporativo Horizontal</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/60 text-sm">
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="bg-white rounded-2xl shadow-2xl border border-white/20" style={{ width: '600px', height: '400px' }}>
                  {/* Canvas Content */}
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl relative overflow-hidden">
                    {/* Template Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white p-8">
                        <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Sparkles className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">[NOME]</h2>
                        <p className="text-white/80 mb-1">[CARGO]</p>
                        <p className="text-white/80 mb-4">[EMAIL]</p>
                        <p className="text-white/80 text-sm">[WHATSAPP]</p>
                      </div>
                    </div>

                    {/* Selection indicators */}
                    <div className="absolute inset-0 border-2 border-dashed border-purple-400 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-2xl"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Properties */}
            <div className="w-64 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-y-auto p-4">
              <h3 className="text-white font-semibold text-sm mb-4">Projetos Salvos</h3>
              
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-12 rounded mb-2"></div>
                  <p className="text-white text-xs font-medium">Post Instagram</p>
                  <p className="text-white/60 text-xs">Há 2 horas</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 h-12 rounded mb-2"></div>
                  <p className="text-white text-xs font-medium">Capa Facebook</p>
                  <p className="text-white/60 text-xs">Ontem</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-12 rounded mb-2"></div>
                  <p className="text-white text-xs font-medium">Thumbnail YouTube</p>
                  <p className="text-white/60 text-xs">Há 3 dias</p>
                </div>
              </div>

              {/* Properties Panel */}
              {selectedTool === 'text' && (
                <div className="mt-6">
                  <h4 className="text-white font-semibold text-sm mb-4">Propriedades do Texto</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/80 text-xs block mb-2">Fonte</label>
                      <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                        <option>Inter</option>
                        <option>Roboto</option>
                        <option>Montserrat</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/80 text-xs block mb-2">Tamanho</label>
                      <input 
                        type="range" 
                        min="12" 
                        max="72" 
                        defaultValue="24"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-white/80 text-xs block mb-2">Cor</label>
                      <div className="grid grid-cols-6 gap-2">
                        {['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'].map((color) => (
                          <div 
                            key={color}
                            className="w-8 h-8 rounded border border-white/20 cursor-pointer"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTool === 'background' && (
                <div className="mt-6">
                  <h4 className="text-white font-semibold text-sm mb-4">Propriedades do Fundo</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/80 text-xs block mb-2">Tipo</label>
                      <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm">
                        <option>Gradiente</option>
                        <option>Cor Sólida</option>
                        <option>Imagem</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white/80 text-xs block mb-2">Cores do Gradiente</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['linear-gradient(45deg, #667eea 0%, #764ba2 100%)', 
                          'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                          'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
                          'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)'].map((gradient, index) => (
                          <div 
                            key={index}
                            className="w-12 h-8 rounded border border-white/20 cursor-pointer"
                            style={{ background: gradient }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

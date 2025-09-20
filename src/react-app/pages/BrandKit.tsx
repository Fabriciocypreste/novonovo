import { useState, useEffect } from 'react';
import { Link } from "react-router";
import Layout from "@/react-app/components/Layout";
import Banner from "@/react-app/components/Banner";
import { 
  ArrowLeft, 
  Sparkles, 
  Palette, 
  Type, 
  Image, 
  Save,
  Upload,
  Eye,
  Download,
  Settings
} from 'lucide-react';

export default function BrandKit() {
  const [brandKit, setBrandKit] = useState({
    name: '',
    logo_url: '',
    primary_color: '#8B5CF6',
    secondary_color: '#EC4899',
    accent_color: '#F59E0B',
    font_primary: 'Inter',
    font_secondary: 'Montserrat',
    brand_voice: 'conversacional',
    tagline: '',
    brand_description: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');

  useEffect(() => {
    const loadFont = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    loadFont();
  }, []);

  const colorPresets = [
    { name: 'Roxo/Rosa', primary: '#8B5CF6', secondary: '#EC4899', accent: '#F59E0B' },
    { name: 'Azul/Verde', primary: '#3B82F6', secondary: '#10B981', accent: '#F59E0B' },
    { name: 'Vermelho/Laranja', primary: '#EF4444', secondary: '#F97316', accent: '#84CC16' },
    { name: 'Minimalista', primary: '#1F2937', secondary: '#6B7280', accent: '#F59E0B' },
    { name: 'Corporativo', primary: '#1E40AF', secondary: '#3730A3', accent: '#DC2626' },
    { name: 'Natureza', primary: '#059669', secondary: '#0D9488', accent: '#F59E0B' }
  ];

  const fonts = [
    'Inter', 'Montserrat', 'Roboto', 'Open Sans', 'Lato', 'Source Sans Pro',
    'Oswald', 'Raleway', 'Nunito', 'Poppins', 'Merriweather', 'Playfair Display'
  ];

  const brandVoices = [
    { id: 'conversacional', name: 'Conversacional', description: 'Amigável e acessível' },
    { id: 'profissional', name: 'Profissional', description: 'Formal e corporativo' },
    { id: 'inspiracional', name: 'Inspiracional', description: 'Motivacional e positivo' },
    { id: 'autoridade', name: 'Autoridade', description: 'Confiável e especialista' },
    { id: 'jovem', name: 'Jovem', description: 'Moderno e dinâmico' },
    { id: 'luxo', name: 'Luxo', description: 'Sofisticado e exclusivo' }
  ];

  const tabs = [
    { id: 'colors', name: 'Cores', icon: <Palette className="w-4 h-4" /> },
    { id: 'typography', name: 'Tipografia', icon: <Type className="w-4 h-4" /> },
    { id: 'logo', name: 'Logo', icon: <Image className="w-4 h-4" /> },
    { id: 'voice', name: 'Tom de Voz', icon: <Settings className="w-4 h-4" /> },
    { id: 'preview', name: 'Preview', icon: <Eye className="w-4 h-4" /> }
  ];

  const handleColorPreset = (preset: any) => {
    setBrandKit({
      ...brandKit,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      accent_color: preset.accent
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/brand-kit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandKit),
      });

      const result = await response.json();
      if (result.success) {
        // Handle success
        console.log('Brand kit saved successfully');
      }
    } catch (error) {
      console.error('Error saving brand kit:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportBrandKit = () => {
    const data = JSON.stringify(brandKit, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-kit-${brandKit.name || 'untitled'}.json`;
    a.click();
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
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CreativeHub</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/content-studio" className="text-white/80 hover:text-white transition-colors text-sm">Content Studio</Link>
              <Link to="/post-suggestions" className="text-white/80 hover:text-white transition-colors text-sm">Post Suggestions</Link>
              <Link to="/editor" className="text-white/80 hover:text-white transition-colors text-sm">Editor</Link>
              <Link to="/brand-kit" className="text-white/80 hover:text-white transition-colors text-sm">Brand Kit</Link>
              <Link to="/calendar" className="text-white/80 hover:text-white transition-colors text-sm">Calendário</Link>
              <Link to="/pricing" className="text-white/80 hover:text-white transition-colors text-sm">Planos</Link>
              <button
                onClick={exportBrandKit}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
              </button>
            </div>
          </nav>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Banner */}
          <Banner currentPage="brand-kit" />

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Brand Kit</h1>
            <p className="text-white/70 text-lg">
              Configure a identidade visual da sua marca para conteúdo consistente
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Tabs */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-8">
                <h3 className="text-white font-semibold mb-4">Configurações</h3>
                
                <div className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>

                {/* Brand Name */}
                <div className="mt-6">
                  <label className="text-white/80 text-sm font-medium mb-2 block">
                    Nome da Marca
                  </label>
                  <input
                    type="text"
                    value={brandKit.name}
                    onChange={(e) => setBrandKit({...brandKit, name: e.target.value})}
                    placeholder="Minha Marca"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                
                {/* Colors Tab */}
                {activeTab === 'colors' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Paleta de Cores</h2>
                    
                    {/* Color Presets */}
                    <div className="mb-8">
                      <h3 className="text-white font-semibold mb-4">Presets Rápidos</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {colorPresets.map((preset, index) => (
                          <button
                            key={index}
                            onClick={() => handleColorPreset(preset)}
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                          >
                            <div className="flex space-x-2 mb-2">
                              <div className="w-6 h-6 rounded" style={{backgroundColor: preset.primary}}></div>
                              <div className="w-6 h-6 rounded" style={{backgroundColor: preset.secondary}}></div>
                              <div className="w-6 h-6 rounded" style={{backgroundColor: preset.accent}}></div>
                            </div>
                            <div className="text-white text-sm font-medium">{preset.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="text-white/80 text-sm font-medium mb-2 block">Cor Primária</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={brandKit.primary_color}
                            onChange={(e) => setBrandKit({...brandKit, primary_color: e.target.value})}
                            className="w-16 h-10 rounded border border-white/20"
                          />
                          <input
                            type="text"
                            value={brandKit.primary_color}
                            onChange={(e) => setBrandKit({...brandKit, primary_color: e.target.value})}
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-white/80 text-sm font-medium mb-2 block">Cor Secundária</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={brandKit.secondary_color}
                            onChange={(e) => setBrandKit({...brandKit, secondary_color: e.target.value})}
                            className="w-16 h-10 rounded border border-white/20"
                          />
                          <input
                            type="text"
                            value={brandKit.secondary_color}
                            onChange={(e) => setBrandKit({...brandKit, secondary_color: e.target.value})}
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-white/80 text-sm font-medium mb-2 block">Cor de Destaque</label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="color"
                            value={brandKit.accent_color}
                            onChange={(e) => setBrandKit({...brandKit, accent_color: e.target.value})}
                            className="w-16 h-10 rounded border border-white/20"
                          />
                          <input
                            type="text"
                            value={brandKit.accent_color}
                            onChange={(e) => setBrandKit({...brandKit, accent_color: e.target.value})}
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Typography Tab */}
                {activeTab === 'typography' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Tipografia</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-white/80 text-sm font-medium mb-2 block">Fonte Primária</label>
                        <select
                          value={brandKit.font_primary}
                          onChange={(e) => setBrandKit({...brandKit, font_primary: e.target.value})}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          {fonts.map((font) => (
                            <option key={font} value={font} style={{fontFamily: font}}>{font}</option>
                          ))}
                        </select>
                        <div className="mt-3 p-4 bg-white/5 rounded-lg">
                          <p className="text-white text-lg" style={{fontFamily: brandKit.font_primary}}>
                            Preview da fonte primária
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-white/80 text-sm font-medium mb-2 block">Fonte Secundária</label>
                        <select
                          value={brandKit.font_secondary}
                          onChange={(e) => setBrandKit({...brandKit, font_secondary: e.target.value})}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                        >
                          {fonts.map((font) => (
                            <option key={font} value={font} style={{fontFamily: font}}>{font}</option>
                          ))}
                        </select>
                        <div className="mt-3 p-4 bg-white/5 rounded-lg">
                          <p className="text-white text-lg" style={{fontFamily: brandKit.font_secondary}}>
                            Preview da fonte secundária
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Logo Tab */}
                {activeTab === 'logo' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Logo</h2>
                    
                    <div className="space-y-6">
                      {/* Logo Upload */}
                      <div>
                        <label className="text-white/80 text-sm font-medium mb-2 block">Upload do Logo</label>
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
                          <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                          <p className="text-white/80 mb-2">Arraste seu logo aqui ou clique para selecionar</p>
                          <p className="text-white/60 text-sm">PNG, JPG, SVG até 5MB</p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Handle file upload
                                console.log('Logo file:', file);
                              }
                            }}
                          />
                        </div>
                      </div>

                      {/* Logo URL */}
                      <div>
                        <label className="text-white/80 text-sm font-medium mb-2 block">URL do Logo</label>
                        <input
                          type="url"
                          value={brandKit.logo_url}
                          onChange={(e) => setBrandKit({...brandKit, logo_url: e.target.value})}
                          placeholder="https://exemplo.com/logo.png"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50"
                        />
                      </div>

                      {/* Logo Preview */}
                      {brandKit.logo_url && (
                        <div>
                          <label className="text-white/80 text-sm font-medium mb-2 block">Preview</label>
                          <div className="bg-white/5 rounded-lg p-6 text-center">
                            <img
                              src={brandKit.logo_url}
                              alt="Logo preview"
                              className="max-h-32 mx-auto"
                              onError={() => setBrandKit({...brandKit, logo_url: ''})}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Voice Tab */}
                {activeTab === 'voice' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Tom de Voz</h2>
                    
                    <div className="space-y-6">
                      {/* Brand Voice Selection */}
                      <div>
                        <label className="text-white/80 text-sm font-medium mb-4 block">Personalidade da Marca</label>
                        <div className="grid md:grid-cols-2 gap-4">
                          {brandVoices.map((voice) => (
                            <button
                              key={voice.id}
                              onClick={() => setBrandKit({...brandKit, brand_voice: voice.id})}
                              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                                brandKit.brand_voice === voice.id
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                  : 'bg-white/5 border border-white/20 text-white/80 hover:bg-white/10'
                              }`}
                            >
                              <div className="font-semibold">{voice.name}</div>
                              <div className="text-sm opacity-80">{voice.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Tagline */}
                      <div>
                        <label className="text-white/80 text-sm font-medium mb-2 block">Tagline</label>
                        <input
                          type="text"
                          value={brandKit.tagline}
                          onChange={(e) => setBrandKit({...brandKit, tagline: e.target.value})}
                          placeholder="Slogan da sua marca"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50"
                        />
                      </div>

                      {/* Brand Description */}
                      <div>
                        <label className="text-white/80 text-sm font-medium mb-2 block">Descrição da Marca</label>
                        <textarea
                          value={brandKit.brand_description}
                          onChange={(e) => setBrandKit({...brandKit, brand_description: e.target.value})}
                          placeholder="Descreva os valores, missão e personalidade da sua marca..."
                          rows={4}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Preview do Brand Kit</h2>
                    
                    <div className="space-y-8">
                      {/* Color Palette Preview */}
                      <div>
                        <h3 className="text-white font-semibold mb-4">Paleta de Cores</h3>
                        <div className="flex space-x-4">
                          <div className="text-center">
                            <div 
                              className="w-20 h-20 rounded-lg mb-2"
                              style={{backgroundColor: brandKit.primary_color}}
                            ></div>
                            <p className="text-white/80 text-sm">Primária</p>
                            <p className="text-white/60 text-xs">{brandKit.primary_color}</p>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-20 h-20 rounded-lg mb-2"
                              style={{backgroundColor: brandKit.secondary_color}}
                            ></div>
                            <p className="text-white/80 text-sm">Secundária</p>
                            <p className="text-white/60 text-xs">{brandKit.secondary_color}</p>
                          </div>
                          <div className="text-center">
                            <div 
                              className="w-20 h-20 rounded-lg mb-2"
                              style={{backgroundColor: brandKit.accent_color}}
                            ></div>
                            <p className="text-white/80 text-sm">Destaque</p>
                            <p className="text-white/60 text-xs">{brandKit.accent_color}</p>
                          </div>
                        </div>
                      </div>

                      {/* Mock Post Preview */}
                      <div>
                        <h3 className="text-white font-semibold mb-4">Preview de Post</h3>
                        <div className="bg-white rounded-2xl p-6 max-w-md">
                          <div className="flex items-center space-x-3 mb-4">
                            {brandKit.logo_url ? (
                              <img src={brandKit.logo_url} alt="Logo" className="w-10 h-10 rounded-full" />
                            ) : (
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                style={{backgroundColor: brandKit.primary_color}}
                              >
                                {brandKit.name.charAt(0) || 'M'}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold" style={{fontFamily: brandKit.font_primary}}>
                                {brandKit.name || 'Minha Marca'}
                              </p>
                              <p className="text-gray-500 text-sm">@marca</p>
                            </div>
                          </div>
                          
                          <div 
                            className="h-40 rounded-lg mb-4 flex items-center justify-center text-white font-bold"
                            style={{background: `linear-gradient(45deg, ${brandKit.primary_color}, ${brandKit.secondary_color})`}}
                          >
                            <span style={{fontFamily: brandKit.font_primary}}>
                              {brandKit.tagline || 'Sua mensagem aqui'}
                            </span>
                          </div>
                          
                          <p style={{fontFamily: brandKit.font_secondary}} className="text-gray-800">
                            Exemplo de post usando seu brand kit personalizado! 
                            ✨ {brandKit.tagline}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

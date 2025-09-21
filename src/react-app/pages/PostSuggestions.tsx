import { useState, useEffect } from 'react';
import { Link } from "react-router";
import Layout from "@/react-app/components/Layout";
import Banner from "@/react-app/components/Banner";
import { 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Copy, 
  Download,
  RefreshCw,
  Hash,
  Type,
  Wand2,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import { generatePostSuggestions } from '@/shared/apiClient';

export default function PostSuggestions() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('conversacional');
  const [platform, setPlatform] = useState('instagram');
  const [posts, setPosts] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  useEffect(() => {
    const loadFont = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    loadFont();
  }, []);

  const styles = [
    { id: 'conversacional', name: 'Conversacional', description: 'Tom amigável e próximo' },
    { id: 'profissional', name: 'Profissional', description: 'Formal e corporativo' },
    { id: 'inspiracional', name: 'Inspiracional', description: 'Motivacional e uplifting' },
    { id: 'educativo', name: 'Educativo', description: 'Didático e informativo' },
    { id: 'humor', name: 'Humor', description: 'Descontraído e divertido' },
    { id: 'urgencia', name: 'Urgência', description: 'Call-to-action forte' }
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', limit: 2200, color: 'from-pink-500 to-purple-500' },
    { id: 'facebook', name: 'Facebook', limit: 63206, color: 'from-blue-500 to-blue-600' },
    { id: 'twitter', name: 'Twitter', limit: 280, color: 'from-blue-400 to-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', limit: 3000, color: 'from-blue-600 to-blue-700' },
    { id: 'youtube', name: 'YouTube', limit: 5000, color: 'from-red-500 to-red-600' }
  ];

  const handleGeneratePosts = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setPosts([]);

    try {
      const result = await generatePostSuggestions(topic.trim(), style, platform);
      if (result.success) {
        setPosts(result.data || []);
      } else {
        console.error('Generation failed:', result.error);
      }
    } catch (error) {
      console.error('Error generating posts:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportPost = (post: any) => {
    const content = `${post.title}\n\n${post.content}\n\n${post.hashtags}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `post-${post.title.slice(0, 30)}.txt`;
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
            </div>
          </nav>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Banner */}
          <Banner currentPage="post-suggestions" />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Controls */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-8">
                <h3 className="text-white font-semibold mb-6 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span>Gerador de Posts</span>
                </h3>

                {/* Topic Input */}
                <div className="mb-6">
                  <label className="text-white/80 text-sm font-medium mb-2 block">
                    Assunto/Tema
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Marketing Digital, E-commerce, Saúde..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleGeneratePosts()}
                  />
                </div>

                {/* Style Selection */}
                <div className="mb-6">
                  <label className="text-white/80 text-sm font-medium mb-2 block">
                    Estilo de Escrita
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {styles.map((styleOption) => (
                      <button
                        key={styleOption.id}
                        onClick={() => setStyle(styleOption.id)}
                        className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                          style === styleOption.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-white/5 border border-white/20 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <div className="font-semibold">{styleOption.name}</div>
                        <div className="text-xs opacity-70">{styleOption.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Selection */}
                <div className="mb-6">
                  <label className="text-white/80 text-sm font-medium mb-2 block">
                    Plataforma
                  </label>
                  <div className="space-y-2">
                    {platforms.map((platformOption) => (
                      <button
                        key={platformOption.id}
                        onClick={() => setPlatform(platformOption.id)}
                        className={`w-full p-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                          platform === platformOption.id
                            ? `bg-gradient-to-r ${platformOption.color} text-white`
                            : 'bg-white/5 border border-white/20 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span>{platformOption.name}</span>
                        <span className="text-xs opacity-70">
                          {platformOption.limit} chars
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGeneratePosts}
                  disabled={!topic.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Gerar 10 Posts</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Sugestões de Posts</h1>
                <p className="text-white/70 text-lg">
                  Gere múltiplas variações de posts para o mesmo tema
                </p>
              </div>

              {/* Posts Grid */}
              {posts.length > 0 ? (
                <div className="space-y-6">
                  {posts.map((post, index) => (
                    <div
                      key={index}
                      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
                        selectedPost === index ? 'ring-2 ring-purple-500 bg-white/10' : 'hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedPost(selectedPost === index ? null : index)}
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{post.title}</h3>
                            <div className="flex items-center space-x-2 text-white/60 text-sm">
                              <Type className="w-4 h-4" />
                              <span>{style}</span>
                              <span>•</span>
                              <span>{platform}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(`${post.title}\n\n${post.content}\n\n${post.hashtags}`);
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            title="Copiar"
                          >
                            <Copy className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              exportPost(post);
                            }}
                            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                            title="Exportar"
                          >
                            <Download className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="bg-white/5 rounded-lg p-4 mb-4">
                        <p className="text-white leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>
                      </div>

                      {/* Hashtags */}
                      <div className="flex items-center space-x-2 mb-4">
                        <Hash className="w-4 h-4 text-purple-400" />
                        <div className="flex flex-wrap gap-2">
                          {post.hashtags.split(' ').filter((tag: string) => tag.trim()).map((hashtag: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg text-sm"
                            >
                              {hashtag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Engagement Preview */}
                      <div className="flex items-center justify-between text-white/60 text-sm border-t border-white/10 pt-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.engagement?.likes || Math.floor(Math.random() * 100) + 50}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.engagement?.comments || Math.floor(Math.random() * 20) + 5}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="w-4 h-4" />
                            <span>{post.engagement?.shares || Math.floor(Math.random() * 10) + 2}</span>
                          </div>
                        </div>
                        <div className="text-xs">
                          Estimativa de engajamento: {post.engagement?.rate || Math.floor(Math.random() * 5) + 3}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-16 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-purple-400" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Pronto para criar posts incríveis?
                  </h3>
                  <p className="text-white/70 mb-8 max-w-md mx-auto">
                    Digite um assunto, escolha o estilo e plataforma, e deixe nossa IA criar 10 variações únicas de posts para você.
                  </p>
                  
                  <div className="text-white/60 text-sm">
                    💡 Dica: Seja específico no tema para melhores resultados
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

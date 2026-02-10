import { useState, useEffect } from 'react';
import { Link } from "react-router";
import Layout from "@/react-app/components/Layout";
import PromoBanner from "@/react-app/components/PromoBanner";
import LogoAnimated from "@/react-app/components/LogoAnimated";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Edit,
  Trash2
} from 'lucide-react';
import { getContentItems } from '@/shared/apiClient';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  // const [view, setView] = useState('month');

  useEffect(() => {
    const loadFont = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    loadFont();

    async function fetchContent() {
        // HACK: Hardcoding project ID 1 for now.
        // In a real app, this would come from a project selector.
        const result = await getContentItems("1");
        if(result.success && result.data) {
            const formattedPosts = result.data.map(item => ({
                id: item.id,
                title: item.title,
                platform: item.platform || 'instagram',
                time: item.scheduled_at ? new Date(item.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'N/A',
                date: item.scheduled_at ? item.scheduled_at.split('T')[0] : '',
                status: item.status,
                engagement: item.engagement_estimate || 'N/A'
            }));
            setScheduledPosts(formattedPosts);
        }
    }
    fetchContent();
  }, []);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const quickSchedule = [
    { time: '09:00', label: 'Manhã', optimal: true },
    { time: '12:00', label: 'Almoço', optimal: false },
    { time: '18:00', label: 'Noite', optimal: true },
    { time: '21:00', label: 'Final do dia', optimal: false }
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'from-pink-500 to-purple-500';
      case 'facebook': return 'from-blue-500 to-blue-600';
      case 'twitter': return 'from-blue-400 to-blue-500';
      case 'youtube': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getPostsForDate = (date: Date) => {
    const dateString = formatDate(date);
    return scheduledPosts.filter(post => post.date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isSelected = (date: Date) => {
    return formatDate(date) === formatDate(selectedDate);
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800">
      {/* Header */}
      <header className="relative z-50 px-6 py-4 border-b border-white/10">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/content-studio" 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar ao Content Studio</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <LogoAnimated size="md" />
            <span className="text-2xl font-bold text-white">Veo</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/content-studio" className="text-white/80 hover:text-white transition-colors text-sm">Content Studio</Link>
            <Link to="/editor" className="text-white/80 hover:text-white transition-colors text-sm">Editor</Link>
            <Link 
              to="/calendar" 
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Calendário
            </Link>
          </div>
        </nav>
      </header>

      {/* Promo Banner */}
      <PromoBanner />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-purple-400" />
                <span>Agendar Novo Post</span>
              </h3>
              
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 mb-4">
                Criar Agendamento
              </button>
              
              <div className="space-y-2">
                <p className="text-white/70 text-sm mb-3">Horários Otimizados:</p>
                {quickSchedule.map((schedule, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      schedule.optimal 
                        ? 'border-green-400/30 bg-green-400/10' 
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{schedule.time}</p>
                      <p className="text-white/60 text-xs">{schedule.label}</p>
                    </div>
                    {schedule.optimal && (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Preview */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Analytics Rápido</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">24</div>
                  <div className="text-white/60 text-sm">Posts agendados</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">12.5K</div>
                    <div className="text-white/60 text-xs">Engajamento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">94%</div>
                    <div className="text-white/60 text-xs">Taxa de entrega</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  
                  <h2 className="text-2xl font-bold text-white">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  
                  <button 
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-white/60 hover:text-white text-sm transition-colors">
                    Mês
                  </button>
                  <button className="text-white/60 hover:text-white text-sm transition-colors">
                    Semana
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-white/60 text-sm py-2 font-medium">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentDate).map((date, index) => {
                  const posts = getPostsForDate(date);
                  
                  return (
                    <div 
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`min-h-[80px] p-2 border border-white/5 rounded-lg cursor-pointer transition-all duration-200 ${
                        isSelected(date) 
                          ? 'bg-purple-500/30 border-purple-400' 
                          : isToday(date)
                          ? 'bg-white/10 border-white/20'
                          : 'hover:bg-white/5'
                      } ${
                        !isCurrentMonth(date) ? 'opacity-40' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(date) ? 'text-white' : isCurrentMonth(date) ? 'text-white/80' : 'text-white/40'
                      }`}>
                        {date.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {posts.slice(0, 2).map((post, postIndex) => (
                          <div 
                            key={postIndex}
                            className={`text-xs p-1 rounded bg-gradient-to-r ${getPlatformColor(post.platform)} text-white truncate`}
                          >
                            {post.time}
                          </div>
                        ))}
                        {posts.length > 2 && (
                          <div className="text-xs text-white/60 text-center">
                            +{posts.length - 2} mais
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Selected Day Details */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-purple-400" />
                <span>
                  {selectedDate.getDate()} de {months[selectedDate.getMonth()]}
                </span>
              </h3>
              
              <div className="space-y-4">
                {getPostsForDate(selectedDate).length > 0 ? (
                  getPostsForDate(selectedDate).map((post) => (
                    <div 
                      key={post.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`flex items-center space-x-2 text-white bg-gradient-to-r ${getPlatformColor(post.platform)} px-2 py-1 rounded-lg`}>
                          {getPlatformIcon(post.platform)}
                          <span className="text-xs font-medium">{post.time}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-white/10 rounded transition-colors">
                            <Edit className="w-3 h-3 text-white/60" />
                          </button>
                          <button className="p-1 hover:bg-white/10 rounded transition-colors">
                            <Trash2 className="w-3 h-3 text-white/60" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="text-white text-sm font-medium mb-2">
                        {post.title}
                      </h4>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          post.status === 'scheduled' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {post.status === 'scheduled' ? 'Agendado' : 'Publicado'}
                        </span>
                        <span className="text-white/60">
                          Est. {post.engagement}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">
                      Nenhum post agendado para este dia
                    </p>
                    <button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                      Agendar Post
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mt-6">
              <h3 className="text-white font-semibold mb-4">Posts por Plataforma</h3>
              
              <div className="space-y-3">
                {[
                  { platform: 'instagram', count: 8, color: 'from-pink-500 to-purple-500' },
                  { platform: 'facebook', count: 6, color: 'from-blue-500 to-blue-600' },
                  { platform: 'youtube', count: 4, color: 'from-red-500 to-red-600' },
                  { platform: 'twitter', count: 6, color: 'from-blue-400 to-blue-500' }
                ].map((item) => (
                  <div key={item.platform} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white`}>
                        {getPlatformIcon(item.platform)}
                      </div>
                      <span className="text-white/80 text-sm capitalize">{item.platform}</span>
                    </div>
                    <span className="text-white font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
}

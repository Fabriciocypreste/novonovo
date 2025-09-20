import { useState, useEffect } from 'react';
import { Link } from "react-router";
import Layout from "@/react-app/components/Layout";
import { 
  ArrowLeft, 
  Sparkles, 
  Check,
  X,
  Crown,
  Zap,
  Star
} from 'lucide-react';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const loadFont = () => {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    loadFont();
  }, []);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfeito para começar',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/30',
      monthly: 29,
      annual: 24,
      popular: false,
      features: [
        '50 posts por mês',
        '10 vídeos por mês',
        '5 landing pages',
        '2 projetos ativos',
        'Editor básico',
        'Suporte por email',
        'Analytics básico',
        'Agendamento simples'
      ],
      limits: [
        'Sem templates premium',
        'Marca d\'água em exports',
        'Limite de 2 contas sociais'
      ]
    },
    {
      name: 'Professional',
      description: 'Ideal para profissionais',
      icon: <Star className="w-6 h-6" />,
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500',
      monthly: 79,
      annual: 65,
      popular: true,
      features: [
        '200 posts por mês',
        '50 vídeos por mês',
        '20 landing pages',
        '10 projetos ativos',
        'Editor completo',
        'Templates premium',
        'Suporte prioritário',
        'Analytics avançado',
        'Agendamento inteligente',
        'Sem marca d\'água',
        '10 contas sociais',
        'Colaboração em equipe'
      ],
      limits: []
    },
    {
      name: 'Enterprise',
      description: 'Para agências e grandes empresas',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      borderColor: 'border-orange-500/30',
      monthly: 199,
      annual: 165,
      popular: false,
      features: [
        'Posts ilimitados',
        'Vídeos ilimitados',
        'Landing pages ilimitadas',
        'Projetos ilimitados',
        'Editor profissional',
        'Todos os templates',
        'Suporte dedicado',
        'Analytics empresarial',
        'IA personalizada',
        'White-label',
        'Contas ilimitadas',
        'Equipe ilimitada',
        'API acesso',
        'Integração personalizada'
      ],
      limits: []
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthly : plan.annual;
  };

  const getSavings = (plan: typeof plans[0]) => {
    if (billingCycle === 'annual') {
      const monthlyCost = plan.monthly * 12;
      const annualCost = plan.annual * 12;
      const savings = monthlyCost - annualCost;
      return Math.round((savings / monthlyCost) * 100);
    }
    return 0;
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
              <Link to="/editor" className="text-white/80 hover:text-white transition-colors text-sm">Editor</Link>
              <Link to="/calendar" className="text-white/80 hover:text-white transition-colors text-sm">Calendário</Link>
              <Link 
                to="/pricing" 
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Planos
              </Link>
            </div>
          </nav>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Planos e Preços
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto">
              Escolha o plano perfeito para suas necessidades de marketing digital
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 relative ${
                  billingCycle === 'annual'
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Anual
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                  -20%
                </div>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white/5 backdrop-blur-sm border ${plan.borderColor} rounded-2xl p-8 ${
                  plan.popular 
                    ? 'ring-2 ring-purple-500 ring-opacity-50 transform scale-105 shadow-2xl' 
                    : 'hover:bg-white/10'
                } transition-all duration-300`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                      <Crown className="w-4 h-4" />
                      <span>Mais Popular</span>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center text-white mx-auto mb-4`}>
                    {plan.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/70">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center space-x-2">
                    <span className="text-5xl font-bold text-white">R${getPrice(plan)}</span>
                    <span className="text-white/60">/mês</span>
                  </div>
                  
                  {billingCycle === 'annual' && getSavings(plan) > 0 && (
                    <div className="mt-2 text-green-400 text-sm font-medium">
                      Economize {getSavings(plan)}% no plano anual
                    </div>
                  )}
                  
                  <div className="mt-4 text-white/60 text-sm">
                    {billingCycle === 'annual' 
                      ? `R${getPrice(plan) * 12} cobrado anualmente`
                      : 'Cobrado mensalmente'
                    }
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limits.map((limit, limitIndex) => (
                    <div key={limitIndex} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <X className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white/60 text-sm">{limit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}>
                  {plan.name === 'Enterprise' ? 'Falar com Vendas' : 'Começar Agora'}
                </button>
                
                <p className="text-center text-white/60 text-xs mt-4">
                  Teste grátis por 7 dias • Cancele quando quiser
                </p>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Perguntas Frequentes</h2>
            <p className="text-white/70 mb-12">Precisa de ajuda? Estamos aqui para esclarecer suas dúvidas</p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left">
                <h3 className="text-white font-semibold mb-3">Posso cancelar a qualquer momento?</h3>
                <p className="text-white/70 text-sm">
                  Sim! Você pode cancelar sua assinatura a qualquer momento. Não cobramos taxas de cancelamento.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left">
                <h3 className="text-white font-semibold mb-3">Como funciona o teste grátis?</h3>
                <p className="text-white/70 text-sm">
                  Teste todos os recursos por 7 dias gratuitamente. Não é necessário cartão de crédito.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left">
                <h3 className="text-white font-semibold mb-3">Posso mudar de plano depois?</h3>
                <p className="text-white/70 text-sm">
                  Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left">
                <h3 className="text-white font-semibold mb-3">Oferecem suporte técnico?</h3>
                <p className="text-white/70 text-sm">
                  Sim! Todos os planos incluem suporte técnico. Planos superiores têm prioridade.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-24 text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de profissionais que já estão criando conteúdo incrível com nossa plataforma
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Começar Teste Grátis
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200">
                Falar com Especialista
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

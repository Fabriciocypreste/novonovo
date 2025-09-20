import { Link } from "react-router";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import LogoAnimated from "./LogoAnimated";

export default function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <LogoAnimated size="md" />
              <span className="text-2xl font-bold text-white">Veo</span>
            </div>
            <p className="text-white/70 text-sm mb-6">
              Plataforma completa de marketing digital com IA. 
              Crie conteúdo profissional em minutos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Produto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produto</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/content-studio" className="text-white/70 hover:text-white transition-colors text-sm">
                  Content Studio
                </Link>
              </li>
              <li>
                <Link to="/editor" className="text-white/70 hover:text-white transition-colors text-sm">
                  Editor Gráfico
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-white/70 hover:text-white transition-colors text-sm">
                  Calendário
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-white/70 hover:text-white transition-colors text-sm">
                  Analytics
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-white/70 hover:text-white transition-colors text-sm">
                  Planos e Preços
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/70 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-white/70 hover:text-white transition-colors text-sm">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-white transition-colors text-sm">
                  Contato
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-white/70 hover:text-white transition-colors text-sm">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-white/70 text-sm">contato@creativehub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-white/70 text-sm">+55 (11) 99999-9999</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-purple-400 mt-0.5" />
                <span className="text-white/70 text-sm">
                  São Paulo, SP<br />
                  Brasil
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm">
              © 2024 Veo. Todos os direitos reservados.
            </div>
            <div className="flex space-x-6">
              <Link to="/privacy" className="text-white/60 hover:text-white transition-colors text-sm">
                Política de Privacidade
              </Link>
              <Link to="/terms" className="text-white/60 hover:text-white transition-colors text-sm">
                Termos de Uso
              </Link>
              <Link to="/cookies" className="text-white/60 hover:text-white transition-colors text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

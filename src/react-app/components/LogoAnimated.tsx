import { useEffect, useState } from 'react';

interface LogoAnimatedProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LogoAnimated({ size = 'md', className = '' }: LogoAnimatedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`${sizeClasses[size]} ${className} transition-all duration-500 ${
      isLoaded ? 'animate-pulse' : ''
    }`}>
      <img 
        src="https://mocha-cdn.com/0199691f-f44d-7129-8ce7-aab1dbf590c2/veo34.png"
        alt="Veo Logo"
        className={`w-full h-full object-contain transform transition-all duration-700 hover:scale-110 hover:rotate-3 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

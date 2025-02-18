export const theme = {
  colors: {
    // Main theme colors
    primary: 'from-[#2DD4BF] to-[#0EA5E9]',
    secondary: 'from-[#8B5CF6] to-[#D946EF]',
    accent: 'from-[#F472B6] to-[#FB7185]',
    
    // Backgrounds
    surface: 'bg-[#0F172A] dark:bg-[#020617]',
    card: 'bg-[#1E293B] dark:bg-[#0F172A]',
    cardHover: 'hover:bg-[#334155] dark:hover:bg-[#1E293B]',
    
    // Borders and dividers
    border: 'border-[#334155] dark:border-[#1E293B]',
    divider: 'from-[#334155] to-transparent',
    glow: 'shadow-[#2DD4BF]/10',
    
    // Text colors
    text: 'text-[#F8FAFC] dark:text-[#F1F5F9]',
    textMuted: 'text-[#94A3B8] dark:text-[#64748B]',
    textHighlight: 'text-[#2DD4BF] dark:text-[#0EA5E9]',
    
    // Status colors
    success: 'from-[#34D399] to-[#10B981]',
    error: 'from-[#FB7185] to-[#EF4444]',
    warning: 'from-[#FBBF24] to-[#F59E0B]',
    
    // UI elements
    button: 'from-[#2DD4BF] via-[#0EA5E9] to-[#8B5CF6]',
    buttonHover: 'hover:from-[#0EA5E9] hover:via-[#8B5CF6] hover:to-[#D946EF]',
    input: 'bg-[#1E293B] dark:bg-[#0F172A]',
    selection: 'bg-[#2DD4BF]/20'
  },
  utils: {
    glassEffect: 'backdrop-blur-md bg-white/[0.05]',
    hoverTransition: 'transition-all duration-300 ease-in-out',
    focusRing: 'focus:ring-2 focus:ring-[#2DD4BF] focus:ring-opacity-50',
    containerWidth: 'max-w-7xl mx-auto'
  }
};

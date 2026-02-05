import React, { createContext, useContext, useState, ReactNode } from 'react';

type FooterContextType = {
  footerVisible: boolean;
  setFooterVisible: (visible: boolean) => void;
};

const FooterContext = createContext<FooterContextType | undefined>(undefined);

export const FooterProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [footerVisible, setFooterVisible] = useState(true);
  
  return (
    <FooterContext.Provider value={{ footerVisible, setFooterVisible }}>
      {children}
    </FooterContext.Provider>
  );
};

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (context === undefined) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};

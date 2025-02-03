import React from 'react';

import { FOOTER, HEADER } from './config-layout';

interface MainProps {
  children: React.ReactNode;
}

const Main = ({ children }: MainProps) => {
  return (
    <main className="container mx-auto">
      <div
        className="flex flex-col px-5 md:px-20"
        style={{
          minHeight: `calc(100vh - ${HEADER.H_DESKTOP + FOOTER.H_DESKTOP}px)`,
        }}
      >
        {children}
      </div>
    </main>
  );
};

export default Main;

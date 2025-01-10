import React from 'react';

interface MainProps {
  children: React.ReactNode;
}

const Main = ({ children }: MainProps) => {
  return (
    <main className="container mx-auto">
      <div className="flex flex-col justify-center px-5 py-5 md:px-20">
        {children}
      </div>
    </main>
  );
};

export default Main;

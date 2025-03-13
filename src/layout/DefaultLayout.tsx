import { Toaster } from '@/components/ui/sonner';

import Footer from './Footer';
import Header from './Header';
import Main from './Main';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Toaster position="top-center" closeButton />
      <Footer />
    </>
  );
};

export default DefaultLayout;

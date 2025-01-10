import Logo from '@/assets/logo_icon.png';

const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-center border-t">
      <div className="container items-center gap-4 px-5 py-6 md:flex md:px-20 md:py-10">
        <img
          src={Logo}
          alt="로고"
          className="h-10 w-10 md:h-[72px] md:w-[72px]"
        />
        <div>
          {/* line height 36px */}
          <p className="text-xl font-bold leading-[24px] md:leading-[36px]">
            Duckwho
          </p>
          <p className="mt-1 text-sm font-light leading-[24px] text-[#94A3B8]">
            © 2024. Duckwho all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

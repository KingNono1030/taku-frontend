//최대 넓이가 1160px인 섹션 레이아웃을 만들어보자.

interface SectionLayoutProps {
  children: React.ReactNode;
}

const SectionLayout = ({ children }: SectionLayoutProps) => {
  return (
    <section className="mx-auto w-full max-w-[1160px]">{children}</section>
  );
};

export default SectionLayout;

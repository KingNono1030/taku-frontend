interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="flex h-screen bg-background p-6">
      <div className="flex w-full overflow-hidden rounded-3xl border border-border/50 bg-card">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;

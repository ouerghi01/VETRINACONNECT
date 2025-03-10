

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="admin-layout">
          {children}
        </div>
    );
  }
  
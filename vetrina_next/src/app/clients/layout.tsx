

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <body
        className="w-full"
        >
          {children}
        </body>
    );
  }
  
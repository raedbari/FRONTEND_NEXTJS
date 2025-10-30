import "./globals.css";

export const metadata = {
  title: "Smart DevOps Platform",
  description: "Cloud-native automation & monitoring platform",
  icons: {
    icon: "/cloud.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#050b14] text-white min-h-screen flex flex-col overflow-x-hidden">
        {/* المحتوى الرئيسي */}
        <main className="flex-grow">{children}</main>

        {/* الفوتر المثبّت في الأسفل */}
        <footer className="w-full text-center py-3 text-white/60 text-sm border-t border-white/10 bg-[#050b14]">
          Smart DevOps Platform — Dashboard © 2026
        </footer>
      </body>
    </html>
  );
}

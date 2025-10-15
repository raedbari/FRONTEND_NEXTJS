
import "./globals.css";


export const metadata = {
  title: "Smart DevOps Platform",
  description: "Cloud-native automation & monitoring platform",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {

  
  return (
    <html lang="en">
      <body className="bg-[#050b14] text-white min-h-screen overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}


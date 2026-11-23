import type { Metadata } from "next";
import QueryProvider from "../providers/reactQuery";
import "./globals.css";
import Sidebar from "../components/login/Sidebar";
import Header from "../components/login/Header";
export const metadata: Metadata = {
  title: "Swift Clinic",
  description: "Smart Clinic Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased">
      <body className="h-full">
        <QueryProvider>
          <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
               <Header />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
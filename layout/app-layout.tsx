"use client";

import Header from "./app-header";
import logo from "../public/techie-match-logo.svg";
import Image from "next/image";

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className={"min-h-svh flex flex-col overflow-hidden justify-between"}>
      <Header />
      <main className="flex-1 px-4 pb-24 bg-zinc-100">{children}</main>
      <footer className="flex-shrink-0 flex p-4 bg-zinc-700 justify-between text-sm text-white">
        &copy; 2025 TechiesMatch. All rights reserved.
        <Image src={logo} alt="logo" width={24} height={24} />
      </footer>
    </div>
  );
};

export default AppLayout;

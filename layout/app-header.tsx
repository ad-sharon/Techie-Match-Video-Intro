"use client";

import Image from "next/image";
import logo from "../public/techie-match-logo.svg";

const AppHeader = () => {
  return (
    <header className="px-4 pt-5 bg-zinc-100  flex items-center justify-between">
      <div className="flex justify-center items-center gap-2">
        <figure className="relative">
          <Image src={logo} alt="logo" width={24} height={24} />
        </figure>

        <h1 className="font-bold text-black-normal text-lg leading-[150%]">
          Techies
          <span className="text-red-normal">Match</span>
        </h1>
      </div>
    </header>
  );
};

export default AppHeader;

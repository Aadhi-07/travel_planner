"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import FeedbackSheet from "@/components/common/FeedbackSheet";
import Logo from "@/components/common/Logo";

import Link from "next/link";
import MobileMenu from "@/app/community-plans/MobileMenu";

const Header = () => {
  return (
    <header
      className={cn(
        "w-full border-b bottom-2 border-border/40 z-50 sticky top-0",
        "bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto">
        <div className="flex justify-evenly w-full">
          <Logo />

          <div className="md:hidden flex gap-6 flex-1">
            <MobileMenu />
          </div>
          <ul className="hidden md:flex gap-6 items-center text-sm">
            <li className="hover:underline hover:underline-offset-4 cursor-pointer">
              <Link href="/">Home</Link>
            </li>
            <SignedIn>
              <li className="hover:underline hover:underline-offset-4 cursor-pointer">
                <Link href="/dashboard">Dashboard</Link>
              </li>
            </SignedIn>
          </ul>
          <div className="flex gap-3 justify-end items-center flex-1">
            <SignedOut>
              <SignInButton mode="redirect" redirectUrl="/dashboard" />
            </SignedOut>

            <SignedIn>
              <div className="flex justify-center items-center gap-3">
                <FeedbackSheet />
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

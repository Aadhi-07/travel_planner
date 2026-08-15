"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Loading } from "@/components/shared/Loading";
import MobileMenu from "@/components/MobileMenu";
import PlanComboBox from "@/components/plan/PlanComboBox";
import { navlinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import { MapPinIcon } from "lucide-react";
import { ThemeDropdown } from "@/components/ThemeDropdown";
import FeedbackSheet from "@/components/common/FeedbackSheet";


const Header = () => {
  const { isCurrentPathDashboard, isCurrentPathHome, isAuthenticated } =
    useAuth();

  return (
    <header
      className={cn(
        "w-full z-50 sticky top-0 transition-all",
        isCurrentPathHome && "sticky top-0"
      )}
      style={{
        backgroundColor: "rgba(255, 253, 248, 0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(120, 90, 50, 0.12)",
      }}
    >
      <nav className="lg:px-20 px-5 py-3 mx-auto">
        <div className="flex justify-evenly w-full">
          <div className="hidden md:flex gap-10 items-center justify-start flex-1">
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <div className="flex gap-2 justify-center items-center">
                <MapPinIcon className="h-8 w-8 text-[#3B82F6]" />
                <div className="flex flex-col leading-5 font-bold text-xl text-[#171717]">
                  <span>Travel</span>
                  <span>
                    Planner
                    <span className="text-[#3B82F6] ml-0.5">AI</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex items-center flex-1 justify-center">
            <ul className="flex gap-8 items-center text-sm font-medium text-[#171717]">
              {isCurrentPathHome && (
                <>
                  {navlinks.map((link) => (
                    <li
                      key={link.id}
                      className="hover:text-[#3B82F6] transition-colors cursor-pointer"
                    >
                      <Link href={`/#${link.id}`}>{link.text}</Link>
                    </li>
                  ))}
                  <li className="hover:text-[#3B82F6] transition-colors cursor-pointer">
                    <Link href="dashboard" scroll>
                      Dashboard
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="md:hidden flex gap-6 flex-1">
            <MobileMenu
              isCurrentPathHome={isCurrentPathHome}
              isCurrentPathDashboard={isCurrentPathDashboard}
              isAuthenticated={isAuthenticated}
            />
          </div>
          <div className="flex gap-4 justify-end items-center flex-1">
            <SignedOut>
              <ThemeDropdown />
              <SignInButton mode="redirect" redirectUrl="/dashboard" />
            </SignedOut>
            <SignedIn>
              <div className="flex justify-center items-center gap-2">
                {!isCurrentPathDashboard && !isCurrentPathHome && (
                  <PlanComboBox />
                )}

                <FeedbackSheet />
                <ThemeDropdown />
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

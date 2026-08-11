import { redirect, usePathname } from "next/navigation";
import { useClerk, useAuth as useClerkAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const DASHBOARD_URL = "/dashboard";

const useAuth = () => {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const clerk = useClerk();

  const pathname = usePathname();

  const isCurrentPathDashboard = pathname === DASHBOARD_URL;
  const isCurrentPathHome = pathname === "/";

  const router = useRouter()

  const openSignInPopupOrDirect = () => {
    if (!isLoaded)
      return;
    if (!isSignedIn) {
      clerk.openSignIn({ afterSignInUrl: DASHBOARD_URL });
      return;
    }
    router.push("/dashboard")
  };
  return { isCurrentPathDashboard, isCurrentPathHome, openSignInPopupOrDirect, isAuthenticated: isSignedIn ?? false };
};

export default useAuth;

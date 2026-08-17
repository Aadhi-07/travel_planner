import { useConvexAuth } from "convex/react";
import { Compass } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="hidden md:flex gap-10 items-center justify-start flex-1">
      <Link href={isAuthenticated ? "/dashboard" : "/"}>
        <div className="flex gap-2 justify-center items-center">
          <Compass className="h-8 w-8 text-[#c86d51]" />
          <span className="font-extrabold text-2xl tracking-tight text-[#36271c]">
            Journo
          </span>
        </div>
      </Link>
    </div>
  );
}


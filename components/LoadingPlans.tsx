import { MapPinned } from "lucide-react";

export function LoadingPlans() {
  return (
    <section className="bg-background relative place-items-center grid h-[500px] w-full gap-4">
      <div className="bg-[#c86d51] w-48 h-48  absolute animate-ping rounded-full delay-5s shadow-xl opacity-30"></div>
      <div className="bg-[#e6a99a] w-32 h-32 absolute animate-ping rounded-full shadow-xl opacity-40"></div>
      <div className="bg-white w-24 h-24 flex gap-0.5 p-1 flex-col justify-center items-center absolute animate-pulse rounded-full shadow-xl">
        <MapPinned className="text-[#c86d51] h-10 w-10" />
        <span className="text-xs break-words text-center">Loading Plans</span>
      </div>
    </section>
  );
}

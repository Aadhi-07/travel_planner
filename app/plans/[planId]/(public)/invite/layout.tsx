import { getAuthToken } from "@/app/auth";
import Header from "@/components/plan/Header";
import PlanLayoutContent from "@/components/plan/PlanLayoutContent";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { planId: string };
}): Promise<Metadata> {
  const id = params.planId;
  const token = await getAuthToken();

  try {
    const plan = await fetchQuery(
      api.plan.getSinglePlan,
      { id: id as Id<"plan">, isPublic: true },
      { token }
    );

    const dest = plan?.nameoftheplace || "a secret trip";
    const title = `You're invited to ${dest}!`;
    const description = `Join us on an unforgettable journey to ${dest}. Check out the trip plan and pitch!`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: plan?.imageUrl ? [{ url: plan.imageUrl, alt: dest }] : [],
      },
    };
  } catch (error) {
    return {
      title: "Trip Invitation",
    };
  }
}

export default function InviteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { planId: string };
}) {
  return (
    <>
      <Header isPublic={true} />
      <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center bg-slate-950 text-slate-100">
        <PlanLayoutContent planId={params.planId} isPublic={true}>
          {children}
        </PlanLayoutContent>
      </main>
    </>
  );
}

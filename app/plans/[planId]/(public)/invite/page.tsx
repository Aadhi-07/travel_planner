import InvitePlanView from "@/components/plan/InvitePlanView";

export default async function InvitePage({ params }: { params: { planId: string } }) {
  return <InvitePlanView planId={params.planId} />;
}

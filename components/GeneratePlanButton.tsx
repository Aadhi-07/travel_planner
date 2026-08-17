"use client";
import {Button} from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

const GeneratePlanButton = () => {
  const {openSignInPopupOrDirect, isAuthenticated} = useAuth();
  return (
    <Button
      aria-label="generate plan"
      onClick={openSignInPopupOrDirect}
      variant="default"
      className="bg-[#c86d51] text-[#fdfbf7]
                 hover:bg-[#b55c41]
                  text-sm
                  font-semibold rounded-3xl"
    >
      {isAuthenticated ? "Go to Dashboard" : "Get Started"}
    </Button>
  );
};

export default GeneratePlanButton;

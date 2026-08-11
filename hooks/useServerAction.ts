import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";

type ServerAction<TArgs, TResult> = (args: TArgs) => Promise<TResult>;

interface UseServerActionOptions<TResult> {
  onSuccess?: (data: TResult) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string | null;
}

export function useServerAction<TArgs, TResult>(
  action: ServerAction<TArgs, TResult>,
  options?: UseServerActionOptions<TResult>
) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<unknown>(null);
  const { toast } = useToast();

  const execute = (args: TArgs) => {
    startTransition(async () => {
      setError(null);
      try {
        const result = await action(args);
        setData(result);
        
        if (options?.successMessage) {
          toast({
            title: "Success",
            description: options.successMessage,
          });
        }
        options?.onSuccess?.(result);
      } catch (err) {
        setError(err);
        if (options?.errorMessage !== null) {
          toast({
            variant: "destructive",
            title: "Something went wrong",
            description: options?.errorMessage || "An unexpected error occurred. Please try again.",
          });
        }
        options?.onError?.(err);
      }
    });
  };

  return { execute, isPending, data, error };
}

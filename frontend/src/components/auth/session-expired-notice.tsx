'use client';

import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function SessionExpiredNotice() {
  const router = useRouter();
  const { sessionExpired, acknowledgeSessionExpiry } = useAuth();

  if (!sessionExpired) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[320px] drop-shadow-2xl">
      <Alert variant="danger" className="flex flex-col gap-3 border border-danger/40 bg-background-surface/95 p-4">
        <div>
          <AlertTitle>Session expired</AlertTitle>
          <AlertDescription className="text-sm text-text-secondary">
            Your credentials timed out for security reasons. Sign back in to continue.
          </AlertDescription>
        </div>
        <Button
          size="sm"
          onClick={() => {
            acknowledgeSessionExpiry();
            router.push("/login");
          }}
        >
          Sign in again
        </Button>
      </Alert>
    </div>
  );
}

import { Suspense } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { PayClient } from "./PayClient";

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <PayClient />
    </Suspense>
  );
}

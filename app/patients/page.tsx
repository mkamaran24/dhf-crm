"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/leads?tab=patients");
  }, [router]);

  return null;
}

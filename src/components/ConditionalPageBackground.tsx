"use client";

import { usePathname } from "next/navigation";
import { PageBackground } from "@/components/PageBackground";

export function ConditionalPageBackground() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return <PageBackground blur={!isHome} />;
}

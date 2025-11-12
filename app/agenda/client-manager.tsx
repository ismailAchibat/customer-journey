"use client";

import dynamic from "next/dynamic";
// The path to EventManager is from the components/ui folder
import { EventManager } from "@/components/ui/event-manager"; 

// 1. Create a dynamic import for EventManager, disabling Server-Side Rendering (SSR)
// This fixes the Hydration Error by only running the calendar logic on the client
const DynamicEventManager = dynamic(
  () => Promise.resolve(EventManager), // Promise.resolve is used here because EventManager is a named export
  { ssr: false } 
);

export default function ClientManager() {
  // 2. Simply render the dynamically imported component
  return <DynamicEventManager />;
}
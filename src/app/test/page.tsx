"use client";

import { AvatarDebug } from "@/components/avatar-debug";
import { SimpleAvatarTest } from "@/components/simple-avatar-test";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Avatar Service Test</h1>
        <SimpleAvatarTest />
        <AvatarDebug />
      </div>
    </div>
  );
}

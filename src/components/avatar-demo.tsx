"use client";

import { useState } from "react";
import { SimpleAvatar } from "@/components/ui/simple-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const sampleNames = [
  "John Doe",
  "Jane Smith",
  "Michael Johnson",
  "Sarah Wilson",
  "David Brown",
  "Emily Davis",
  "Robert Miller",
  "Lisa Garcia",
  "James Rodriguez",
  "Maria Martinez",
];

export function AvatarDemo() {
  const [customName, setCustomName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Avatar Service Demo
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Custom Name Input */}
          <div className="space-y-2">
            <Label htmlFor="custom-name">Test Custom Name:</Label>
            <div className="flex gap-2">
              <Input
                id="custom-name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter a name to test..."
                className="flex-1"
              />
              <Button onClick={() => setCustomName("")} variant="outline" size="sm">
                Clear
              </Button>
            </div>
            {customName && (
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Small:</span>
                  <SimpleAvatar assigneeName={customName} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Medium:</span>
                  <SimpleAvatar assigneeName={customName} size="md" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Large:</span>
                  <SimpleAvatar assigneeName={customName} size="lg" />
                </div>
                <span className="text-sm text-gray-500 ml-4">&ldquo;{customName}&rdquo;</span>
              </div>
            )}
          </div>

          {/* Sample Names Grid */}
          <div className="space-y-3">
            <Label>Sample Assignees:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleNames.map((name, index) => (
                <div
                  key={`${name}-${refreshKey}-${index}`}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <SimpleAvatar assigneeName={name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State Demo */}
          <div className="space-y-2">
            <Label>Empty/Invalid States:</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Empty:</span>
                <SimpleAvatar assigneeName="" size="md" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Whitespace:</span>
                <SimpleAvatar assigneeName="   " size="md" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Single char:</span>
                <SimpleAvatar assigneeName="A" size="md" />
              </div>
            </div>
          </div>

          {/* Features Info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Avatar Service Features:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Generates consistent avatars based on assignee names</li>
              <li>• Uses DiceBear API for professional avatar images</li>
              <li>• Fallback to colored initials when images fail to load</li>
              <li>• Consistent color generation for each unique name</li>
              <li>• Caching for improved performance</li>
              <li>• Preloading support for better UX</li>
              <li>• Responsive design with multiple sizes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

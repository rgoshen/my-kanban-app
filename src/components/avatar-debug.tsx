"use client";

import { useState, useEffect } from "react";
import { AvatarService, AvatarData } from "@/lib/avatar-service";
import { EnhancedAvatar } from "@/components/ui/enhanced-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AvatarDebug() {
  const [testResults, setTestResults] = useState<
    {
      name: string;
      data: AvatarData | null;
      error: string | null;
    }[]
  >([]);
  const [isTesting, setIsTesting] = useState(false);

  const testNames = ["John Doe", "Jane Smith", "Bob Johnson"];

  const runTest = async () => {
    setIsTesting(true);
    setTestResults([]);

    for (const name of testNames) {
      try {
        console.log(`Testing avatar for: ${name}`);
        const data = await AvatarService.getAvatarData(name);
        console.log(`Avatar data for ${name}:`, data);

        setTestResults((prev) => [
          ...prev,
          {
            name,
            data,
            error: null,
          },
        ]);
      } catch (error) {
        console.error(`Error testing avatar for ${name}:`, error);
        setTestResults((prev) => [
          ...prev,
          {
            name,
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
          },
        ]);
      }
    }

    setIsTesting(false);
  };

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Avatar Service Debug
            <Button onClick={runTest} disabled={isTesting}>
              {isTesting ? "Testing..." : "Re-run Test"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{result.name}</h3>

              {result.error ? (
                <div className="text-red-600">Error: {result.error}</div>
              ) : result.data ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <EnhancedAvatar assigneeName={result.name} size="md" />
                    <div>
                      <p>
                        <strong>Initials:</strong> {result.data.initials}
                      </p>
                      <p>
                        <strong>Color:</strong> {result.data.color}
                      </p>
                      <p>
                        <strong>Image URL:</strong> {result.data.imageUrl || "None"}
                      </p>
                    </div>
                  </div>

                  {result.data.imageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Direct Image Test:</p>
                      <img
                        src={result.data.imageUrl}
                        alt={`Test for ${result.name}`}
                        className="w-10 h-10 border rounded-full"
                        onLoad={() => console.log(`Image loaded successfully for ${result.name}`)}
                        onError={(e) =>
                          console.error(`Image failed to load for ${result.name}:`, e)
                        }
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">No data available</div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

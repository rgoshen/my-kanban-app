"use client";

import { useState, useEffect } from "react";
import { AvatarService } from "@/lib/avatar-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SimpleAvatarTest() {
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    const testAvatarService = async () => {
      const testNames = ["John Doe", "Jane Smith", "Bob Johnson"];
      const results = [];

      for (const name of testNames) {
        try {
          console.log(`Testing direct avatar service for: ${name}`);
          const data = await AvatarService.getAvatarData(name);
          console.log(`Direct result for ${name}:`, data);

          results.push({
            name,
            data,
            success: true,
          });
        } catch (error) {
          console.error(`Direct test failed for ${name}:`, error);
          results.push({
            name,
            error: error instanceof Error ? error.message : "Unknown error",
            success: false,
          });
        }
      }

      setTestResults(results);
    };

    testAvatarService();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Direct Avatar Service Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="border rounded p-4">
                <h3 className="font-medium mb-2">{result.name}</h3>
                {result.success ? (
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
                    {result.data.imageUrl && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Direct Image:</p>
                        <img
                          src={result.data.imageUrl}
                          alt={`Test for ${result.name}`}
                          className="w-10 h-10 border rounded-full"
                          onLoad={() => console.log(`Direct image loaded for ${result.name}`)}
                          onError={(e) =>
                            console.error(`Direct image failed for ${result.name}:`, e)
                          }
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-red-600">Error: {result.error}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

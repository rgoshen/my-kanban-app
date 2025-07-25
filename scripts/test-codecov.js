#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🧪 Testing Codecov Integration");
console.log("==============================");

try {
  // Run tests with coverage
  console.log("📊 Running tests with coverage...");
  execSync("npm run test:coverage", { stdio: "inherit" });

  // Check if coverage files exist
  const coverageDir = path.join(process.cwd(), "coverage");
  const lcovFile = path.join(coverageDir, "lcov.info");

  if (fs.existsSync(lcovFile)) {
    console.log("✅ Coverage report generated successfully");
    console.log("📁 Coverage files:");

    const files = fs.readdirSync(coverageDir);
    files.forEach((file) => {
      const filePath = path.join(coverageDir, file);
      const stats = fs.statSync(filePath);
      const size = stats.isDirectory() ? "<DIR>" : `${(stats.size / 1024).toFixed(1)}KB`;
      console.log(`  ${file.padEnd(20)} ${size}`);
    });

    // Read and display coverage summary
    console.log("\n📈 Coverage summary:");
    const lcovContent = fs.readFileSync(lcovFile, "utf8");
    const lines = lcovContent.split("\n");

    let fileCount = 0;
    lines.forEach((line) => {
      if (
        line.startsWith("SF:") ||
        line.startsWith("LF:") ||
        line.startsWith("LH:") ||
        line.startsWith("BR:") ||
        line.startsWith("BH:")
      ) {
        if (line.startsWith("SF:")) fileCount++;
        if (fileCount <= 5) {
          // Show first 5 files
          console.log(`  ${line}`);
        }
      }
    });

    console.log("\n🔗 To upload to Codecov manually:");
    console.log("curl -s https://codecov.io/bash | bash -s -- -t $CODECOV_TOKEN");
  } else {
    console.log("❌ Coverage report not found");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Error running tests:", error.message);
  process.exit(1);
}

console.log("\n🎯 Next steps:");
console.log("1. Add CODECOV_TOKEN to GitHub repository secrets");
console.log("2. Push changes to trigger GitHub Actions");
console.log("3. Check Codecov dashboard for coverage reports");

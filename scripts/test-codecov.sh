#!/bin/bash

# Test Codecov integration locally
# This script helps verify that coverage reports are generated correctly

echo "🧪 Testing Codecov Integration"
echo "=============================="

# Run tests with coverage
echo "📊 Running tests with coverage..."
npm run test:coverage

# Check if coverage files exist
if [ -f "coverage/lcov.info" ]; then
    echo "✅ Coverage report generated successfully"
    echo "📁 Coverage files:"
    ls -la coverage/
    
    echo ""
    echo "📈 Coverage summary:"
    cat coverage/lcov.info | grep -E "^SF:|^LF:|^LH:|^BR:|^BH:" | head -10
    
    echo ""
    echo "🔗 To upload to Codecov manually:"
    echo "curl -s https://codecov.io/bash | bash -s -- -t \$CODECOV_TOKEN"
    
else
    echo "❌ Coverage report not found"
    exit 1
fi

echo ""
echo "🎯 Next steps:"
echo "1. Add CODECOV_TOKEN to GitHub repository secrets"
echo "2. Push changes to trigger GitHub Actions"
echo "3. Check Codecov dashboard for coverage reports" 
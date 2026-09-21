#!/bin/bash

# IP-SAKTI Sahayak - Quick Start Script
# Run this to set up the project in 2 minutes

echo "🚀 IP-SAKTI Ayurveda AI Assistant - Quick Setup"
echo "=================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Create project
PROJECT_NAME=${1:-ip-sakti}
echo "📦 Creating Next.js project: $PROJECT_NAME"
npx create-next-app@latest $PROJECT_NAME \
  --typescript \
  --tailwind \
  --use-npm \
  --app \
  --no-git \
  --no-install

cd $PROJECT_NAME

echo ""
echo "📚 Installing dependencies..."
npm install

echo ""
echo "📦 Installing UI libraries..."
npm install framer-motion lucide-react clsx tailwind-merge

echo ""
echo "✅ Creating utility file..."
mkdir -p lib
cat > lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

echo ""
echo "✅ Creating IP-SAKTI component..."
mkdir -p components
# Note: You'll need to copy ip-sakti-assistant.tsx manually or via curl

echo ""
echo "✅ Updating app/page.tsx..."
cat > app/page.tsx << 'EOF'
'use client'

// Import your IpSaktiAssistant component here
// import IpSaktiAssistant from '@/components/ip-sakti-assistant'

export default function Home() {
  return (
    <main>
      {/* <IpSaktiAssistant /> */}
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <p className="text-white text-center">
          <h1 className="text-3xl font-bold mb-4">IP-SAKTI Sahayak</h1>
          <p className="text-slate-400 mb-8">Paste the component code here...</p>
          <code className="text-xs bg-slate-800 p-4 rounded-lg block max-w-lg">
            Import IpSaktiAssistant from @/components/ip-sakti-assistant
          </code>
        </p>
      </div>
    </main>
  )
}
EOF

echo ""
echo "✅ Updating tailwind.config.ts..."
cat > tailwind.config.ts << 'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
EOF

echo ""
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Copy ip-sakti-assistant.tsx to components/"
echo "   → Paste the component code into: components/ip-sakti-assistant.tsx"
echo ""
echo "2. Update app/page.tsx"
echo "   → Uncomment the import and component"
echo ""
echo "3. Start dev server"
echo "   → npm run dev"
echo ""
echo "4. Open browser"
echo "   → http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   • Setup Guide: IP-SAKTI_SETUP_GUIDE.md"
echo "   • Advanced Features: ip-sakti-advanced-setup.md"
echo ""
echo "🎯 Built for SIH 2026 - IP-SAKTI Problem Statement #26045"
echo ""

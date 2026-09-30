#!/usr/bin/env bash
# Run once after installing Xcode from the App Store.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Checking Xcode..."
if ! xcodebuild -version >/dev/null 2>&1; then
  echo "ERROR: Xcode is not active. Install Xcode from the App Store, then run:"
  echo "  sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  echo "  sudo xcodebuild -license accept"
  exit 1
fi

xcodebuild -version

echo "==> Checking CocoaPods..."
if ! command -v pod >/dev/null 2>&1; then
  echo "ERROR: CocoaPods not found in PATH."
  echo "Install with: brew install cocoapods"
  exit 1
fi

pod --version

echo "==> Installing iOS pods..."
(cd ios/App && pod install)

echo "==> Building web assets and syncing Capacitor..."
npm run cap:sync

echo ""
echo "Done. Next steps:"
echo "  1. npm run cap:open"
echo "  2. In Xcode: App target → Signing & Capabilities → select your Team"
echo "  3. Connect iPhone → select device → Run (⌘R)"
echo ""
echo "For TestFlight / App Store: Product → Archive → Distribute App"

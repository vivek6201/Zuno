const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Block Node-only packages that must never enter the React Native bundle.
// These are server-side only (used in @repo/common's redis.ts) and will
// crash Metro if accidentally imported via the root @repo/common barrel.
const NODE_ONLY_MODULES = new Set(["ioredis", "net", "tls", "fs", "path", "os"]);

const originalResolver = config.resolver?.resolveRequest;
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    if (NODE_ONLY_MODULES.has(moduleName)) {
      // Return an empty module stub so Metro doesn't crash
      return { type: "empty" };
    }
    if (originalResolver) {
      return originalResolver(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

// Apply uniwind modifications before exporting
const uniwindConfig = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
});

module.exports = uniwindConfig;


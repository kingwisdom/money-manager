// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    rules: {
      // These React Compiler rules are too strict for this codebase's
      // straightforward data-fetching and portal/animation patterns.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  }
]);
// plugins/withProguardRules.js
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withProguardRules(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidAppDir = path.join(projectRoot, 'android', 'app');
      const proguardFilePath = path.join(androidAppDir, 'proguard-rules.pro');

      // ensure android/app directory exists (prebuild creates it, but safe-guard)
      try {
        fs.mkdirSync(androidAppDir, { recursive: true });
      } catch (err) {
        // ignore
      }

      // starter rules to append (you can customize)
      const rules = `
# >>> custom rules from expo config plugin
-keep class com.facebook.** { *; }
-keep class com.facebook.react.** { *; }
-keep class expo.modules.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**
# <<< end
`;

      // Append only if not already appended (basic idempotence)
      let current = '';
      try {
        current = fs.readFileSync(proguardFilePath, 'utf8');
      } catch (e) {
        // file might not exist — that's fine
      }

      if (!current.includes('# >>> custom rules from expo config plugin')) {
        fs.appendFileSync(proguardFilePath, rules, 'utf8');
        console.log('wrote proguard-rules.pro');
      } else {
        console.log('proguard-rules.pro already contains plugin rules; skipping append');
      }

      return config;
    },
  ]);
};

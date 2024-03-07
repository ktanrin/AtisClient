const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        win: {
          icon: 'src/assets/icon.png'
        },
        asarUnpack: ['server-setup-dialog.html'],
        // This is where you can configure Electron Builder to package additional files
        extraFiles: [
          {
            // Assuming 'server-setup-dialog.html' is directly in the 'public' folder
            from: 'public/server-setup-dialog.html',
            to: 'server-setup-dialog.html', // Copies the file to the root of the packaged app
          },
        ],
         // NSIS specific configuration
         nsis: {
          oneClick: false, // User must click through the installer
          allowToChangeInstallationDirectory: true, // Allow user to select install location
          perMachine: true, // Install for all users (requires elevation)
          // Include other NSIS options as needed
        },
      },
    },
  },
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false,
      },
    },
    node: {
      __dirname: true,
      __filename: true,
    },
    externals: {
      electron: 'electron',
    },
  },
});

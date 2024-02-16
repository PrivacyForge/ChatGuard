import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Chat Guard",
  description: "ChatGuard is a browser extension designed to make any messenger app to End to End encrypted",
  appearance: "dark",
  cleanUrls: true,
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/PrivacyForge/ChatGuard" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024 ChatGuard developers",
    },
  },
});

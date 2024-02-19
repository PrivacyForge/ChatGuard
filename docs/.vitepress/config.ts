import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Chat Guard",
  description: "ChatGuard is a browser extension designed to make any messenger app to End to End encrypted",
  appearance: "dark",
  cleanUrls: true,
  lang: "en-US",
  head: [["link", { rel: "icon", href: "../public/images/logo.svg" }]],
  themeConfig: {
    logo: "../public/images/logo.svg",
    siteTitle: "Chat Guard",
    nav: [
      { text: "Home", link: "/" },
      { text: "Download & Install", link: "/getting-started/installation" },
      { text: "Documentation", link: "/api" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          {
            text: "Installation",
            link: "/getting-started/installation",
          },
          {
            text: "How to use",
            link: "/getting-started/usage",
          },
        ],
      },
      {
        text: "Encryption",
        items: [
          { text: "Introduction", link: "/encryption/introduction" },
          { text: "(DRSAP) Encryption Process", link: "/encryption/process" },
        ],
      },
      {
        text: "API",
        collapsed: true,
        items: [
          { text: "ChatGuard", link: "/api/chat-guard" },
          { text: "Cipher", link: "/api/cipher" },
          { text: "DomManipulator", link: "/api/dom-manipulator" },
          { text: "Storage", link: "/api/storage" },
        ],
      },
      {
        text: "Contribution",
        collapsed: true,
        items: [
          { text: "Getting started", link: "/contribution/getting-started" },
          { text: "Branching", link: "/contribution/branching" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/PrivacyForge/ChatGuard" },
      { icon: "twitter", link: "" },
    ],

    footer: {
      message: "Released under the Apache-2.0 License.",
      copyright: "Copyright © 2024 ChatGuard developers",
    },
  },
});

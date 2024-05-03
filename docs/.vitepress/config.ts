import { defineConfig } from "vitepress";

export default defineConfig({
  title: "ChatGuard",
  description: "ChatGuard is a browser extension designed to enable End to End encryption to your favorite messenger",
  appearance: "dark",
  cleanUrls: true,
  lang: "en-US",
  head: [
    ["link", { rel: "icon", href: "/images/logo.svg" }],
    ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-J084XJ7N2C" }],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-J084XJ7N2C');`,
    ],
  ],
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    fa: {
      label: "فارسی",
      lang: "fa",
      link: "/fa",
    },
  },
  themeConfig: {
    logo: "/images/logo.svg",
    siteTitle: "Chat Guard",
    nav: [
      { text: "Home", link: "/" },
      { text: "Download & Install", link: "/getting-started/how-to-install" },
    ],
    sidebar: [
      {
        text: "Getting Started",
        items: [
          {
            text: "How to install",
            link: "/getting-started/how-to-install",
          },
          {
            text: "How to use",
            link: "/getting-started/how-to-use",
          },
        ],
      },
      {
        text: "Encryption",
        items: [{ text: "Introduction", link: "/encryption/introduction" }],
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

    socialLinks: [{ icon: "github", link: "https://github.com/PrivacyForge/ChatGuard" }],

    footer: {
      message: "Released under the Apache-2.0 License.",
      copyright: "Copyright © 2024 ChatGuard developers",
    },
  },
});

module.exports = {
  lang: "en-US",
  title: " ",
  description: "NativeScript docs",

  head: [
    ['link', { rel: 'stylesheet', href:'/styles.css' }]
  ],

  themeConfig: {
    repo: "NativeScript/docs-new",
    docsDir: ".",
    logo: "/assets/images/NativeScript_Logo_Wide_White_Blue_Rounded_Blue.png",

    editLinks: true,
    editLinkText: "Edit this page on GitHub",
    lastUpdated: "Last Updated",

    //   algolia: {
    //     apiKey: 'xxx',
    //     indexName: 'xxx'
    //   },

    nav: [
      {
        text: "Docs",
        link: "/",
        activeMatch: "^/",
      },
      {
        text: "Plugins",
        link: "/plugins/index",
        activeMatch: "^/plugins",
      },
      {
        text: "Capacitor",
        link: "https://capacitor.nativescript.org"
      },
      {
          text: 'Writing Guide',
          link: 'https://v3.vuejs.org/guide/contributing/writing-guide.html',
      }
    ],

    sidebar: {
      "/": getSidebar(),
    },
  },
};

function getSidebar() {
  return [
    {
        text: 'Setup',
        children: [
            { text: 'Introduction', link: '/introduction' },
            { text: 'Environment Setup', link: '/environment-setup' },
            { text: 'Development Workflow', link: '/development-workflow' }
        ]
    },
    {
      text: 'UI & Styling',
      children: [
          { text: 'UI & Styling', link: '/ui-and-styling' },
          { text: 'Interaction', link: '/interaction' },
      ]
    },
    {
      text: 'Networking & Security',
      children: [
          { text: 'Networking', link: '/networking' },
          { text: 'Security', link: '/security' },
      ]
    },
    {
      text: 'Performance',
      children: [
          { text: 'Performance', link: '/performance' },
      ]
    },
    {
      text: 'Advanced Concepts',
      children: [
          { text: 'Advanced Concepts', link: '/advanced-concepts' },
      ]
    },
    {
      text: 'Distribution',
      children: [
          { text: 'Releasing your app', link: '/releasing' },
      ]
    },
    {
      text: 'Troubleshooting',
      children: [
          { text: 'Common Pitfalls', link: '/common-pitfalls' }
      ]
    },
    {
      text: 'Plugins',
      children: [
        { text: 'Developing Plugins', link: '/developing-plugins' },
        { text: '-----------', link: '#' },
        { text: 'Background HTTP', link: '/plugins/background-http'},
        { text: 'Brightness', link: '/plugins/brightness'},
        { text: 'Camera', link: '/plugins/camera'},
        { text: 'DateTimePicker', link: '/plugins/datetimepicker'}
      ]
    }
  ];
}
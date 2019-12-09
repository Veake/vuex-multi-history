const apiSideBar = require('./api-sidebar.json');

const correctApiSideBar = apiSideBar.map((entry) => {
  if (!entry.children) {
    return entry;
  }
  const correctedChildren = entry.children.map((child) => {
    return `/api/${child}`;
  });
  return { ...entry, children: correctedChildren };
});

const env = process.env.NODE_ENV.trim();
const usedSidebar = env === 'production' ? apiSideBar : correctApiSideBar;
const base = env === 'production' ? '/vuex-multi-history/' : '/';

module.exports = {
  base,
  title: 'vuex-multi-history',
  description: 'A Vuex-plugin to allow undo, redo, etc for multiple histories',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Example', link: 'https://veake.github.io/vuex-multi-history/example' },
      { text: 'Github', link: 'https://github.com/veake/vuex-multi-history' },
    ],
    sidebar: [
      '/',
      '/guide/',
      {
        title: 'API',
        children: ['/api/', ...usedSidebar],
        sidebarDepth: 1,
      },
    ],
    sidebarDepth: 2,
  },
};

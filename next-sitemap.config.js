// import API from './lib/Api';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://jwstanly.com`,
  generateRobotsTxt: true, // (optional)
  // ...other options
  // transform: async (config, path) => {
  //   if (path.startsWith('/blog/article')) {
  //     const allArticles = await API.getAllPublishedArticles();
  //     const allArticleNames = allArticles.map(article => article.title);

  //     const articleName = path.split('/').pop();

  //     if (!allArticleNames.includes(articleName)) {
  //       return null;
  //     }
  //   }
  //   return config;
  // },
};

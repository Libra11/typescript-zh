/*
 * @Author: Libra
 * @Date: 2023-02-25 12:06:27
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /typescript-zh/docs/.vuepress/config.ts
 */
import { defaultTheme, defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
  lang: "zh-CN",
  title: "Typescript中文",
  description: "这是我的第一个 VuePress 站点",
  base: "/typescript-zh/",
  head: [["link", { rel: "icon", href: "/images/logo.png" }]],
  plugins: [
    // @ts-ignore
    searchProPlugin({
      resultHistoryCount: 7,
    }),
  ],
  theme: defaultTheme({
    home: "/",
    logo: "/images/logo.png",
    navbar: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/basic.md" },
    ],
    // 可折叠的侧边栏
    sidebar: {
      "/guide/": [
        {
          text: "指南",
          collapsible: true,
          children: [
            "/guide/basic.md",
            "/guide/everydayTypes.md",
            "/guide/narrowing.md",
            "/guide/moreOnFunctions.md",
            "/guide/objectTypes.md",
            {
              text: "类型操作",
              collapsible: true,
              children: [
                "/guide/creatingTypesfromTypes.md",
                "/guide/generics.md",
                "/guide/keyofTypeOperator.md",
                "/guide/typeofTypeOperator.md",
                "/guide/indexedAccessTypes.md",
                "/guide/conditionalTypes.md",
                "/guide/mappedTypes.md",
                "/guide/templateLiteralTypes.md",
              ],
            },
            "/guide/classes.md",
          ],
        },
      ],
    },
    sidebarDepth: 0,
  }),
});

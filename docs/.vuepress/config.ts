/*
 * @Author: Libra
 * @Date: 2023-02-25 12:06:27
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /typescript-zh/docs/.vuepress/config.ts
 */
import { defaultTheme, defineUserConfig } from "vuepress";

export default defineUserConfig({
  lang: "zh-CN",
  title: "Typescript中文",
  description: "这是我的第一个 VuePress 站点",
  base: "/typescript-zh/",
  theme: defaultTheme({
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
              text: "Advanced Types",
              collapsible: true,
              children: ["/guide/test.md"],
            },
          ],
        },
      ],
    },
    sidebarDepth: 0,
  }),
});

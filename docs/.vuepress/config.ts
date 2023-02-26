/*
 * @Author: Libra
 * @Date: 2023-02-25 12:06:27
 * @LastEditors: Libra
 * @Description:
 * @FilePath: \typescript-zh\docs\.vuepress\config.ts
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
          text: "Handbook",
          collapsible: true,
          children: ["/guide/basic.md", "/guide/everydayTypes.md"],
        },
      ],
    },
    sidebarDepth: 0,
  }),
});

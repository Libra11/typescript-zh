export const data = JSON.parse("{\"key\":\"v-8daa1a0e\",\"path\":\"/\",\"title\":\"指南\",\"lang\":\"zh-CN\",\"frontmatter\":{\"lang\":\"zh-CN\",\"title\":\"指南\",\"description\":\"页面的描述\"},\"headers\":[{\"level\":2,\"title\":\"Typescript 中文\",\"slug\":\"typescript-中文\",\"link\":\"#typescript-中文\",\"children\":[]}],\"git\":{},\"filePathRelative\":\"README.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}

# ThePilot (motto)

> 将本地化精选语句应用到 VS Code AI 思考提示语。

## 功能

本插件提供命令，将 **`chat.agent.thinking.phrases`** 用户设置替换为当前 VS Code 语言对应的精选语句。应用前会保存原有全局配置，恢复命令会优先还原之前的内容。

| 命令 | 说明 |
|------|------|
| `ThePilot：将精选语句应用到 AI 思考提示语` | 立即写入当前语言对应的语句到全局用户设置 |
| `ThePilot：恢复之前的 AI 思考提示语` | 恢复应用前保存的全局设置；如果没有保存值，则恢复 VS Code 默认值 |

## 编辑语句

打开 `src/phrases.ts`，在 `phrasesByLocale` 中维护各语言对应的语句数组：

```ts
export const phrasesByLocale: Record<SupportedLocale, string[]> = {
  "zh-cn": ["第一条简体中文语句"],
  "zh-tw": ["第一條繁體中文語句"],
  en: ["First English phrase"],
};
```

填写完毕后运行 `npm run compile` 重新编译，然后重启 VS Code 即可。

## 安装与使用

```bash
npm install
npm run compile
# 在 VS Code 中按 F5 启动扩展开发主机进行调试
# 或打包发布：npm run package
```

## 配置项

| 配置键 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `motto.autoApply` | boolean | `true` | 启动时自动应用语录 |


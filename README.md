# 红星领航 (motto)

> 用习近平新时代中国特色社会主义思想指引 AI 助手思考提示语，助力国企数字化转型。

## 功能

本插件在 VS Code 启动时自动将 **`chat.agent.thinking.phrases`** 用户设置替换为习近平语录，让 AI 助手在"思考"时展示鼓舞人心的金句。

| 命令 | 说明 |
|------|------|
| `红星领航：应用习近平语录到 AI 思考提示语` | 立即写入语录到全局用户设置 |
| `红星领航：恢复默认 AI 思考提示语` | 清除自定义值，恢复 VS Code 默认提示语 |

## 填充语录

打开 `src/phrases.ts`，将语录逐条填入 `phrases` 数组：

```ts
export const phrases: string[] = [
  "不忘初心，方得始终。",
  "撸起袖子加油干。",
  // ...更多语录
];
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


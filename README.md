# MATI 马格测试

2026 马年限定：测测你在工作和生活里是哪匹马。28 道题 · 16 种类型 · 4 张隐藏款 · 10 张彩蛋卡 · 中文 / English。

线上地址：https://zhouzhouwen.github.io/mati/

姐妹测试：[DOGTI 狗格测试](https://zhouzhouwen.github.io/dogti/) · [CITYTI 城格测试](https://zhouzhouwen.github.io/cityti/)（三个站共用同一套引擎 `assets/app.js` + `assets/style.css`）

## 常改的地方

| 想做的事 | 改哪里 |
| --- | --- |
| 关注二维码、收款码 | `assets/config.js` 的 `follow`、`tip`（图片放在 `assets/img/`） |
| “来看看其他测试吧” | `assets/config.js` 的 `more`（图标和二维码在 `assets/img/more/`） |
| 计数（完成次数、初代徽章、同款占比） | 已接 Cloudflare Worker + D1（`assets/config.js` 的 `counter.api`，三个测试共用，代码和说明在 dogti 仓库的 `worker/`）；连不上时自动改用「不蒜子」打开次数 |
| 百度统计 | `assets/config.js` 的 `baiduTongjiId` |
| 题目、16 种类型文案、组合、隐藏款、彩蛋、界面文字 | `assets/lang-zh.js`（中文）、`assets/lang-en.js`（英文） |
| 计分规则、隐藏款触发条件、默契值、参考文献 | `assets/core.js` |
| 插画（纯代码 SVG） | `assets/art.js` |
| 主题色 | `index.html` 里的 `--hero`、`--paper` |

## 本地预览

在这个文件夹里打开终端，运行：

```bash
python3 -m http.server 8000
```

然后浏览器打开 http://localhost:8000 。

## 更新上线

改完文件后，把改动的文件上传到 GitHub 仓库 `zhouzhouwen/mati`（网页上直接拖拽上传即可），1～2 分钟后自动生效。

## 版权

题目文案与插画为原创作品，保留所有权利；转载请注明出处。题目改写自公有领域 IPIP 题库；二维码生成：qrcode-generator（MIT）。

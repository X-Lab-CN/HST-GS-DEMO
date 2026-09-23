# HST-GS 项目页 · 第二版

在第一版的学术页面布局上，接入项目 docs 中的真实训练视频、26 组对比视角和实验图表。整个项目是无依赖的 HTML/CSS/JS，可直接打开 index.html，也可原样上传 GitHub Pages。第一版保留在相邻的 hst-gs-project 目录。

## 本版新增

- 训练视频：按数据集分组展示全部 13 个场景（Mip-NeRF 360 的 9 个、Tanks & Temples 的 2 个、Deep Blending 的 2 个）。每段视频为 10 秒，支持场景切换、原生播放、进度、全屏和对应视频下载。灰线是 AbsGS backbone，红线是 HST-GS。Garden 已使用 docs 中更新的视频及从该视频重新提取的预览图。
- 场景交互对比：Mip-NeRF 360 的 9 个场景、Tanks & Temples 的 2 个场景和 Deep Blending 的 2 个场景；每个场景 2 个视角。支持分隔线拖动、键盘滑块和原始左右拼图放大。
- 实验图切换：训练效率、SR 调度和渲染时间，共 3 张源图，均可放大。
- 保留方法总览、跨方法基准表、训练/渲染数字和 BibTeX。

## 素材来源

项目图表、视频原始目录：E:\当前事务\科研\硕士\方向\3D\模型\2026-NEW\HST-GS\docs。作者和表格数据以用户提供的当前稿件为准。本次只读取并复制项目资源，没有改动源文件；未公开的稿件 PDF 不包含在可部署目录中。

| 本版资源 | 对应源文件 | 用途 |
| --- | --- | --- |
| assets/media/*.mp4 | static/videos/train/*.mp4 | 全部 13 个场景训练视频；Truck、Train 的文件名在本页中统一为小写 |
| assets/media/*-poster.jpg | 对应视频的 9.8 秒画面 | 从各场景当前视频提取的预览图；Garden 已重新提取 |
| assets/scenes/ | static/images/qual/ | 26 张上下拼图；CSS 分别显示上半部 Backbone 与下半部 HST-GS |
| assets/pairs/ | static/images/tour/ | 26 张原始左右拼图，用于放大查看 |
| assets/plots/fig_perscene.png | 同名源图 | 逐场景训练加速与 PSNR 差异 |
| assets/plots/viz_e3_grid2x2_3seed.png | 同名源图 | 3-seed SR 调度消融 |
| assets/plots/viz_e4_warm_wall_speedup.png | 同名源图 | 预热后的逐场景渲染时间与加速 |
| assets/paper-overview.png、qualitative-comparison.png | 第一版从前一稿件提取的 Figure 1、3 | 论文总览和跨方法定性对比 |

## 数据与命名

- 5.13× 训练加速、60.9% Gaussian–tile 数量削减、1.80× RFR 渲染加速延续当前论文口径。
- 对比图中注释对应具体展示运行/视角，不是定量表中的 3-seed 均值。页面已区分。
- 源图中的 HTS 对应正文 HST；TFR / Full-TFR 对应 RFR / 完整 RFR。图片保持原样，图注解释映射。
- 训练总加速以 AbsGS backbone 为参考；SR 消融以 HST + 24-bit、No SR 为参考。图注区分两个分母。

## 素材取舍与待定稿内容

- bicycle_train.mp4 和 bicycle_poster.jpg 的图例仍写着 vanilla 3DGS，未采用；使用 train/bicycle.mp4 并重新取帧。
- fig_pareto.png 带有“fastest, lossless”强断言，与已报告质量变化不完全一致，未作为展示图。
- compare4_factor.png 展示不同训练配置间的旧版 native FPS 比较；本页优先使用当前同一模型上的 RFR/native 渲染实验图。
- 源 docs/index.html 使用旧标题和六位作者；当前提供的 PR.pdf 使用正式长标题和四位作者。页面署名、机构、通讯作者标记和 BibTeX 均以该稿件为准。
- 已移除 Read paper 和 Paper 按钮，稿件 PDF 也未打包。公开论文链接确定后再添加。本页 BibTeX 暂为 Preprint；录用后应补充正式刊物信息。
- 当前训练区提供源目录中全部 13 个场景视频。
- 具体资助及正式致谢可根据作者最终确认内容修改。

## 修改入口

- index.html：标题、作者、正文和 BibTeX。
- script.js：跨方法数据集对比表。
- media.js：实验图定义、场景/视角、拖动比较和放大查看。
- styles.css + media.css：基础样式和本版媒体布局。

## 发布与预览

将本目录的内容上传到 GitHub Pages 对应仓库的根目录或 /docs 目录。所有资源均为相对路径，已包含 .nojekyll，不需要依赖安装或构建。在仓库 Settings → Pages 选择相应分支和目录。

本地直接打开 index.html，或在本目录运行：

```powershell
python -m http.server 8000
```

然后打开 http://localhost:8000/。

## 已验证

在本地 Chrome 检查了 1440、390、320 像素宽度；13 个训练视频的切换与加载、26 个场景视角、3 组图表、鼠标拖动、键盘滑块、图片放大/Escape 关闭及 BibTeX 复制均通过，未出现页面脚本错误或整页横向溢出。

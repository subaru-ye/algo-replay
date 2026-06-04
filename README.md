# 算法复盘

个人算法刷题复盘管理工具，基于间隔重复策略自动安排复习计划，帮助巩固算法题目记忆。

## 功能

- **每日看板** — 展示当日需要复习的题目，完成复盘后更新掌握程度
- **题目管理** — 录入题号、题名、日期和掌握程度，支持编辑和删除
- **复习调度** — 根据掌握程度自动计算下次复习日期（间隔重复）
- **趋势图表** — 近 30 天刷题数量柱状图

### 掌握程度与复习间隔

| 等级 | 复习间隔 |
|------|----------|
| 完全不会 | 1 / 3 / 7 / 15 天后 |
| 差一点 | 2 / 5 / 10 天后 |
| 完美完成 | 无需复习 |

## 技术栈

- **框架**: React 18 + Vite 5
- **UI**: shadcn/ui（Radix UI + Tailwind CSS）
- **图表**: Recharts
- **路由**: React Router v6
- **数据**: localStorage（纯前端，无需后端）

## 快速开始

### 环境要求

Node.js >= 18

### 安装与启动

```bash
# 安装依赖
yarn

# 启动开发服务器
yarn dev
```

开发服务器默认运行在 `http://localhost:8080`。

### 构建

```bash
yarn build
```

产物输出到 `dist/` 目录。

## 项目结构

```
src/
├── main.jsx              # 入口
├── App.jsx               # 根组件，路由配置
├── hooks/
│   └── useProblems.js    # 数据层：CRUD + localStorage 持久化
├── lib/
│   ├── review.js         # 复习调度算法
│   └── utils.js          # 工具函数
├── pages/
│   ├── Index.jsx         # 每日看板
│   ├── ProblemList.jsx   # 全部题目
│   └── ProblemForm.jsx   # 录入/编辑题目
└── components/
    ├── Layout.jsx        # 导航布局
    ├── DateGroupCard.jsx # 日期分组卡片
    ├── AttemptBlocks.jsx # 刷题记录色块
    ├── MasteryBadge.jsx  # 掌握程度徽章
    ├── ReviewTrendChart.jsx # 趋势图表
    └── ui/               # shadcn/ui 组件库
```

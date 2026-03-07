# Explore UI 开发和发布指南

## 目录

- [环境准备](#环境准备)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [构建和发布](#构建和发布)
- [版本管理](#版本管理)
- [故障排除](#故障排除)

---

## 环境准备

### 前置要求

- **Node.js**: >= 20.x
- **pnpm**: >= 8.x

```bash
# 检查 Node.js 版本
node -v

# 检查 pnpm 版本
pnpm -v

# 如果未安装 pnpm
npm install -g pnpm
```

### 安装依赖

```bash
# 安装项目依赖
pnpm install
```

### Git 配置（可选）

```bash
# 配置 Git 远程仓库
git remote add origin https://github.com/jobsys/explore-ui.git
```

---

## 开发流程

### 启动开发服务器

```bash
pnpm run dev
```

- 默认端口：3000
- 自动开启 HMR（热模块替换）
- 支持本地 network 访问

### 创建新组件

1. 在 `components/` 目录下创建新组件文件夹
2. 编写组件代码和样式
3. 确保导出组件

### 创建新 Hook

1. 在 `hooks/` 目录下创建新的 hook 文件
2. 遵循 `useXxx` 命名规范
3. 在 `hooks/index.js` 中导出

### 创建新指令

1. 在 `directives/` 目录下创建新的指令文件
2. 在 `directives/index.js` 中导出

---

## 代码规范

### 代码检查

```bash
# 运行 oxlint 检查
pnpm run lint
```

### 代码格式化

```bash
# 格式化所有文件
pnpm run fmt

# 或使用 oxfmt 直接命令
oxfmt write
```

### 格式化配置 (.oxfmtrc.json)

| 配置项 | 值 | 说明 |
|--------|-----|------|
| lineWidth | 100 | 最大行宽 |
| indentWidth | 4 | 缩进空格数 |
| useTabs | false | 使用空格缩进 |
| quoteStyle | double | 双引号 |
| trailingComma | es5 | ES5 风格尾随逗号 |

### Lint 配置 (.oxlintrc.json)

- **correctness**: error - 正确性问题必须修复
- **perf**: warn - 性能问题警告
- **suspicious**: warn - 可疑代码警告
- **style**: off - 风格问题由格式化器处理

---

## 构建和发布

### 构建

```bash
# 生产环境构建
pnpm run build
```

构建输出：
- `dist/jobsys-explore.js` - ESM 格式
- `dist/jobsys-explore.cjs` - CommonJS 格式
- `dist/hooks.js` - Hooks 导出
- `dist/directives.js` - 指令导出

### 发布到 npm

#### 方式一：手动发布

```bash
# 1. 更新 package.json 中的 version
# 2. 提交并打标签
git add .
git commit -m "chore: release v1.0.0"
git tag v1.0.0

# 3. 推送代码和标签
git push origin main
git push origin v1.0.0

# 4. 发布到 npm
pnpm publish --no-git-checks
```

#### 方式二：GitHub Actions 自动发布

推送版本标签后自动发布：

```bash
# 打版本标签
git tag v1.0.0
git push origin v1.0.0
```

> **注意**: 需要在 GitHub 仓库的 Settings → Secrets and variables 中配置 `NPM_TOKEN`

### 获取 NPM Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 进入 Account Settings → Access Tokens
3. 创建新令牌（Automation 类型）
4. 将令牌添加到 GitHub Secrets

---

## 版本管理

### 版本号规范

遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)：

- **MAJOR.MINOR.PATCH** (例如：1.0.0)
- **Major**: 破坏性变更
- **Minor**: 新功能（向后兼容）
- **Patch**: Bug 修复（向后兼容）

### 发布流程

1. **开发阶段**: `x.x.x-alpha.0`, `x.x.x-beta.0`
2. **候选版本**: `x.x.x-rc.0`
3. **正式版本**: `x.x.x`

### 更新 peerDependencies

当 Vue 或其他核心依赖发布新版本时：

```bash
# 检查最新版本
npm view vue version
npm view vant version

# 更新 package.json
pnpm add -D vue@latest
```

---

## 故障排除

### pnpm install 失败

```bash
# 清除缓存
pnpm store prune

# 删除 node_modules 和 lock 文件
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 构建失败

```bash
# 检查 Node.js 版本（需要 >= 20）
node -v

# 清除缓存重新构建
rm -rf dist
pnpm run build
```

### Lint 报错

```bash
# 查看详细错误信息
pnpm run lint

# 自动修复（如果支持）
oxlint --fix
```

### 发布失败

```bash
# 检查 npm 登录状态
npm whoami

# 如果未登录
npm login

# 手动发布
pnpm publish --no-git-checks --access public
```

---

## 项目结构

```
explore-ui/
├── components/          # Vue 组件
├── business-components/ # 业务组件
├── hooks/              # Composable hooks
├── directives/         # Vue 指令
├── utils/              # 工具函数
├── playground/         # 开发测试目录
├── dist/               # 构建输出
├── .github/workflows/  # GitHub Actions
└── package.json        # 项目配置
```

---

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run build` | 生产构建 |
| `pnpm run lint` | 代码检查 |
| `pnpm run fmt` | 代码格式化 |
| `pnpm install` | 安装依赖 |
| `pnpm publish --no-git-checks` | 发布到 npm |

---

## 相关资源

- [Vite 文档](https://vite.dev/)
- [Vue 3 文档](https://vuejs.org/)
- [Oxlint 文档](https://oxc.rs/docs/guide/linter)
- [Oxfmt 文档](https://oxc.rs/docs/guide/formatter)
- [npm 发布指南](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

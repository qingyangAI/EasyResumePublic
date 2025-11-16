下面是 **可直接放入 GitHub 仓库根目录的 EasyResume 专用 `CONTRIBUTING.md`**。
风格严格遵循 GitHub 开源项目惯例，格式正式、专业、干净，不带我们平时聊天的口吻。

它包含：

* 开发规范
* 分支规范
* Commit 规范
* PR 规范
* 代码风格
* Issue 规范
* 本地环境与构建方式
* 自动化工具检查

复制即可使用。

---

# **CONTRIBUTING.md**

# Contributing to EasyResume

感谢你对 **EasyResume** 的贡献兴趣！
本项目致力于构建一个高可用、多模态、可编排的 Agent + Dataset + Workflow 平台。
为了保证代码质量与协作效率，请在提交代码前阅读以下规范。

---

## 1. 分支管理（Branch Strategy）

EasyResume 使用简化的 Git Flow：

```
main
│
├── release/*      发布分支（按需建立）
│
└── feature/*      个人或需求开发分支
```

规范如下：

* **main**

  * 永远保持可运行、可部署
  * 所有合并必须通过 Pull Request (PR)

* **feature/<description>**

  * 个人功能分支
  * 命名示例：

    * `feature/dataset-cleaning`
    * `feature/agent-tool-calling`

* **release/**（可选）

  * 大版本前准备
  * 由维护者统一创建

---

## 2. 提交信息规范（Commit Message Guideline）

本项目采用 **Conventional Commits** 规范。

提交格式：

```
<type>(scope): <summary>

<body>

<footer>
```

### 2.1 type（必填）

| 类型       | 说明        |
| -------- | --------- |
| feat     | 新功能       |
| fix      | Bug 修复    |
| refactor | 重构（功能不变）  |
| perf     | 性能优化      |
| style    | 代码格式（无逻辑） |
| docs     | 文档更新      |
| test     | 测试相关      |
| build    | 构建与依赖变更   |
| ci       | CI/CD 配置  |
| chore    | 其他无影响的修改  |
| revert   | 回滚        |

### 2.2 scope（可选但推荐）

推荐 scope：

```
agent, tools, workflow, ui, dataset,
clean, label, augment, synthesis,
api, service, vector, index, docs, config
```

示例：

```
feat(agent): 新增工具链调用调度器
fix(dataset): 修复 JSONL 去重逻辑
```

### 2.3 提交模板

仓库已提供 `.gitmessage` 模板。

启用方式：

```
git config commit.template .gitmessage
```

---

## 3. Pull Request 规范（PR Guidelines）

PR 统一流程：

1. 从 `feature/*` 分支提交
2. 提交前确保：

   * 本地构建通过
   * 单测通过（如适用）
   * lint / formatting 通过
3. PR 必须包含以下内容：

   * **变更摘要（Summary）**
   * **变更原因（Why）**
   * **修改内容（What）**
   * **是否存在破坏性变更**
   * **相关 Issue 编号（如有）**

示例 PR 描述模板：

```
## Summary
简述本次变更内容

## Why
说明变更的背景和原因

## What
- 改动点1
- 改动点2
- 改动点3

## Breaking Change
无 / 有（说明）

## Related Issues
#123
```

---

## 4. 代码风格规范（Code Style）

### 4.1 前端（Vue + VueFlow + ElementUI）

* 遵循 ESLint + Prettier 规则
* 使用组合式 API（Vue 3）
* 非特殊情况禁止写 `any`
* 组件按职责拆分
* 样式使用 `scoped` 或 Tailwind（如项目启用）
* 避免在组件内编写复杂逻辑（统一放入 service 层）

### 4.2 后端（Python + FastAPI）

* 遵循 PEP8
* 强制类型注释（type hints）
* 模块结构：

  ```
  api/
  service/
  core/
  models/
  utils/
  ```
* 更推荐依赖注入而不是全局变量
* 异步优先（async/await）

### 4.3 Agent/Workflow（LangGraph / Flowise / Airflow）

* 节点逻辑函数保持纯净（无副作用）
* 状态定义与输入参数必须结构化
* 禁止使用魔法数
* DAG 文件必须具备可解释性注释

---

## 5. Issue 规范（Issue Guidelines）

提交 Issue 时请注意：

* 标题明确问题/需求
* 选择正确的标签（bug/feature/docs/etc.）
* 提供复现步骤（如为 Bug）
* 提供期望结果与实际结果
* 附样例数据或截图（如适用）

Issue 模板示例：

```
### Description
问题或需求的描述

### Steps to Reproduce
1.
2.
3.

### Expected
期望的结果

### Actual
实际的结果

### Environment
- OS:
- Python:
- Node:
- Browser:

### Additional Info
其他补充内容
```

---

## 6. 本地开发环境（Local Development Setup）

### 6.1 后端（FastAPI）

```
uv venv
uv pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 6.2 前端（Vue3）

```
pnpm install
pnpm dev
```

### 6.3 Agent Workflow

* LangGraph 版本：见 `requirements.txt`
* Milvus / Chroma：使用 docker-compose 启动
* Flowise / Airflow：按对应目录说明

### 6.4 Lint & Format

前端：

```
pnpm lint
pnpm format
```

Python：

```
ruff check .
ruff format .
```

---

## 7. 自动化检查（Lint / Test / Commit）

### 7.1 Commitlint（提交规范检查）

仓库已启用 commitlint：

```
npx commitlint --edit $1
```

### 7.2 Husky Hook（Node 项目前端）

```
npx husky add .husky/commit-msg "npx commitlint --edit $1"
```

### 7.3 Python 项目 Lint

```
ruff check .
```

---

## 8. 贡献流程总结

1. Fork 仓库
2. 创建 `feature/*` 分支
3. 提交代码（遵循 commit 规范）
4. push 到远程
5. 创建 Pull Request
6. 通过 Review 后合并
7. 删除本地/远程 feature 分支（可选）

---

## 9. 行为准则（Code of Conduct）

请遵守社区友好原则：

* 尊重所有贡献者
* 理性讨论技术问题
* 欢迎建设性建议
* 禁止人身攻击、歧视、骚扰等行为

若有违规行为，请联系项目维护者处理。

---

# 欢迎贡献！

EasyResume 的目标是构建下一代智能体 + 数据集 + 工作流平台。
无论是修复 Bug、提交功能、改文档，或仅仅提出建议，都非常欢迎。
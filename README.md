# AI Classifier

[English](#english-version) | [中文](#中文版)

---

## <a id="english-version"></a> English Version

**AI Classifier** is a powerful AI-assisted plugin for Zotero. It enables intelligent batch classification of your papers with customizable prompts and provides comprehensive structure management features.

### Core Features

* **📂 Intelligent Classification**: AI reads paper titles, abstracts, and keywords, automatically categorizing them into folders based on configurable confidence thresholds
* **💾 Save/Restore Structure**: Save your current classification structure to backup, restore anytime
* **📤 Export Data**: Export paper titles, abstracts, or keywords to JSON
* **📥 Import Hierarchy**: Import folder structure from TXT file (clears existing)
* **🛑 Stop Classification**: Stop ongoing classification tasks at any time
* **🛡️ Privacy-First**: API Key saved locally, never uploaded to any server

### Menu Structure

```
AI Classifier
├── Set Log File Location
├── ─────────────────
├── Export: All Titles (JSON)
├── Export: All Abstracts (JSON)
├── Export: All Keywords (JSON)
├── ─────────────────
├── Save Current Structure
├── Restore Structure
├── Import Hierarchy from TXT
├── ─────────────────
├── LLM Model Classification
├── Stop Current Classification
├── Log Viewer
├── ─────────────────
└── Settings
    ├── API Configuration
    ├── Chat Test
    └── Prompt Configuration
```

### Installation

1. Download the latest `.xpi` file from Releases
2. Open Zotero, click `Tools` → `Add-ons`
3. Click the gear icon → `Install Add-on From File...`
4. Select the `.xpi` file and restart Zotero

### Configuration

1. Click `Tools` → `AI Classifier` → `Set Log File Location` to configure log saving path
2. Click `Tools` → `AI Classifier` → `Settings` → `API Configuration`
3. Enter your LLM API info (SiliconFlow, OpenAI, etc.):
   * **API URL**: e.g., `https://api.siliconflow.cn/v1/chat/completions`
   * **API Key**: Your secret key
   * **Model Name**: e.g., `Qwen/Qwen2.5-7B-Instruct`
4. Click `Test Connection`, then save

### Quick Start

1. **Create Hierarchy**: Create a TXT file with hierarchical structure (e.g., `1. Physics`, `1.1 Astrophysics`)
2. **Import**: Click `Import Hierarchy from TXT` to create folders
3. **Classify**: Select papers, click `LLM Model Classification`, choose target paths and set threshold
4. **Backup**: Click `Save Current Structure` to backup before major changes
5. **Stop**: Click `Stop Current Classification` to halt the task at any time

---

## <a id="中文版"></a> 中文版

**AI Classifier** 是一款为 Zotero 打造的强力 AI 辅助插件。支持可定制提示词的智能批量分类，提供完善的目录结构管理功能。

### 核心功能

* **📂 智能归类**：AI 阅读文献标题、摘要、关键词，按可配置置信度阈值自动归类
* **💾 保存/恢复结构**：保存当前分类结构备份，随时恢复
* **📤 导出数据**：导出文献标题、摘要或关键词为 JSON
* **📥 导入层级**：从 TXT 文件导入目录结构（清空现有）
* **🛑 停止归类**：随时中断正在进行的归类任务
* **🛡️ 隐私优先**：API Key 仅保存在本地

### 菜单结构

```
AI Classifier
├── 设置日志保存位置
├── ─────────────────
├── 导出：全库标题 (JSON)
├── 导出：全库摘要 (JSON)
├── 导出：全库关键词 (JSON)
├── ─────────────────
├── 保存当前分类结构
├── 恢复分类结构
├── 从 TXT 导入层级（清空重建）
├── ─────────────────
├── LLM 模型文献归类
├── 停止当前归类任务
├── 日志查看器
├── ─────────────────
└── 设置
    ├── API 参数配置
    ├── 对话测试
    └── 提示词配置
```

### 安装说明

1. 前往 Releases 下载最新 `.xpi` 文件
2. 打开 Zotero，点击 `工具` → `附加组件`
3. 点击齿轮图标 → `从文件安装附加组件`
4. 选中 `.xpi` 文件，重启 Zotero

### 配置指南

1. 点击 `工具` → `AI Classifier` → `设置日志保存位置` 配置日志保存路径
2. 点击 `工具` → `AI Classifier` → `设置` → `API 参数配置`
3. 填入 LLM 接口信息（如 SiliconFlow, OpenAI 等）：
   * **API URL**: 例如 `https://api.siliconflow.cn/v1/chat/completions`
   * **API Key**: 您的专属密钥
   * **Model Name**: 例如 `Qwen/Qwen2.5-7B-Instruct`
4. 点击 `测试连接`，确认后保存

### 快速上手

1. **创建层级**：创建 TXT 文件，包含层级结构（如 `1. Physics`, `1.1 Astrophysics`）
2. **导入目录**：点击 `从 TXT 导入层级` 创建文件夹
3. **智能归类**：选中文献，点击 `LLM 模型文献归类`，选择目标路径并设置置信度阈值
4. **备份**：重要操作前点击 `保存当前分类结构` 备份
5. **停止**：点击 `停止当前归类任务` 可随时中断任务

### 配置文件位置

配置文件保存在 Zotero 数据目录中：

| 文件 | 说明 |
|------|------|
| `zotero_ai_config.json` | API Key、模型、日志路径、提示词等配置 |

**配置文件路径**：
- Windows: `%APPDATA%\Zotero\zotero_ai_config.json`
- macOS: `~/Library/Application Support/Zotero/zotero_ai_config.json`
- Linux: `~/.config/zotero/zotero_ai_config.json`

---

### 关于作者

本项目由 **[Yeke qi](https://github.com/KeqiYe)** 开发。

基于 [MIT License](LICENSE) 开源。

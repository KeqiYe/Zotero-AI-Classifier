# 📚 Zotero AI Classifier

[English](#english-version) | [中文](#中文版)

---

## <a id="english-version"></a> English Version

**Zotero AI Classifier** is a powerful AI-assisted plugin designed for Zotero users. It extracts massive feature signals from your library, utilizes Large Language Models (LLM) to automatically build a rigorous hierarchical academic directory, and enables intelligent, batch classification of your papers.

Say goodbye to manual drag-and-drop, and let AI be your exclusive academic archivist!

### ✨ Core Features

* **🧠 Smart Directory Tree Generation**: Automatically extracts keyword features from your entire library and uses AI reasoning to generate a professional hierarchical directory with "vertical logic and horizontal mutual exclusivity" (supports custom multi-level depth).
* **📂 Automated Paper Classification**: Based on a multi-label classification mechanism, the AI reads the title, abstract, and keywords of the papers. Combined with a confidence threshold, it automatically and accurately places papers into the corresponding leaf node folders.
* **📊 Metadata & Structure Export**: Supports one-click export of paper metadata (JSON), library keywords (TXT), and directory tree structures, facilitating secondary academic data analysis.
* **🛡️ Privacy-First Local Operation**: Your API Key is saved strictly in your local Zotero data directory and will NEVER be uploaded to any third-party servers.

### 📦 Installation

1. Go to the [Releases](#) page and download the latest `zotero-ai-classifier.xpi` file.
2. Open Zotero, click on `Tools` -> `Add-ons` in the top menu bar.
3. Click the gear ⚙️ icon in the top right corner and select `Install Add-on From File...`.
4. Select the downloaded `.xpi` file and restart Zotero as prompted.

### ⚙️ Configuration

Before using the AI features, please configure your API:
1. In the Zotero top menu bar, click `Tools` -> `Zotero AI` -> `Settings: API Parameters & Connection Test`.
2. Enter your LLM interface information (e.g., SiliconFlow, OpenAI, or compatible formats):
   * **API URL**: e.g., `https://api.siliconflow.cn/v1/chat/completions`
   * **API Key**: Your exclusive secret key.
   * **Model Name**: e.g., `Qwen/Qwen2.5-7B-Instruct`
3. Click **🔌 Test Connection**, and click Save after confirming it is successful.

### 🚀 Quick Start

1. **Extract & Build**: Click `Zotero AI` -> `AI: Generate Hierarchy from Keywords`, input the maximum depth as prompted, and the plugin will generate the best directory scheme in the background and save it as a TXT file.
2. **Rebuild Library**: After confirming the generated TXT structure is correct, use `Danger: Clear and Rebuild Directory from TXT` to import it into the Zotero left sidebar (Note: This will clear old folder structures but will NOT delete papers).
3. **One-Click Classification**: Select the papers you want to classify in the main interface (multi-selection supported), click `Core: Smart Classification (Real-time Log)`, and the AI will automatically analyze and place the papers into the correct subfolders. Detailed local logs are provided for all operations.

### 👨‍💻 About the Author & License
This project is developed by **[Yeke qi](https://github.com/KeqiYe)**.
If this plugin saves you time in your research and literature management, please give it a ⭐ Star on GitHub! Your support is my greatest motivation to keep updating.

This project is licensed under the [MIT License](LICENSE).

---

## <a id="中文版"></a> 中文版

**Zotero AI Classifier** 是一款为 Zotero 用户打造的强力 AI 辅助插件。它能够提取你文库中的海量特征信号，利用大语言模型（LLM）自动构建严谨的学科层级目录，并实现文献的批量智能归类。

告别手动拖拽，让 AI 成为你的专属学术档案管理员！

### ✨ 核心功能

* **🧠 智能目录树生成**：自动提取全库文献的关键词特征，通过 AI 推理生成具备“纵向逻辑与横向互斥”的专业学科层级目录（支持多级深度自定义）。
* **📂 自动化文献分类**：基于多标签分类机制，AI 会阅读文献的标题、摘要与关键词，结合置信度阈值，自动将文献精准投放至对应的叶子节点文件夹。
* **📊 元数据与结构导出**：支持一键导出文献元数据 (JSON)、全库关键词 (TXT) 以及目录树结构，方便进行二次学术数据分析。
* **🛡️ 隐私优先的本地运行**：您的 API Key 仅保存在 Zotero 本地数据目录中，绝不会上传至任何第三方服务器。

### 📦 安装说明

1.  前往 [Releases](#) 页面下载最新版本的 `zotero-ai-classifier.xpi` 文件。
2.  打开 Zotero，点击顶部菜单栏的 `工具 (Tools)` -> `附加组件 (Add-ons)`。
3.  点击右上角的齿轮 ⚙️ 图标，选择 `Install Add-on From File... (从文件安装附加组件)`。
4.  选中下载的 `.xpi` 文件，按提示重启 Zotero 即可完成安装。

### ⚙️ 配置指南

在使用 AI 功能前，请先配置您的 API：
1. 在 Zotero 顶部菜单栏点击 `工具` -> `Zotero AI` -> `设置：API 参数与连接测试`。
2. 填入您使用的 LLM 接口信息（如 SiliconFlow, OpenAI 等兼容格式）：
   * **API URL**: 例如 `https://api.siliconflow.cn/v1/chat/completions`
   * **API Key**: 您的专属密钥
   * **Model Name**: 例如 `Qwen/Qwen2.5-7B-Instruct`
3. 点击 **🔌 测试连接**，确认无误后点击保存。

### 🚀 快速上手

1. **提取与构建**：点击 `Zotero AI` -> `AI：基于关键词生成层级结构`，按提示输入最大深度，插件将在后台生成最佳目录方案并保存为 TXT。
2. **重构文库**：确认生成的 TXT 结构无误后，使用 `危险：清空并根据TXT重构目录` 将其导入到 Zotero 左侧边栏（注意：此操作会清空旧文件夹结构，但不会删除文献）。
3. **一键归类**：在主界面选中需要归类的文献（支持多选），点击 `核心：智能归类 (实时日志)`，AI 将自动分析并将文献归入正确的子文件夹中。所有操作均提供详细的本地日志记录。

### 👨‍💻 关于作者与开源协议

本项目由 **[Yeke qi](https://github.com/KeqiYe)**. 开发。
如果这个插件帮您在科研与文献管理中节省了时间，欢迎在右上角点个 ⭐ Star！您的支持是我持续更新的最大动力。

* **反馈与建议**: 欢迎提交 Issue 或 Pull Request。

本项目基于 [MIT License](LICENSE) 开源。

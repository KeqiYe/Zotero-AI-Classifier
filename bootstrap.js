var zoteroAIPlugin;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const i18n = {
    setLogPath: "设置日志保存位置 (Set Log File Location)",
    exportTitles: "导出全库标题到指定json文件 (Export All Titles to JSON)",
    exportAbstracts: "导出全库摘要到指定json文件 (Export All Abstracts to JSON)",
    exportKeywords: "导出全库关键词到指定json文件 (Export All Keywords to JSON)",
    saveStructure: "保存当前分类结构（树+文献分类）到本地json文件 (Save Classification Structure)",
    restoreStructure: "从本地json文件恢复分类结构（树+文献分类） (Restore Classification Structure)",
    importHierarchy: "从本地txt文件导入分类树结构（清空现有树结构并重建） (Import Hierarchy from TXT)",
    startClassification: "LLM 模型文献归类 (LLM Model Classification)",
    stopClassification: "停止当前归类任务 (Stop Current Classification)",
    logViewer: "日志查看器 (Log Viewer)",
    settings: "设置 (Settings)",
    apiConfig: "API 参数配置 (API Configuration)",
    chatTest: "对话测试 (Chat Test)",
    promptConfig: "提示词配置 (Prompt Configuration)",
    stopSent: "🛑 已发送停止指令！\n正在等待当前这篇文献处理完毕后安全退出...\n\n🛑 Stop signal sent!\nWaiting for current item to finish...",
    noTaskRunning: "当前没有正在运行的归类任务。 (No classification task is currently running.)",
    logPathRequired: "为了保存后台运行记录，请先指定日志文件的保存位置。\n\nPlease set a log file location first to save background logs.",
    logPathSet: "✅ 日志保存位置已设置为:\n{path}\n\n✅ Log file location set to:\n{path}",
    loadConfigFailed: "AI Classifier: 加载配置失败 (Failed to load config)",
    saveConfigFailed: "保存配置失败: {error} (Failed to save config: {error})",
    noItems: "当前文库无文献 (No items in current library)",
    exporting: "处理中... (Exporting...)",
    exportComplete: "导出完成！已导出 {count} 条 (Export complete! Exported {count} items)",
    saveStructureTitle: "保存分类结构 (Save Classification Structure)",
    restoreConfirm: "【警告】此操作将清空当前所有分类结构并恢复备份，是否继续？\n\n⚠️ Warning: This will clear all current classification structure and restore from backup. Continue?",
    restoreTitle: "选择备份文件 (Select Backup File)",
    fileFormatError: "文件格式错误！ (File format error!)",
    restoring: "恢复分类结构进行中... (Restoring Classification Structure...)",
    stage1: "阶段 1/2: 正在清理并恢复目录层级... (Stage 1/2: Clearing and restoring collection hierarchy...)",
    stage1Complete: "阶段 1/2: 目录层级恢复完成！(共 {count} 个) (Stage 1/2: Collection hierarchy restored! ({count} collections))",
    stage2: "阶段 2/2: 正在恢复文献归类... (Stage 2/2: Restoring item classifications...)",
    stage2Complete: "阶段 2/2: 文献归类恢复完成！(共 {count} 篇) (Stage 2/2: Item classifications restored! ({count} items))",
    restoreComplete: "✅ 全部恢复成功！共重建 {collections} 个目录，归类 {items} 篇文献。\n\n✅ Restore complete! {collections} collections, {items} items classified.",
    importConfirm: "【警告】此操作将清空当前所有分类目录，是否继续？\n\n---\n【导入格式示例说明】\n请确保您的 TXT 文件内容符合以下格式：\n1 计算机科学\n1.1 人工智能\n1.1.1 深度学习\n2 天体物理\n\n---\n⚠️ Warning: This will clear all current collections. Continue?\n\nFormat Example:\n1 Computer Science\n1.1 AI\n1.1.1 Deep Learning\n2 Astrophysics",
    importTitle: "选择层级文件 (Select Hierarchy File)",
    importing: "导入层级 (Importing Hierarchy)",
    creatingDirs: "创建目录... (Creating directories...)",
    importComplete: "已创建 {count} 个目录 (Created {count} directories)",
    classificationTitle: "AI 智能归类设置 (AI Classification Settings)",
    classificationInfo: "即将对 <b>{count}</b> 篇文献进行智能归类。<br/>任务详情将静默输出至后台日志。\n\nAbout to classify <b>{count}</b> items. Task details will be saved to background log.",
    currentPath: "当前目标路径: 默认 (全库所有子类) (Current Target Path: Default - All Leaf Nodes)",
    selectPath: "选择/修改目标路径 (Select/Modify Target Path)",
    customPath: "当前目标路径: 已自定义选择 {count} 个子类 (Current Target Path: {count} custom leaf nodes selected)",
    maxCategories: "最大归类数量 (填 1 为单分类): (Max Categories (1 = single category):)",
    threshold: "置信度阈值 (0.0~1.0): (Confidence Threshold (0.0~1.0):)",
    cancel: "取消 (Cancel)",
    startClassificationBtn: "后台开始归类 (Start Classification - Background)",
    alertNoItems: "请先在主界面选中至少一篇论文！ (Please select at least one paper in the main window!)",
    alertNoApiKey: "请先在设置中配置 API Key！ (Please configure API Key in Settings first!)",
    alertNoFolders: "当前文库没有任何分类文件夹，无法归类！ (No collection folders in library! Cannot classify.)",
    classifying: "后台归类中 ({current}/{total}) (Classifying ({current}/{total}))",
    taskComplete: "后台任务已全部完成！日志已更新。 (Background task completed! Log updated.)",
    successCount: "成功: {success} 篇, 失败/跳过: {failed} (Success: {success}, Failed/Skipped: {failed})",
    logViewerTitle: "运行日志查看器 (Log Viewer)",
    logPathLabel: "当前文件: (Current file:)",
    refresh: "刷新 (Refresh)",
    close: "关闭 (Close)",
    apiConfigTitle: "API 参数配置 (API Configuration)",
    apiUrl: "API URL",
    apiKey: "API Key",
    modelName: "Model Name (模型名称)",
    testConnection: "测试连接 (Test Connection)",
    connectionSuccess: "✅ 测试成功！ (✅ Connection successful!)",
    connectionFailed: "❌ 测试失败: {error} (❌ Connection failed: {error})",
    save: "保存配置 (Save)",
    pathSelectionTitle: "选择需要归类的目标路径 (Select Target Paths for Classification)",
    hintNoSelection: "提示: 不勾选任何项则代表默认使用全部子类参与匹配。\n\nTip: No selection means using all leaf nodes.",
    confirmSelected: "确认选中 (Confirm)",
    cancelModify: "取消修改 (Cancel)",
    chatTestTitle: "对话测试 (Chat Test)",
    send: "发送 (Send)",
    waiting: "等待响应... (Waiting for response...)",
    promptConfigTitle: "提示词配置 - 分类文献 (Prompt Configuration - Classification)",
    promptHint: "可用变量: {title}, {keywords}, {abstract}, {pathList}, {max_categories}, {threshold}\n\nAvailable variables: {title}, {keywords}, {abstract}, {pathList}, {max_categories}, {threshold}",
    resetDefault: "恢复默认 (Reset Default)",
    promptSaved: "✅ 提示词已保存！ (✅ Prompt saved!)",
    ok: "确定 (OK)",
    error: "错误 (Error)",
    rateLimit: "[限流] 等待 {seconds}秒后重试 ({current}/{max})\n\n[Rate Limit] Waiting {seconds}s to retry ({current}/{max})",
    maxRetryExceed: "超过最大重试次数 (Max retry attempts exceeded)",
    systemStopped: "[系统] 用户中止任务，已停止处理 ([System] Task stopped by user)",
    okLog: "[OK] {title} -> {paths}",
    skipLog: "[SKIP] {title} -> 未找到完全合适路径 ([SKIP] {title} -> No suitable path found)",
    errorLog: "[ERROR] {title} -> {error}",
    taskStart: "========== 后台分类任务开始 [{time}] ==========\n\n========== Classification Task Started [{time}] ==========",
    taskSettings: "设置: 最大分类数={max}, 阈值={threshold}\n\nSettings: Max Categories={max}, Threshold={threshold}",
    taskItems: "文献数: {count}, 候选路径: {paths} 个\n\nItems: {count}, Candidate Paths: {paths}",
    taskEnd: "========== 任务结束 [{time}] 成功: {success} ==========\n\n========== Task Ended [{time}] Success: {success} =========="
};

class AIClassifier {
    constructor() {
        this.dbPath = null;
        this.configPath = null;
        this.config = {
            api_url: "https://api.siliconflow.cn/v1/chat/completions",
            api_key: "",
            model: "Qwen/Qwen2.5-7B-Instruct",
            log_path: "",
            prompt_classify: `你是一位精通**计算力学、天体物理与行星科学**的资深学术档案管理员。
请仔细分析以下论文的【标题】、【关键词】和【摘要】，并将其归类到给定的[叶子节点路径列表]中。

[待分类论文]:
标题: {title}
关键词: {keywords}
摘要: {abstract}

[叶子节点路径列表] (候选池):
{pathList}

[分类决策规则 - 请严格执行]:
1. **分类数量限制**: 最多只允许选择 **{max_categories}** 个最匹配的路径。
   - 不要强行凑数，一切以内容匹配度为准，最多匹配 {max_categories} 个。

2. **严格置信度过滤 (Confidence Threshold)**: 
   - 对于每一个候选路径，请评估其匹配度 (0.0 - 1.0)，1.0 代表非常匹配，0.0 代表不匹配。
   - **仅保留**那些置信度严格大于 **{threshold}** 的路径。
   - 如果某路径仅仅是"沾边"或"提及"，但不是论文的核心研究点，请**不要**选择。
   - **重要**：如果没有任何路径的置信度超过 {threshold}，请直接返回空数组，不要强行归类。

3. **格式规范**: 
   - 返回的路径字符串必须与[叶子节点路径列表]中的内容**完全一致**（包括空格、符号）。
   - 不要截断路径，不要只返回最后一部分。

[输出格式]:
请仅返回纯 JSON 数据，不要包含 Markdown 标记：
{"paths": ["完整路径字符串A", "完整路径字符串B"]} 
或者如果没有匹配项：
{"paths": []}`
        };
        this.defaultPromptClassify = this.config.prompt_classify;
        this.mainMenu = null;
        
        this.isClassifying = false; 
        this.cancelClassification = false; 
    }

    tr(key, params = {}) {
        let text = i18n[key] || key;
        Object.keys(params).forEach(k => {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
        });
        return text;
    }

    stopClassification(win) {
        if (this.isClassifying) {
            this.cancelClassification = true;
            this.showAlert(win, this.tr("stopSent"));
        } else {
            this.showAlert(win, this.tr("noTaskRunning"));
        }
    }
    // ==========================================================
    // Zotero 7/8 专属底层弹窗与文件选择器辅助函数
    // ==========================================================
    showAlert(win, msg) {
        Services.prompt.alert(win, "AI Classifier", msg);
    }

    showConfirm(win, msg) {
        return Services.prompt.confirm(win, "AI Classifier", msg);
    }

    showPrompt(win, msg, defaultValue = "") {
        let input = { value: defaultValue };
        let ok = Services.prompt.prompt(win, "AI Classifier", msg, input, null, { value: 0 });
        return ok ? input.value : null;
    }

    async pickFile(win, title, mode, filters, defaultString = "") {
        const nsIFilePicker = Components.interfaces.nsIFilePicker;
        const fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
        
        let fpTarget = win.browsingContext ? win.browsingContext : win;
        fp.init(fpTarget, title, mode);
        
        for (let filter of filters) {
            fp.appendFilter(filter.title, filter.ext);
        }
        if (defaultString) fp.defaultString = defaultString;

        let rv = await new Promise(resolve => {
            fp.open({ done: result => resolve(result) });
        });

        if (rv === nsIFilePicker.returnOK || rv === nsIFilePicker.returnReplace) {
            return fp.file.path;
        }
        return null;
    }
    // ==========================================================

    async init() {
        this.dbPath = PathUtils.join(Zotero.DataDirectory.dir, "zotero_ai_db.json");
        this.configPath = PathUtils.join(Zotero.DataDirectory.dir, "zotero_ai_config.json");
        await this.loadConfig();
    }

    async loadConfig() {
        try {
            if (await IOUtils.exists(this.configPath)) {
                let data = await IOUtils.readUTF8(this.configPath);
                this.config = Object.assign(this.config, JSON.parse(data));
            }
        } catch (e) { Zotero.debug(this.tr("loadConfigFailed")); }
    }

    async saveConfig() {
        try { 
            await IOUtils.writeUTF8(this.configPath, JSON.stringify(this.config, null, 2)); 
        } catch (e) { 
            let win = Zotero.getMainWindow();
            if (win) {
                Services.prompt.alert(win, "AI Classifier", this.tr("saveConfigFailed", { error: e.message }));
            }
        }
    }

    async checkLogPath(win) {
        if (!this.config.log_path) {
            this.showAlert(win, this.tr("logPathRequired"));
            return await this.setLogPath(win);
        }
        return true;
    }

    async setLogPath(win) {
        let path = await this.pickFile(win, this.tr("setLogPath"), Components.interfaces.nsIFilePicker.modeSave, [{title: "Text", ext: "*.txt"}, {title: "Log", ext: "*.log"}], "AI_Classifier.log");
        if (path) {
            this.config.log_path = path;
            await this.saveConfig();
            this.showAlert(win, this.tr("logPathSet", { path: path }));
            return true;
        }
        return false;
    }

    async appendLog(text) {
        let logPath = this.config.log_path;
        if (!logPath) return;
        try {
            let content = "";
            if (await IOUtils.exists(logPath)) {
                content = await IOUtils.readUTF8(logPath);
            }
            await IOUtils.writeUTF8(logPath, content + text);
        } catch (e) {
            Zotero.debug("AI Classifier: Log write failed - " + e.message);
        }
    }

    async fetchWithRetry(url, options, maxRetries = 5) {
        let retryCount = 0;
        let baseDelay = 1000;

        while (retryCount < maxRetries) {
            try {
                let response = await fetch(url, options);

                if (response.status === 429) {
                    retryCount++;
                    let delay = baseDelay * Math.pow(2, retryCount);
                    await this.appendLog(this.tr("rateLimit", { seconds: delay/1000, current: retryCount, max: maxRetries }) + "\n");
                    await sleep(delay);
                    continue;
                }

                return response;
            } catch (e) {
                retryCount++;
                if (retryCount >= maxRetries) throw e;
                let delay = baseDelay * Math.pow(2, retryCount);
                await sleep(delay);
            }
        }
        throw new Error(this.tr("maxRetryExceed"));
    }

    injectMenu(win) {
        let toolsMenu = win.document.getElementById('menu_ToolsPopup');
        if (!toolsMenu) return;

        let existing = win.document.getElementById('ai-classifier-main-menu');
        if (existing) existing.remove();

        this.mainMenu = win.document.createXULElement('menu');
        this.mainMenu.setAttribute('id', 'ai-classifier-main-menu');
        this.mainMenu.setAttribute('label', 'AI Classifier');

        let menuPopup = win.document.createXULElement('menupopup');

        let createMenuItem = (label, command, style = '') => {
            let item = win.document.createXULElement('menuitem');
            item.setAttribute('label', label);
            if (style) item.setAttribute('style', style);
            item.addEventListener('command', command);
            return item;
        };

        menuPopup.appendChild(createMenuItem(this.tr("setLogPath"), () => this.setLogPath(win)));
        menuPopup.appendChild(win.document.createXULElement('menuseparator'));

        menuPopup.appendChild(createMenuItem(this.tr("exportTitles"), () => this.exportItems(win, 'title')));
        menuPopup.appendChild(createMenuItem(this.tr("exportAbstracts"), () => this.exportItems(win, 'abstract')));
        menuPopup.appendChild(createMenuItem(this.tr("exportKeywords"), () => this.exportItems(win, 'keywords')));

        menuPopup.appendChild(win.document.createXULElement('menuseparator'));

        menuPopup.appendChild(createMenuItem(this.tr("saveStructure"), () => this.saveClassificationStructure(win)));
        menuPopup.appendChild(createMenuItem(this.tr("restoreStructure"), () => this.restoreClassificationStructure(win)));
        menuPopup.appendChild(createMenuItem(this.tr("importHierarchy"), () => this.importHierarchyFromTXT(win)));

        menuPopup.appendChild(win.document.createXULElement('menuseparator'));

        menuPopup.appendChild(createMenuItem(this.tr("startClassification"), () => this.startSmartClassification(win)));
        menuPopup.appendChild(createMenuItem(this.tr("stopClassification"), () => this.stopClassification(win), 'color: red; font-weight: bold;'));

        menuPopup.appendChild(createMenuItem(this.tr("logViewer"), () => this.showLogViewer(win)));

        menuPopup.appendChild(win.document.createXULElement('menuseparator'));

        let settingsMenu = win.document.createXULElement('menu');
        settingsMenu.setAttribute('label', ' ' + this.tr("settings"));
        let settingsPopup = win.document.createXULElement('menupopup');
        settingsPopup.appendChild(createMenuItem(this.tr("apiConfig"), () => this.openConfigDialog(win)));
        settingsPopup.appendChild(createMenuItem(this.tr("chatTest"), () => this.openChatTestDialog(win)));
        settingsPopup.appendChild(createMenuItem(this.tr("promptConfig"), () => this.openPromptConfigDialog(win)));
        settingsMenu.appendChild(settingsPopup);
        menuPopup.appendChild(settingsMenu);

        this.mainMenu.appendChild(menuPopup);
        toolsMenu.appendChild(this.mainMenu);
    }

    async exportItems(win, type) {
        let libraryID = Zotero.Libraries.userLibraryID;
        let s = new Zotero.Search();
        s.libraryID = libraryID;
        s.addCondition('itemType', 'isNot', 'attachment');
        s.addCondition('itemType', 'isNot', 'note');
        let itemIDs = await s.search();
        if (itemIDs.length === 0) { this.showAlert(win, this.tr("noItems")); return; }

        let typeName = type === 'title' ? '标题 / titles' : 
                       type === 'abstract' ? '摘要 / abstracts' : 
                       '关键词 / keywords';
        let titleStr = '导出全库 / Export All ' + typeName;
        let savePath = await this.pickFile(win, titleStr, Components.interfaces.nsIFilePicker.modeSave, [{title: "JSON", ext: "*.json"}], `Zotero_${type}s.json`);
        if (!savePath) return;

        let pw = new Zotero.ProgressWindow({ closeOnClick: false });
        pw.changeHeadline(titleStr);
        pw.show();
        let progress = new pw.ItemProgress("chrome://zotero/skin/tick.png", this.tr("exporting"));

        let items = await Zotero.Items.getAsync(itemIDs);
        let exportData = [];

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let data = { itemID: item.key };

            if (type === 'title') {
                data.title = item.getField('title') || "";
            } else if (type === 'abstract') {
                data.abstract = item.getField('abstractNote') || "";
            } else if (type === 'keywords') {
                data.keywords = item.getTags().map(t => t.tag);
            }

            exportData.push(data);
            if (i % 50 === 0) { progress.setProgress((i / items.length) * 100); await sleep(5); }
        }

        await IOUtils.writeUTF8(savePath, JSON.stringify(exportData, null, 2));
        progress.setProgress(100); progress.setText(this.tr("exportComplete", { count: items.length })); 
        pw.addDescription(this.tr("exportComplete", { count: items.length })); 
        pw.startCloseTimer(3000);
    }

    async saveClassificationStructure(win) {
        let libraryID = Zotero.Libraries.userLibraryID;
        let allCols = Zotero.Collections.getByLibrary(libraryID);
        let treeLines = []; let idMap = {};
        let rootCols = allCols.filter(c => !c.parentID);
        const traverse = (col, prefix, parentId) => {
            let id = col.id;
            idMap[id] = { name: col.name, parentId: parentId, path: prefix ? prefix + " / " + col.name : col.name };
            treeLines.push({ id: id, name: col.name, parentId: parentId, fullPath: idMap[id].path });
            let children = Zotero.Collections.getByParent(col.id, libraryID);
            for (let child of children) traverse(child, idMap[id].path, id);
        };
        for (let col of rootCols) traverse(col, "", null);

        let allItems = [];
        let s = new Zotero.Search();
        s.libraryID = libraryID; s.addCondition('itemType', 'isNot', 'attachment'); s.addCondition('itemType', 'isNot', 'note');
        let itemIDs = await s.search(); let items = await Zotero.Items.getAsync(itemIDs);
        for (let item of items) {
            let collections = item.getCollections();
            let colPaths = collections.map(cid => {
                let col = Zotero.Collections.get(cid);
                return col ? (idMap[cid] ? idMap[cid].path : col.name) : null;
            }).filter(p => p);
            allItems.push({ itemID: item.key, collections: colPaths });
        }

        let savePath = await this.pickFile(win, this.tr("saveStructureTitle"), Components.interfaces.nsIFilePicker.modeSave, [{title: "JSON", ext: "*.json"}], "classification_backup.json");
        if (!savePath) return;

        let saveData = { version: "1.0", saveTime: new Date().toISOString(), tree: treeLines, itemMappings: allItems };
        await IOUtils.writeUTF8(savePath, JSON.stringify(saveData, null, 2));
        if (this.config.log_path) await this.appendLog(`[${new Date().toLocaleString()}] 保存分类结构: ${treeLines.length} 个目录, ${allItems.length} 篇文献\n`);
        this.showAlert(win, `✅ 保存成功！\n目录数: ${treeLines.length}\n文献数: ${allItems.length}`);
    }

    async restoreClassificationStructure(win) {
        if (!this.showConfirm(win, this.tr("restoreConfirm"))) return;
        let openPath = await this.pickFile(win, this.tr("restoreTitle"), Components.interfaces.nsIFilePicker.modeOpen, [{title: "JSON", ext: "*.json"}]);
        if (!openPath) return;
        let fileContent = await IOUtils.readUTF8(openPath);
        let saveData;
        try { saveData = JSON.parse(fileContent); } catch (e) { this.showAlert(win, this.tr("fileFormatError")); return; }

        let pw = new Zotero.ProgressWindow({ closeOnClick: false });
        pw.changeHeadline(this.tr("restoring"));
        pw.show();

        let prog1 = new pw.ItemProgress("chrome://zotero/skin/treeitem-collection.png", this.tr("stage1"));
        prog1.setProgress(0);

        let libraryID = Zotero.Libraries.userLibraryID;
        let allCols = Zotero.Collections.getByLibrary(libraryID);
        for (let i = 0; i < allCols.length; i++) {
            let col = allCols[i];
            try { await col.eraseTx(); } catch (e) {}
            await sleep(20); 
        }

        let newIdMap = {};
        let totalNodes = saveData.tree.length;
        for (let i = 0; i < totalNodes; i++) {
            let node = saveData.tree[i];
            let col = new Zotero.Collection();
            col.name = node.name; col.libraryID = libraryID;
            if (node.parentId) {
                let parentNode = saveData.tree.find(n => n.id === node.parentId);
                if (parentNode && newIdMap[parentNode.id]) col.parentID = newIdMap[parentNode.id];
            }
            await col.saveTx(); newIdMap[node.id] = col.id;
            await sleep(20); 
            
            if (i % 5 === 0 || i === totalNodes - 1) {
                prog1.setProgress(((i + 1) / totalNodes) * 100);
            }
        }
        prog1.setProgress(100);
        prog1.setText(this.tr("stage1Complete", { count: totalNodes }));

        let prog2 = new pw.ItemProgress("chrome://zotero/skin/document.png", this.tr("stage2"));
        prog2.setProgress(0);

        let s = new Zotero.Search();
        s.libraryID = libraryID; s.addCondition('itemType', 'isNot', 'attachment'); s.addCondition('itemType', 'isNot', 'note');
        let itemIDs = await s.search(); let items = await Zotero.Items.getAsync(itemIDs);

        let itemMap = {}; for (let item of items) itemMap[item.key] = item;

        let mappedCount = 0;
        let totalMappings = saveData.itemMappings.length;
        
        for (let i = 0; i < totalMappings; i++) {
            let mapping = saveData.itemMappings[i];
            let item = itemMap[mapping.itemID];
            if (item) {
                let targetIds = [];
                for (let path of mapping.collections) {
                    let node = saveData.tree.find(n => n.fullPath === path);
                    if (node && newIdMap[node.id]) targetIds.push(newIdMap[node.id]);
                }
                if (targetIds.length > 0) {
                    item.setCollections(targetIds); await item.saveTx(); mappedCount++;
                }
            }
            await sleep(10); 
            
            // 实时更新阶段 2 进度
            if (i % 10 === 0 || i === totalMappings - 1) {
                prog2.setProgress(((i + 1) / totalMappings) * 100);
            }
        }
        prog2.setProgress(100);
        prog2.setText(this.tr("stage2Complete", { count: mappedCount }));

        if (this.config.log_path) await this.appendLog(`[${new Date().toLocaleString()}] 恢复分类结构 / Restore classification: ${mappedCount} 篇文献 / items\n`);
        
        pw.addDescription(this.tr("restoreComplete", { collections: totalNodes, items: mappedCount }));
        pw.startCloseTimer(5000); 
    }

    async importHierarchyFromTXT(win) {
        let msg = this.tr("importConfirm");

        if (!this.showConfirm(win, msg)) return;

        let openPath = await this.pickFile(win, this.tr("importTitle"), Components.interfaces.nsIFilePicker.modeOpen, [{title: "TXT", ext: "*.txt"}]);
        if (!openPath) return;

        let fileContent = await IOUtils.readUTF8(openPath);
        let lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");

        let libraryID = Zotero.Libraries.userLibraryID;
        let allCols = Zotero.Collections.getByLibrary(libraryID);
        for (let col of allCols) { try { await col.eraseTx(); } catch (e) {} await sleep(50); }

        let idMap = {};
        let pw = new Zotero.ProgressWindow({ closeOnClick: false });
        pw.changeHeadline(this.tr("importing")); pw.show();
        let progress = new pw.ItemProgress("chrome://zotero/skin/tick.png", this.tr("creatingDirs"));

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            let match = line.match(/^([\d\.]+)(?:\s|\.)+(.*)/);
            if (!match) continue;

            let numberId = match[1].endsWith('.') ? match[1].slice(0, -1) : match[1];
            let name = match[2].trim();

            let parentID = undefined;
            let lastDotIndex = numberId.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                let parentNumberId = numberId.substring(0, lastDotIndex);
                if (idMap[parentNumberId]) parentID = idMap[parentNumberId];
            }

            let col = new Zotero.Collection();
            col.name = name; col.libraryID = libraryID;
            if (parentID) col.parentID = parentID;

            await col.saveTx(); idMap[numberId] = col.id; await sleep(30);
            if (i % 5 === 0) progress.setProgress((i / lines.length) * 100);
        }

        progress.setProgress(100); progress.setText(this.tr("importComplete", { count: Object.keys(idMap).length }));
        pw.addDescription(this.tr("importComplete", { count: Object.keys(idMap).length })); pw.startCloseTimer(3000);
        if (this.config.log_path) await this.appendLog(`[${new Date().toLocaleString()}] 从TXT导入层级 / Import from TXT: ${Object.keys(idMap).length} 个目录 / directories\n`);
    }

    getCollectionMap(targetLibraryID) {
        let libraryID = targetLibraryID || Zotero.Libraries.userLibraryID;
        let allCollections = Zotero.Collections.getByLibrary(libraryID);
        let rootCollections = allCollections.filter(c => !c.parentID);
        let map = {}; let list = [];
        let visited = new Set();

        const traverse = (col, currentPath) => {
            if (visited.has(col.id)) return;
            visited.add(col.id);

            let fullPath = currentPath ? (currentPath + " / " + col.name) : col.name;
            let children = Zotero.Collections.getByParent(col.id, libraryID);
            if (children && children.length > 0) {
                for (let child of children) traverse(child, fullPath);
            } else {
                if (!map[fullPath]) {
                    map[fullPath] = col.id;
                    list.push(fullPath);
                }
            }
        };
        for (let root of rootCollections) traverse(root, "");
        return { map, list };
    }

    // 【新增】专属任务控制面板
    async openClassificationTaskPanel(win, selectedItemsCount, pathList) {
        const doc = win.document;
        const HTML_NS = "http://www.w3.org/1999/xhtml";

        return new Promise((resolve) => {
            let overlay = doc.createElementNS(HTML_NS, 'div');
            overlay.setAttribute('style', `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: sans-serif;`);

            let panel = doc.createElementNS(HTML_NS, 'div');
            panel.setAttribute('style', `background: white; padding: 25px; border-radius: 8px; width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 15px;`);

            let title = doc.createElementNS(HTML_NS, 'h2');
            title.textContent = this.tr("classificationTitle");
            title.setAttribute('style', 'margin: 0 0 5px 0; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px;');

            let infoText = doc.createElementNS(HTML_NS, 'div');
            infoText.innerHTML = this.tr("classificationInfo", { count: selectedItemsCount });
            infoText.setAttribute('style', 'font-size: 13px; color: #555;');

            let pathBox = doc.createElementNS(HTML_NS, 'div');
            pathBox.setAttribute('style', 'background: #f8f9fa; border: 1px solid #ddd; padding: 12px; border-radius: 6px;');
            
            let pathStatus = doc.createElementNS(HTML_NS, 'div');
            pathStatus.textContent = this.tr("currentPath");
            pathStatus.setAttribute('style', 'font-size: 13px; font-weight: bold; margin-bottom: 8px;');

            let btnSelectPath = doc.createElementNS(HTML_NS, 'button');
            btnSelectPath.textContent = this.tr("selectPath");
            btnSelectPath.setAttribute('style', 'padding: 6px 12px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; background: white; width: 100%;');
            
            let chosenPaths = []; 
            btnSelectPath.onclick = async () => {
                let paths = await this.openPathSelectionDialog(win, pathList);
                if (paths !== null) {
                    chosenPaths = paths;
                    if (chosenPaths.length === 0) {
                        pathStatus.textContent = this.tr("currentPath");
                    } else {
                        pathStatus.textContent = this.tr("customPath", { count: chosenPaths.length });
                    }
                }
            };
            pathBox.appendChild(pathStatus);
            pathBox.appendChild(btnSelectPath);

            let optionsBox = doc.createElementNS(HTML_NS, 'div');
            optionsBox.setAttribute('style', 'display: flex; flex-direction: column; gap: 10px; padding: 5px 0;');
            
            let maxCatWrapper = doc.createElementNS(HTML_NS, 'div');
            maxCatWrapper.setAttribute('style', 'display: flex; align-items: center; justify-content: space-between;');
            let maxCatLabel = doc.createElementNS(HTML_NS, 'label');
            maxCatLabel.textContent = this.tr("maxCategories");
            maxCatLabel.setAttribute('style', 'font-size: 13px; font-weight: bold; color: #333;');
            let maxCatInput = doc.createElementNS(HTML_NS, 'input');
            maxCatInput.type = 'number';
            maxCatInput.min = '1';
            maxCatInput.value = '1';
            maxCatInput.setAttribute('style', 'width: 60px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; text-align: center;');
            maxCatWrapper.appendChild(maxCatLabel);
            maxCatWrapper.appendChild(maxCatInput);

            let thresholdWrapper = doc.createElementNS(HTML_NS, 'div');
            thresholdWrapper.setAttribute('style', 'display: flex; align-items: center; justify-content: space-between;');
            let thresholdLabel = doc.createElementNS(HTML_NS, 'label');
            thresholdLabel.textContent = this.tr("threshold");
            thresholdLabel.setAttribute('style', 'font-size: 13px; font-weight: bold; color: #333;');
            let thresholdInput = doc.createElementNS(HTML_NS, 'input');
            thresholdInput.type = 'number';
            thresholdInput.min = '0.0';
            thresholdInput.max = '1.0';
            thresholdInput.step = '0.1';
            thresholdInput.value = '0.9';
            thresholdInput.setAttribute('style', 'width: 60px; padding: 4px; border: 1px solid #ccc; border-radius: 4px; text-align: center;');
            thresholdWrapper.appendChild(thresholdLabel);
            thresholdWrapper.appendChild(thresholdInput);

            optionsBox.appendChild(maxCatWrapper);
            optionsBox.appendChild(thresholdWrapper);

            let btnBox = doc.createElementNS(HTML_NS, 'div');
            btnBox.setAttribute('style', 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;');

            let btnCancel = doc.createElementNS(HTML_NS, 'button');
            btnCancel.textContent = this.tr("cancel");
            btnCancel.setAttribute('style', 'padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;');
            btnCancel.onclick = () => { overlay.remove(); resolve(null); };

            let btnOk = doc.createElementNS(HTML_NS, 'button');
            btnOk.textContent = this.tr("startClassificationBtn");
            btnOk.setAttribute('style', 'padding: 8px 16px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer; font-weight: bold;');
            btnOk.onclick = () => {
                let maxCats = parseInt(maxCatInput.value) || 1;
                let thresh = parseFloat(thresholdInput.value) || 0.9;
                overlay.remove();
                resolve({ chosenPaths, maxCategories: maxCats, threshold: thresh });
            };

            btnBox.appendChild(btnCancel); btnBox.appendChild(btnOk);
            panel.appendChild(title); panel.appendChild(infoText); 
            panel.appendChild(pathBox); panel.appendChild(optionsBox);
            panel.appendChild(btnBox); overlay.appendChild(panel);
            doc.documentElement.appendChild(overlay);
        });
    }

    // 【重构】主入口拦截与调用
    async startSmartClassification(win) {
        if (this.isClassifying) {
            this.showAlert(win, "当前已有归类任务正在后台运行，请先停止它！"); return;
        }

        let logReady = await this.checkLogPath(win);
        if (!logReady) return;

        let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
        selectedItems = selectedItems.filter(i => i.isRegularItem());

        if (selectedItems.length === 0) {
            this.showAlert(win, "请先在主界面选中至少一篇论文！"); return;
        }
        if (!this.config.api_key) {
            this.showAlert(win, this.tr("alertNoApiKey"));
            this.openConfigDialog(win); return;
        }

        let { map: pathMap, list: pathList } = this.getCollectionMap();
        if (pathList.length === 0) {
            this.showAlert(win, this.tr("alertNoFolders")); return;
        }

        let taskConfig = await this.openClassificationTaskPanel(win, selectedItems.length, pathList);
        if (taskConfig === null) return; 

        let finalCandidates = taskConfig.chosenPaths.length > 0 ? taskConfig.chosenPaths : pathList;

        let pw = new Zotero.ProgressWindow({ closeOnClick: true });
        pw.changeHeadline(this.tr("classificationTitle"));
        let mainProgress = new pw.ItemProgress("chrome://zotero/skin/tick.png", this.tr("classifying", { current: 0, total: selectedItems.length }));
        pw.show();

        await this.appendLog("\n" + this.tr("taskStart", { time: new Date().toLocaleString() }) + "\n");
        await this.appendLog(this.tr("taskSettings", { max: taskConfig.maxCategories, threshold: taskConfig.threshold }) + "\n");
        await this.appendLog(this.tr("taskItems", { count: selectedItems.length, paths: finalCandidates.length }) + "\n");

        let successCount = 0; let errorCount = 0;
        
        this.isClassifying = true;
        this.cancelClassification = false;

        (async () => {
            for (let i = 0; i < selectedItems.length; i++) {
                if (this.cancelClassification) {
                    await this.appendLog("\n" + this.tr("systemStopped") + "\n");
                    mainProgress.setText(this.tr("systemStopped"));
                    pw.addDescription(this.tr("systemStopped"));
                    break;
                }

                let item = selectedItems[i];
                let title = item.getField('title');
                let abstract = item.getField('abstractNote') || '无摘要 / No abstract';
                if (abstract.length > 600) abstract = abstract.substring(0, 600) + "...";
                let keywords = item.getTags().map(t => t.tag).join(", ");

                mainProgress.setText(this.tr("classifying", { current: i + 1, total: selectedItems.length }));
                mainProgress.setProgress((i / selectedItems.length) * 100);

                let prompt = this.config.prompt_classify
                    .replace('{title}', title)
                    .replace('{keywords}', keywords)
                    .replace('{abstract}', abstract)
                    .replace('{pathList}', finalCandidates.join("\n"))
                    .replace(/{max_categories}/g, taskConfig.maxCategories) 
                    .replace(/{threshold}/g, taskConfig.threshold);

                try {
                    let response = await this.fetchWithRetry(this.config.api_url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.config.api_key}` },
                        body: JSON.stringify({ model: this.config.model, messages: [{ role: "user", content: prompt }], temperature: 0.1 })
                    });

                    if (this.cancelClassification) {
                        await this.appendLog(this.tr("systemStopped") + "\n");
                        mainProgress.setText(this.tr("systemStopped"));
                        break;
                    }

                    let rawText = await response.text();
                    if (!response.ok) throw new Error(`API Error: ${rawText.substring(0, 100)}`);

                    let data = JSON.parse(rawText);
                    let content = data.choices?.[0]?.message?.content || "";
                    let cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

                    let result;
                    try {
                        result = JSON.parse(cleanContent);
                    } catch (parseErr) {
                        errorCount++;
                        await this.appendLog(this.tr("errorLog", { title: title.substring(0, 40), error: "JSON解析失败: " + parseErr.message }) + "\n");
                        await sleep(2500);
                        continue;
                    }

                    if (this.cancelClassification) {
                        await this.appendLog(this.tr("systemStopped") + "\n");
                        mainProgress.setText(this.tr("systemStopped"));
                        break;
                    }

                    item.setCollections([]);
                    let targetIDs = []; let targetNames = [];

                    if (result.paths && Array.isArray(result.paths)) {
                        if (result.paths.length > taskConfig.maxCategories) {
                            result.paths = result.paths.slice(0, taskConfig.maxCategories);
                        }
                        for (let p of result.paths) {
                            if (pathMap[p]) { targetIDs.push(pathMap[p]); targetNames.push(p); }
                        }
                    }

                    if (targetIDs.length > 0) {
                        item.setCollections(targetIDs); await item.saveTx(); successCount++;
                        await this.appendLog(this.tr("okLog", { title: title.substring(0, 40), paths: targetNames.join(" | ") }) + "\n");
                    } else {
                        await this.appendLog(this.tr("skipLog", { title: title.substring(0, 40) }) + "\n");
                    }
                } catch (err) {
                    errorCount++;
                    await this.appendLog(this.tr("errorLog", { title: title.substring(0, 40), error: err.message }) + "\n");
                }
                
                await sleep(2500);
            }

            if (!this.cancelClassification) {
                mainProgress.setProgress(100); mainProgress.setText(this.tr("taskComplete"));
                pw.addDescription(this.tr("successCount", { success: successCount, failed: selectedItems.length - successCount }));
            }
            
            pw.startCloseTimer(8000);
            await this.appendLog(this.tr("taskEnd", { time: new Date().toLocaleString(), success: successCount }) + "\n");
            
            // 【新增】收尾重置状态
            this.isClassifying = false;
            this.cancelClassification = false;
        })();
    }

    async showLogViewer(win) {
        let logReady = await this.checkLogPath(win);
        if (!logReady) return;

        const logPath = this.config.log_path;
        let content = "";
        try {
            if (await IOUtils.exists(logPath)) { content = await IOUtils.readUTF8(logPath); }
        } catch (e) { content = "日志文件不存在或读取失败 / Log file not found or read failed"; }

        const HTML_NS = "http://www.w3.org/1999/xhtml";
        let overlay = win.document.createElementNS(HTML_NS, 'div');
        overlay.setAttribute('style', `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: sans-serif;`);

        let panel = win.document.createElementNS(HTML_NS, 'div');
        panel.setAttribute('style', `background: white; padding: 20px; border-radius: 8px; width: 700px; height: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 10px;`);

        let titleBox = win.document.createElementNS(HTML_NS, 'div');
        titleBox.setAttribute('style', 'display: flex; justify-content: space-between; align-items: center;');
        let title = win.document.createElementNS(HTML_NS, 'h2');
        title.textContent = this.tr("logViewerTitle");
        title.setAttribute('style', 'margin: 0; font-size: 18px;');
        let pathHint = win.document.createElementNS(HTML_NS, 'span');
        pathHint.textContent = this.tr("logPathLabel") + " " + logPath;
        pathHint.setAttribute('style', 'font-size: 11px; color: #888; max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;');
        titleBox.appendChild(title); titleBox.appendChild(pathHint);

        let textarea = win.document.createElementNS(HTML_NS, 'textarea');
        textarea.value = content;
        textarea.setAttribute('style', 'flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: monospace; font-size: 12px; resize: none; background: #fafafa;');

        setTimeout(() => { textarea.scrollTop = textarea.scrollHeight; }, 100);

        let btnBox = win.document.createElementNS(HTML_NS, 'div');
        btnBox.setAttribute('style', 'display: flex; justify-content: flex-end; gap: 10px;');

        let btnRefresh = win.document.createElementNS(HTML_NS, 'button');
        btnRefresh.textContent = this.tr("refresh");
        btnRefresh.setAttribute('style', 'padding: 8px 16px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;');
        btnRefresh.onclick = async () => {
            let newContent = "";
            if (await IOUtils.exists(logPath)) { newContent = await IOUtils.readUTF8(logPath); }
            textarea.value = newContent;
            textarea.scrollTop = textarea.scrollHeight;
        };

        let btnClose = win.document.createElementNS(HTML_NS, 'button');
        btnClose.textContent = this.tr("close");
        btnClose.setAttribute('style', 'padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;');
        btnClose.onclick = () => overlay.remove();

        btnBox.appendChild(btnRefresh); btnBox.appendChild(btnClose);
        panel.appendChild(titleBox); panel.appendChild(textarea); panel.appendChild(btnBox);
        overlay.appendChild(panel); win.document.documentElement.appendChild(overlay);
    }

    async openConfigDialog(win) {
        const doc = win.document;
        const HTML_NS = "http://www.w3.org/1999/xhtml";
        let existing = doc.getElementById('ai-classifier-config-overlay');
        if (existing) existing.remove();

        let overlay = doc.createElementNS(HTML_NS, 'div');
        overlay.setAttribute('style', `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: sans-serif;`);

        let panel = doc.createElementNS(HTML_NS, 'div');
        panel.setAttribute('style', `background: white; padding: 25px; border-radius: 8px; width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 15px;`);

        let title = doc.createElementNS(HTML_NS, 'h2');
        title.textContent = this.tr("apiConfigTitle");
        title.setAttribute('style', 'margin: 0 0 5px 0; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px;');

        const createInput = (labelText, value, placeholder, isPassword = false) => {
            let wrapper = doc.createElementNS(HTML_NS, 'div');
            wrapper.setAttribute('style', 'display: flex; flex-direction: column; gap: 5px;');
            let label = doc.createElementNS(HTML_NS, 'label');
            label.textContent = labelText;
            label.setAttribute('style', 'font-size: 12px; font-weight: bold; color: #555;');
            let input = doc.createElementNS(HTML_NS, 'input');
            input.type = isPassword ? 'password' : 'text';
            input.value = value || ""; input.placeholder = placeholder || "";
            input.setAttribute('style', 'padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; width: 100%; box-sizing: border-box;');
            wrapper.appendChild(label); wrapper.appendChild(input);
            return { wrapper, input };
        };

        let urlLabel = this.tr("apiUrl");
        let keyLabel = this.tr("apiKey");
        let modelLabel = this.tr("modelName");
        let urlPlaceholder = "例如: https://api.siliconflow.cn/v1/chat/completions / e.g., https://api.siliconflow.cn/v1/chat/completions";
        let modelPlaceholder = "例如: Qwen/Qwen2.5-7B-Instruct / e.g., Qwen/Qwen2.5-7B-Instruct";
        
        let urlField = createInput(urlLabel, this.config.api_url, urlPlaceholder); panel.appendChild(urlField.wrapper);
        let keyField = createInput(keyLabel, this.config.api_key, "sk-...", true); panel.appendChild(keyField.wrapper);
        let modelField = createInput(modelLabel, this.config.model, modelPlaceholder); panel.appendChild(modelField.wrapper);

        let btnBox = doc.createElementNS(HTML_NS, 'div');
        btnBox.setAttribute('style', 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;');

        let btnTest = doc.createElementNS(HTML_NS, 'button');
        btnTest.textContent = this.tr("testConnection");
        btnTest.setAttribute('style', 'padding: 8px 16px; border: none; background: #28a745; border-radius: 4px; cursor: pointer; color: white; margin-right: auto;');

        let btnCancel = doc.createElementNS(HTML_NS, 'button');
        btnCancel.textContent = this.tr("cancel");
        btnCancel.setAttribute('style', 'padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;');
        btnCancel.onclick = () => overlay.remove();

        let btnSave = doc.createElementNS(HTML_NS, 'button');
        btnSave.textContent = this.tr("save");
        btnSave.setAttribute('style', 'padding: 8px 16px; border: none; background: #007bff; border-radius: 4px; cursor: pointer; color: white; font-weight: bold;');

        let testingText = "连接中... / Testing...";
        let fillAllText = "请先填写完整信息！ / Please fill in all fields!";
        
        btnTest.onclick = async () => {
            let tempUrl = urlField.input.value.trim(); let tempKey = keyField.input.value.trim(); let tempModel = modelField.input.value.trim();
            if (!tempUrl || !tempKey || !tempModel) { this.showAlert(win, fillAllText); return; }
            let originalText = btnTest.textContent; btnTest.textContent = testingText; btnTest.disabled = true;
            try {
                let response = await fetch(tempUrl, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tempKey}` },
                    body: JSON.stringify({ model: tempModel, messages: [{ role: "user", content: "Test." }], max_tokens: 10 })
                });
                if (!response.ok) throw new Error(`Status ${response.status}`);
                this.showAlert(win, this.tr("connectionSuccess"));
            } catch (error) { this.showAlert(win, this.tr("connectionFailed", { error: error.message })); }
            finally { btnTest.textContent = originalText; btnTest.disabled = false; }
        };

        btnSave.onclick = async () => {
            this.config.api_url = urlField.input.value.trim();
            this.config.api_key = keyField.input.value.trim();
            this.config.model = modelField.input.value.trim();
            await this.saveConfig(); overlay.remove();
        };

        btnBox.appendChild(btnTest); btnBox.appendChild(btnCancel); btnBox.appendChild(btnSave);
        panel.appendChild(title); panel.appendChild(btnBox);
        overlay.appendChild(panel); doc.documentElement.appendChild(overlay);
    }

    async openPathSelectionDialog(win, pathList) {
        const doc = win.document; const HTML_NS = "http://www.w3.org/1999/xhtml";
        return new Promise((resolve) => {
            let overlay = doc.createElementNS(HTML_NS, 'div');
            overlay.setAttribute('style', `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: sans-serif;`);

            let panel = doc.createElementNS(HTML_NS, 'div');
            panel.setAttribute('style', `background: white; padding: 20px; border-radius: 8px; width: 450px; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 10px 25px rgba(0,0,0,0.2);`);

            let title = doc.createElementNS(HTML_NS, 'h3');
            title.textContent = this.tr("pathSelectionTitle");
            title.setAttribute('style', 'margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;');

            let listContainer = doc.createElementNS(HTML_NS, 'div');
            listContainer.setAttribute('style', 'flex: 1; overflow-y: auto; padding: 10px; background: #fafafa; border-radius: 4px; margin: 10px 0;');

            pathList.forEach(path => {
                let row = doc.createElementNS(HTML_NS, 'div');
                row.setAttribute('style', 'display: flex; align-items: center; padding: 4px 0;');
                let parts = path.split(" / "); let depth = parts.length - 1; row.style.paddingLeft = (depth * 20) + "px";

                let cb = doc.createElementNS(HTML_NS, 'input');
                cb.type = 'checkbox'; cb.className = 'ai-path-cb'; cb.value = path; cb.setAttribute('style', 'margin-right: 8px;');

                let label = doc.createElementNS(HTML_NS, 'span');
                label.textContent = parts[depth]; label.setAttribute('style', 'font-size: 13px; color: #333; cursor: pointer;');
                label.onclick = () => cb.checked = !cb.checked;

                row.appendChild(cb); row.appendChild(label); listContainer.appendChild(row);
            });

            let hint = doc.createElementNS(HTML_NS, 'div');
            hint.textContent = this.tr("hintNoSelection");
            hint.setAttribute('style', 'font-size: 11px; color: #888; margin-bottom: 10px;');

            let btnBox = doc.createElementNS(HTML_NS, 'div');
            btnBox.setAttribute('style', 'display: flex; justify-content: flex-end; gap: 10px;');

            let btnCancel = doc.createElementNS(HTML_NS, 'button');
            btnCancel.textContent = this.tr("cancelModify");
            btnCancel.setAttribute('style', 'padding: 6px 12px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;');
            btnCancel.onclick = () => { overlay.remove(); resolve(null); };

            let btnOk = doc.createElementNS(HTML_NS, 'button');
            btnOk.textContent = this.tr("confirmSelected");
            btnOk.setAttribute('style', 'padding: 6px 16px; border: none; background: #28a745; color: white; border-radius: 4px; cursor: pointer; font-weight: bold;');
            btnOk.onclick = () => {
                let checked = Array.from(doc.querySelectorAll('.ai-path-cb')).filter(c => c.checked).map(c => c.value);
                overlay.remove(); resolve(checked);
            };

            btnBox.appendChild(btnCancel); btnBox.appendChild(btnOk);
            panel.appendChild(title); panel.appendChild(listContainer); panel.appendChild(hint); panel.appendChild(btnBox);
            overlay.appendChild(panel); doc.documentElement.appendChild(overlay);
        });
    }

    async openChatTestDialog(win) {
        const doc = win.document; const HTML_NS = "http://www.w3.org/1999/xhtml";
        let existing = doc.getElementById('ai-classifier-chat-overlay'); if (existing) existing.remove();
        let overlay = doc.createElementNS(HTML_NS, 'div'); overlay.setAttribute('style', `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: sans-serif;`);
        let panel = doc.createElementNS(HTML_NS, 'div'); panel.setAttribute('style', `background: white; padding: 20px; border-radius: 8px; width: 500px; height: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 10px;`);
        let title = doc.createElementNS(HTML_NS, 'h2'); title.textContent = this.tr("chatTestTitle"); title.setAttribute('style', 'margin: 0; font-size: 18px;');
        let defaultInput = "你是谁？ / Who are you?";
        let inputArea = doc.createElementNS(HTML_NS, 'textarea'); inputArea.value = defaultInput; inputArea.setAttribute('style', 'padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; resize: none; height: 60px;');
        let outputPlaceholder = "API 响应... / API Response...";
        let outputArea = doc.createElementNS(HTML_NS, 'textarea'); outputArea.setAttribute('style', 'flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; resize: none; background: #f9f9f9;'); outputArea.placeholder = outputPlaceholder;
        let btnBox = doc.createElementNS(HTML_NS, 'div'); btnBox.setAttribute('style', 'display: flex; justify-content: flex-end; gap: 10px;');
        let btnClose = doc.createElementNS(HTML_NS, 'button'); btnClose.textContent = this.tr("close"); btnClose.setAttribute('style', 'padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;'); btnClose.onclick = () => overlay.remove();
        let btnSend = doc.createElementNS(HTML_NS, 'button'); btnSend.textContent = this.tr("send"); btnSend.setAttribute('style', 'padding: 8px 16px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer; font-weight: bold;');
        let noApiKeyText = "请先配置 API Key！ / Please configure API Key first!";
        let sendingText = "发送中... / Sending...";
        let waitingText = "等待响应... / Waiting for response...";
        let noResponseText = "无响应 / No response";
        
        btnSend.onclick = async () => {
            if (!this.config.api_key) { this.showAlert(win, noApiKeyText); return; }
            let originalText = btnSend.textContent; btnSend.textContent = sendingText; btnSend.disabled = true; outputArea.value = waitingText;
            try {
                let response = await this.fetchWithRetry(this.config.api_url, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.config.api_key}` },
                    body: JSON.stringify({ model: this.config.model, messages: [{ role: "user", content: inputArea.value }], temperature: 0.7 })
                });
                let rawText = await response.text(); if (!response.ok) { outputArea.value = `Error: ${rawText}`; return; }
                let data = JSON.parse(rawText); outputArea.value = data.choices?.[0]?.message?.content || noResponseText;
            } catch (error) { outputArea.value = `Error: ${error.message}`; } finally { btnSend.textContent = originalText; btnSend.disabled = false; }
        };
        btnBox.appendChild(btnSend); btnBox.appendChild(btnClose); panel.appendChild(title); panel.appendChild(inputArea); panel.appendChild(outputArea); panel.appendChild(btnBox); overlay.appendChild(panel); doc.documentElement.appendChild(overlay);
    }

    async openPromptConfigDialog(win) {
        const doc = win.document; const HTML_NS = "http://www.w3.org/1999/xhtml";
        let existing = doc.getElementById('ai-classifier-prompt-overlay'); if (existing) existing.remove();

        let overlay = doc.createElementNS(HTML_NS, 'div');
        overlay.setAttribute('style', `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: sans-serif;`);

        let panel = doc.createElementNS(HTML_NS, 'div');
        panel.setAttribute('style', `background: white; padding: 20px; border-radius: 8px; width: 600px; height: 500px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 10px;`);

        let title = doc.createElementNS(HTML_NS, 'h2'); title.textContent = this.tr("promptConfigTitle"); title.setAttribute('style', 'margin: 0; font-size: 18px;');

        let textarea = doc.createElementNS(HTML_NS, 'textarea');
        textarea.value = this.config.prompt_classify;
        textarea.setAttribute('style', 'flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: monospace; font-size: 12px; resize: none;');

        let hint = doc.createElementNS(HTML_NS, 'div');
        hint.textContent = this.tr("promptHint");
        hint.setAttribute('style', 'font-size: 12px; color: #666;');

        let btnBox = doc.createElementNS(HTML_NS, 'div'); btnBox.setAttribute('style', 'display: flex; justify-content: space-between; gap: 10px;');

        let btnReset = doc.createElementNS(HTML_NS, 'button'); btnReset.textContent = this.tr("resetDefault");
        btnReset.setAttribute('style', 'padding: 8px 16px; border: 1px solid #dc3545; background: white; color: #dc3545; border-radius: 4px; cursor: pointer;');

        let rightBox = doc.createElementNS(HTML_NS, 'div'); rightBox.setAttribute('style', 'display: flex; gap: 10px;');

        let btnCancel = doc.createElementNS(HTML_NS, 'button'); btnCancel.textContent = this.tr("cancel");
        btnCancel.setAttribute('style', 'padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;');
        btnCancel.onclick = () => overlay.remove();

        let btnSave = doc.createElementNS(HTML_NS, 'button'); btnSave.textContent = this.tr("save");
        btnSave.setAttribute('style', 'padding: 8px 16px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer; font-weight: bold;');

        btnReset.onclick = () => { textarea.value = this.defaultPromptClassify; };

        btnSave.onclick = async () => {
            this.config.prompt_classify = textarea.value;
            await this.saveConfig(); overlay.remove(); this.showAlert(win, this.tr("promptSaved"));
        };

        rightBox.appendChild(btnCancel); rightBox.appendChild(btnSave);
        btnBox.appendChild(btnReset); btnBox.appendChild(rightBox);
        panel.appendChild(title); panel.appendChild(textarea); panel.appendChild(hint); panel.appendChild(btnBox);
        overlay.appendChild(panel); doc.documentElement.appendChild(overlay);
    }
}

function install() {}
function uninstall() {}
async function startup({ id, version, resourceURI, rootURI }) {
    await Zotero.uiReadyPromise;
    let win = Zotero.getMainWindow();
    zoteroAIPlugin = new AIClassifier();
    await zoteroAIPlugin.init();
    zoteroAIPlugin.injectMenu(win);
}
function shutdown() {
    if (zoteroAIPlugin && zoteroAIPlugin.mainMenu) zoteroAIPlugin.mainMenu.remove();
}
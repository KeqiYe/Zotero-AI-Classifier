

var zoteroAIPlugin;
const sleep = ms => new Promise(r => setTimeout(r, ms));

class ZoteroAI_Plugin {
    constructor() {
        this.dbPath = null;
        this.configPath = null;
        this.db = {};
        this.config = {
            api_url: "https://api.siliconflow.cn/v1/chat/completions",
            api_key: "",
            model: "Qwen/Qwen2.5-7B-Instruct" 
        };
        this.mainMenu = null; 
    }

    async init() {
        this.dbPath = PathUtils.join(Zotero.DataDirectory.dir, "zotero_ai_db.json");
        this.configPath = PathUtils.join(Zotero.DataDirectory.dir, "zotero_ai_config.json");
        await this.loadDB();
        await this.loadConfig();
    }

    // ================== 配置管理 ==================
    async loadConfig() {
        try {
            if (await IOUtils.exists(this.configPath)) {
                let data = await IOUtils.readUTF8(this.configPath);
                this.config = Object.assign(this.config, JSON.parse(data));
            }
        } catch (e) { Zotero.debug("Zotero AI: 加载配置失败"); }
    }

    async saveConfig() {
        try { await IOUtils.writeUTF8(this.configPath, JSON.stringify(this.config, null, 2)); } catch (e) {}
    }

    async loadDB() {
        try {
            if (await IOUtils.exists(this.dbPath)) {
                let data = await IOUtils.readUTF8(this.dbPath);
                this.db = JSON.parse(data);
            }
        } catch (e) {}
    }

    async saveDB() {
        try { await IOUtils.writeUTF8(this.dbPath, JSON.stringify(this.db, null, 2)); } catch (e) {}
    }

    // =========================================================================
    // 模块 1：注入 UI 菜单
    // =========================================================================
    injectMenu(win) {
        let toolsMenu = win.document.getElementById('menu_ToolsPopup');
        if (!toolsMenu) return;

        let existing = win.document.getElementById('zotero-ai-main-menu');
        if (existing) existing.remove();

        this.mainMenu = win.document.createXULElement('menu');
        this.mainMenu.setAttribute('id', 'zotero-ai-main-menu');
        this.mainMenu.setAttribute('label', 'Zotero AI');

        let menuPopup = win.document.createXULElement('menupopup');

        // === 修改处：更新了标签文字 ===
        let menuExportMeta = win.document.createXULElement('menuitem');
        menuExportMeta.setAttribute('label', '1. 工具：导出文献元数据 (JSON)');
        menuExportMeta.addEventListener('command', () => this.processAllItems(win));
        menuPopup.appendChild(menuExportMeta);

        let menuExportTree = win.document.createXULElement('menuitem');
        menuExportTree.setAttribute('label', '工具：导出目录树结构 (TXT)');
        menuExportTree.addEventListener('command', () => this.exportTreeToTXT(win));
        menuPopup.appendChild(menuExportTree);

        let menuExportKeywords = win.document.createXULElement('menuitem');
        menuExportKeywords.setAttribute('label', '工具：导出全库关键词');
        menuExportKeywords.addEventListener('command', () => this.exportAllKeywords(win));
        menuPopup.appendChild(menuExportKeywords);

        menuPopup.appendChild(win.document.createXULElement('menuseparator'));

        let menuGenHierarchy = win.document.createXULElement('menuitem');
        menuGenHierarchy.setAttribute('label', 'AI：基于关键词生成层级结构');
        menuGenHierarchy.addEventListener('command', () => this.generateHierarchyFromKeywords(win));
        menuPopup.appendChild(menuGenHierarchy);

        let menuRebuild = win.document.createXULElement('menuitem');
        menuRebuild.setAttribute('label', '危险：清空并根据TXT重构目录');
        menuRebuild.setAttribute('style', 'color: red;');
        menuRebuild.addEventListener('command', () => this.rebuildCollectionsFromTXT(win));
        menuPopup.appendChild(menuRebuild);

        menuPopup.appendChild(win.document.createXULElement('menuseparator'));

        let menuAutoClassify = win.document.createXULElement('menuitem');
        menuAutoClassify.setAttribute('label', '核心：智能归类 (实时日志)');
        menuAutoClassify.setAttribute('style', 'font-weight: bold;'); 
        menuAutoClassify.addEventListener('command', () => this.startAutoClassification(win));
        menuPopup.appendChild(menuAutoClassify);

        menuPopup.appendChild(win.document.createXULElement('menuseparator'));

        let menuConfig = win.document.createXULElement('menuitem');
        menuConfig.setAttribute('label', '设置：API 参数与连接测试');
        menuConfig.addEventListener('command', () => this.openConfigDialog(win));
        menuPopup.appendChild(menuConfig);

        this.mainMenu.appendChild(menuPopup);
        toolsMenu.appendChild(this.mainMenu);
    }

    // =========================================================================
    // 模块 2：配置面板 (保持不变)
    // =========================================================================
    async openConfigDialog(win) {
        const doc = win.document;
        const HTML_NS = "http://www.w3.org/1999/xhtml"; 
        let existing = doc.getElementById('zotero-ai-config-overlay');
        if (existing) existing.remove();

        let overlay = doc.createElementNS(HTML_NS, 'div');
        overlay.setAttribute('id', 'zotero-ai-config-overlay');
        overlay.setAttribute('style', `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: sans-serif;`);

        let panel = doc.createElementNS(HTML_NS, 'div');
        panel.setAttribute('style', `background: white; padding: 25px; border-radius: 8px; width: 450px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); display: flex; flex-direction: column; gap: 15px; color: #333;`);

        let title = doc.createElementNS(HTML_NS, 'h2');
        title.textContent = "Zotero AI 配置";
        title.setAttribute('style', 'margin: 0 0 5px 0; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px;');
        panel.appendChild(title);

        const createInput = (labelText, value, placeholder, isPassword = false) => {
            let wrapper = doc.createElementNS(HTML_NS, 'div');
            wrapper.setAttribute('style', 'display: flex; flex-direction: column; gap: 5px;');
            let label = doc.createElementNS(HTML_NS, 'label');
            label.textContent = labelText;
            label.setAttribute('style', 'font-size: 12px; font-weight: bold; color: #555;');
            let input = doc.createElementNS(HTML_NS, 'input');
            input.type = isPassword ? 'password' : 'text';
            input.value = value || "";
            input.placeholder = placeholder || "";
            input.setAttribute('style', 'padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; width: 100%; box-sizing: border-box;');
            wrapper.appendChild(label);
            wrapper.appendChild(input);
            return { wrapper, input };
        };

        let urlField = createInput("API URL", this.config.api_url, "例如: https://api.siliconflow.cn/v1/chat/completions");
        panel.appendChild(urlField.wrapper);
        let keyField = createInput("API Key", this.config.api_key, "sk-...", true);
        panel.appendChild(keyField.wrapper);
        let modelField = createInput("Model Name", this.config.model, "例如: Qwen/Qwen2.5-7B-Instruct");
        panel.appendChild(modelField.wrapper);

        let btnBox = doc.createElementNS(HTML_NS, 'div');
        btnBox.setAttribute('style', 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;');

        let btnTest = doc.createElementNS(HTML_NS, 'button');
        btnTest.textContent = "🔌 测试连接";
        btnTest.setAttribute('style', 'padding: 8px 16px; border: none; background: #28a745; border-radius: 4px; cursor: pointer; color: white; margin-right: auto;');
        
        let btnCancel = doc.createElementNS(HTML_NS, 'button');
        btnCancel.textContent = "取消";
        btnCancel.setAttribute('style', 'padding: 8px 16px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer; color: #333;');
        btnCancel.onclick = () => overlay.remove();

        let btnSave = doc.createElementNS(HTML_NS, 'button');
        btnSave.textContent = "保存配置";
        btnSave.setAttribute('style', 'padding: 8px 16px; border: none; background: #007bff; border-radius: 4px; cursor: pointer; color: white; font-weight: bold;');

        btnTest.onclick = async () => {
            let tempUrl = urlField.input.value.trim();
            let tempKey = keyField.input.value.trim();
            let tempModel = modelField.input.value.trim();
            if (!tempUrl || !tempKey || !tempModel) { win.alert("请先填写完整信息！"); return; }
            let originalText = btnTest.textContent;
            btnTest.textContent = "⏳ 连接中..."; btnTest.disabled = true;
            try {
                let response = await win.fetch(tempUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tempKey}` },
                    body: JSON.stringify({
                        model: tempModel, messages: [{ role: "user", content: "Test." }], max_tokens: 10
                    })
                });
                let rawText = await response.text(); 
                if (!response.ok) throw new Error(`Status ${response.status}: ${rawText.substring(0, 100)}`);
                win.alert(`✅ 测试成功！`);
            } catch (error) { win.alert(`❌ 测试失败: ${error.message}`); } 
            finally { btnTest.textContent = originalText; btnTest.disabled = false; }
        };

        btnSave.onclick = async () => {
            this.config.api_url = urlField.input.value.trim();
            this.config.api_key = keyField.input.value.trim();
            this.config.model = modelField.input.value.trim();
            await this.saveConfig();
            overlay.remove();
        };

        btnBox.appendChild(btnTest); btnBox.appendChild(btnCancel); btnBox.appendChild(btnSave);
        panel.appendChild(btnBox); overlay.appendChild(panel); doc.documentElement.appendChild(overlay);
    }

    // =========================================================================
    // 模块 3: 核心逻辑 (增强)
    // =========================================================================
    
    async appendLog(path, text) {
        if (!path) return;
        try { await IOUtils.writeUTF8(path, text, { mode: "append" }); } catch (e) {
            try {
                let content = "";
                if (await IOUtils.exists(path)) content = await IOUtils.readUTF8(path);
                await IOUtils.writeUTF8(path, content + text);
            } catch (e2) {}
        }
    }

        // === 核心修改：主动式树形遍历 (解决缓存不同步问题) ===
    getCollectionMap(targetLibraryID) {
        let libraryID = targetLibraryID || Zotero.Libraries.userLibraryID;
        
        // 1. 获取该文库下所有的 Collection (理论上应该返回所有，但如果缓存没更新，可能只有根)
        let allCollections = Zotero.Collections.getByLibrary(libraryID);
        
        // 2. 仅提取根节点 (没有 parentID 的)
        let rootCollections = allCollections.filter(c => !c.parentID);

        let map = {}; 
        let list = []; 

        // 3. 定义递归遍历函数 (爬虫)
        // col: 当前 Collection 对象
        // currentPath: 当前累积的路径字符串
        const traverse = (col, currentPath) => {
            let fullPath = currentPath ? (currentPath + " / " + col.name) : col.name;
            
            // Zotero 的 Collection 对象通常有这个方法，或者通过 ID 查找
            let children = col.getChildCollections(); 
            
            // 如果 getChildCollections 返回空，可能是缓存问题，尝试用底层 API 再次确认
            if (!children || children.length === 0) {
                 children = Zotero.Collections.getByParent(col.id, libraryID);
            }

            if (children && children.length > 0) {
                // 如果有孩子，说明这是个父目录，继续向下爬
                for (let child of children) {
                    traverse(child, fullPath);
                }
            } else {
                // 如果没有孩子，说明到底了 -> 它是叶子节点
                // 加入结果列表
                map[fullPath] = col.id;
                list.push(fullPath);
            }
        };

        // 4. 从每一个根节点开始向下爬
        for (let root of rootCollections) {
            traverse(root, "");
        }
        
        return { map, list };
    }

        // === 新增功能 1：提取关键词并让AI生成结构 (日志优化版) ===
    async generateHierarchyFromKeywords(win) {
        if (!this.config.api_key) {
            win.alert("请先配置 API Key");
            return;
        }

        // 1. 获取关键词并统计频率
        let libraryID = Zotero.Libraries.userLibraryID;
        let s = new Zotero.Search(); 
        s.libraryID = libraryID;
        s.addCondition('itemType', 'isNot', 'attachment'); 
        s.addCondition('itemType', 'isNot', 'note');
        let itemIDs = await s.search();
        let items = await Zotero.Items.getAsync(itemIDs);
        
        let tagCounts = {};
        for (let item of items) { 
            item.getTags().forEach(t => {
                let tag = t.tag ? t.tag.trim() : "";
                if (tag) {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                }
            }); 
        }

        let sortedTagsObj = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
        
        if (sortedTagsObj.length === 0) {
            win.alert("库中没有任何关键词！");
            return;
        }

        // 2. 获取用户参数
        let maxDepth = win.prompt("请输入最大层级深度 (S):", "3");
        if (maxDepth === null) return;
        let maxRoots = win.prompt("请输入根节点最大个数 (G):", "8");
        if (maxRoots === null) return;

        // 3. 选择保存路径
        const fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        fp.init(win, "保存生成的层级结构", Components.interfaces.nsIFilePicker.modeSave);
        fp.appendFilter("TXT", "*.txt"); 
        fp.defaultString = "AI_Generated_Tree.txt";
        let rv = await new Promise(r => fp.open(r));
        if (rv !== 0 && rv !== 2) return; 
        let savePath = fp.file.path;

        // 4. 准备进度窗口与日志
        let pw = new Zotero.ProgressWindow({ closeOnClick: false });
        pw.changeHeadline("AI 生成目录结构");
        pw.show();
        let progress = new pw.ItemProgress("chrome://zotero/skin/tick.png", "正在整理关键词...");
        
        const logFilename = "Zotero_AI_Log.txt";
        const logPath = PathUtils.join(Zotero.DataDirectory.dir, logFilename);
        let startTime = new Date().toLocaleString();
        
        // --- 日志优化点 1：详细解释参数含义 ---
        await this.appendLog(logPath, `\n========== AI 生成结构任务 [${startTime}] ==========\n`);
        await this.appendLog(logPath, `参数设置: 最大深度(S)=${maxDepth}, 根节点上限(G)=${maxRoots}, 唯一关键词总数=${sortedTagsObj.length}\n`);

        let topTags = sortedTagsObj.slice(0, 600).map(entry => `${entry[0]} (${entry[1]})`);
        
        if(sortedTagsObj.length > 600) {
            await this.appendLog(logPath, `[提示] 关键词过多，仅发送频次最高的 600 个进行分析。\n`);
        }

        // --- Prompt 优化 (保持之前的逻辑优化) ---
        let prompt = `
你是一位资深的学术分类学家和档案管理员。
我提供了一组学术论文的关键词及其频次。请注意：**这些关键词仅作为反映论文内容的“特征信号”，不一定直接作为分类名称。**

请根据这些信号，推断出论文所属的学科背景，并构建一个专业、逻辑严密的层级分类体系。

[核心原则与逻辑要求]:
1. **抽象化命名**: 不要简单罗列关键词，使用标准的学术学科或专业术语（如 "Numerical Methods", "Fluid Dynamics"）。
2. **纵向逻辑**: 父子节点必须具备严格的包含关系。
3. **横向逻辑**: 同一层级兄弟节点颗粒度一致。
4. **互斥性**: 降低不同类别交集。
5. **权重参考**: 频次高（括号内数字大）的领域应保留更细致子结构。

[格式要求 - 必须严格遵守]:
1. **结构深度**: 最大深度不超过 ${maxDepth} 层。
2. **根节点**: 顶层根节点数量不超过 ${maxRoots} 个。
3. **编号格式**: 必须使用点分十进制编号 (如 1.1.1)。
4. **命名格式**: "编号 英文术语 [中文标准译名]"。
5. **纯净输出**: 
   - 绝对不要输出频次数字！
   - 不要使用 Markdown 代码块。
   - 不要缩进，直接靠左对齐。

[输出示例]:
1. Physics [物理学]
1.1. Astrophysics [天体物理]
1.1.1. Black Holes [黑洞]
1.2. Fluid Dynamics [流体力学]
2. Computer Science [计算机科学]
2.1. Artificial Intelligence [人工智能]

[关键词特征信号 (含频次)]:
${topTags.join(", ")}
`;

        progress.setText("AI 正在构建体系 (约 30-60秒)...");
        
        try {
            let response = await win.fetch(this.config.api_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.config.api_key}` },
                body: JSON.stringify({
                    model: this.config.model,
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.3 
                })
            });

            if (!response.ok) {
                let errText = await response.text();
                throw new Error(`API Error ${response.status}: ${errText.substring(0, 100)}`);
            }

            let data = await response.json();
            let content = data.choices?.[0]?.message?.content || "";
            let cleanContent = content.replace(/```text/g, "").replace(/```/g, "").trim();

            await IOUtils.writeUTF8(savePath, cleanContent);

            // --- 日志优化点 2：在结果行首增加结束时间戳 ---
            let endTime = new Date().toLocaleString();
            await this.appendLog(logPath, `[${endTime}] [成功] 结构已保存至: ${savePath}\nAPI Token消耗: ${data.usage ? data.usage.total_tokens : '未知'}\n`);
            
            progress.setProgress(100);
            progress.setText("生成完成！");
            pw.addDescription(`文件已保存: ${savePath}`);

        } catch (e) {
            let endTime = new Date().toLocaleString();
            await this.appendLog(logPath, `[${endTime}] [错误] ${e.message}\n`);
            progress.setError();
            progress.setText("发生错误");
            pw.addDescription(e.message);
        }
        
        pw.startCloseTimer(5000);
    }

    async rebuildCollectionsFromTXT(win) {
        // 1. 安全警告
        if (!win.confirm("【严重警告】\n此操作将删除当前文库中的 **所有** 分类文件夹！\n\n文献本身不会被删除，但现有的分类结构将完全丢失。\n\n是否继续？")) {
            return;
        }
        
        // 2. 选择文件
        const fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        fp.init(win, "选择结构文件", Components.interfaces.nsIFilePicker.modeOpen);
        fp.appendFilter("TXT", "*.txt");
        let rv = await new Promise(r => fp.open(r));
        if (rv !== 0 && rv !== 2) return;
        
        let filePath = fp.file.path;
        let fileContent = await IOUtils.readUTF8(filePath);
        let lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");

        // 3. 确定操作文库
        let libraryID = Zotero.getActiveZoteroPane().getSelectedItems()[0]?.libraryID || Zotero.Libraries.userLibraryID;

        // 4. 初始化进度条
        let pw = new Zotero.ProgressWindow({ closeOnClick: false });
        pw.changeHeadline("重构目录");
        pw.show();
        let progress = new pw.ItemProgress("chrome://zotero/skin/tick.png", "准备中...");

        const logFilename = "Zotero_AI_Log.txt";
        const logPath = PathUtils.join(Zotero.DataDirectory.dir, logFilename);
        let startTime = new Date().toLocaleString();
        await this.appendLog(logPath, `\n========== 目录重构 [${startTime}] ==========\n`);

        try {
            // -----------------------------------------------------------------
            // 步骤 1: 逐个删除旧目录 (防超时核心修改)
            // -----------------------------------------------------------------
            progress.setText("正在获取旧目录列表...");
            let allCols = Zotero.Collections.getByLibrary(libraryID);
            // 只需删除顶层目录，子目录会自动消失
            let topLevelCols = allCols.filter(c => !c.parentID);
            
            if (topLevelCols.length > 0) {
                // 【关键修改】：不再使用 Zotero.DB.executeTransaction 包裹整个循环
                // 而是逐个删除，并让出主线程
                for (let i = 0; i < topLevelCols.length; i++) {
                    let col = topLevelCols[i];
                    
                    // 更新UI，让用户知道没卡死
                    progress.setText(`正在删除 (${i+1}/${topLevelCols.length}): ${col.name}...`);
                    progress.setProgress((i / topLevelCols.length) * 100);
                    
                    try {
                        // 删除单个目录树
                        await col.eraseTx(); 
                    } catch (err) {
                        await this.appendLog(logPath, `[警告] 删除 ${col.name} 失败: ${err.message}\n`);
                    }

                    // 【核心防超时】：强制休眠 100ms，让数据库喘口气
                    await new Promise(r => setTimeout(r, 100));
                }
            }
            
            await this.appendLog(logPath, `[状态] 旧目录删除完毕。开始创建新结构...\n`);

            // -----------------------------------------------------------------
            // 步骤 2: 逐个创建新目录
            // -----------------------------------------------------------------
            progress.setText("开始创建新目录...");
            let idMap = {}; 
            
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                // 匹配 "1.1.2 名称" 或 "1.1.2. 名称"
                let match = line.match(/^([\d\.]+)(?:\s|\.)+(.*)/);
                if (!match) continue; 

                let rawNumber = match[1];
                let numberId = rawNumber.endsWith('.') ? rawNumber.slice(0, -1) : rawNumber;
                let name = match[2].trim();

                let parentID = undefined;
                let lastDotIndex = numberId.lastIndexOf('.');
                if (lastDotIndex !== -1) {
                    let parentNumberId = numberId.substring(0, lastDotIndex);
                    if (idMap[parentNumberId]) parentID = idMap[parentNumberId];
                }

                // 创建 Collection
                let col = new Zotero.Collection();
                col.name = name; 
                col.libraryID = libraryID;
                if (parentID) col.parentID = parentID;
                
                await col.saveTx(); // 单次保存
                
                idMap[numberId] = col.id;
                
                // 【核心防超时】：创建时也强制休眠 50ms
                await new Promise(r => setTimeout(r, 50));

                // 更新进度显示 (每2条更新一次)
                if (i % 2 === 0) {
                    progress.setText(`创建: ${numberId} ${name.substring(0,10)}...`);
                    progress.setProgress((i / lines.length) * 100);
                }
            }
            
            progress.setProgress(100); 
            progress.setText("完成！");
            await this.appendLog(logPath, `[成功] 目录重构完成，处理 ${lines.length} 个节点。\n`);
            pw.addDescription("目录重构成功，请检查左侧栏。");

        } catch (e) {
            Zotero.debug(e);
            await this.appendLog(logPath, `[错误] ${e.message}\n`);
            progress.setError();
            progress.setText("发生错误");
            pw.addDescription(e.message);
        }
        
        pw.startCloseTimer(4000);
    }

    async startAutoClassification(win) {
        let items = Zotero.getActiveZoteroPane().getSelectedItems();
        items = items.filter(i => i.isRegularItem());

        if (items.length === 0) {
            win.alert("请先在主界面选中至少一篇论文！");
            return;
        }

        if (!this.config.api_key) {
            win.alert("请先在设置中配置 API Key！");
            this.openConfigDialog(win);
            return;
        }

        let { map: pathMap, list: pathList } = this.getCollectionMap();
        // --- 新增调试日志 ---
        const logFilename = "Zotero_AI_Log.txt";
        const logPath = PathUtils.join(Zotero.DataDirectory.dir, logFilename);
        await this.appendLog(logPath, `\n[DEBUG] 当前提供的所有可选分类路径 (共${pathList.length}个):\n${pathList.join("\n")}\n\n`); 
        // ------------------

        if (pathList.length === 0) {
            win.alert("当前文库没有任何分类文件夹，无法归类！");
            return;
        }
        if (pathList.length === 0) {
            win.alert("当前文库没有任何分类文件夹，无法归类！");
            return;
        }

        let thresholdStr = win.prompt("请输入归类置信度阈值 (0.0 - 1.0)", "0.9");
        if (thresholdStr === null) return;
        let threshold = parseFloat(thresholdStr);
        if (isNaN(threshold)) threshold = 0.9;

        let startTime = new Date().toLocaleString();
        await this.appendLog(logPath, `\n========== 新的归类任务开始 [${startTime}] 阈值:${threshold} ==========\n`);

        let unclassifiedName = "_Unclassified";
        let getUnclassifiedID = async () => {
            if (pathMap[unclassifiedName]) return pathMap[unclassifiedName];
            let newCol = new Zotero.Collection();
            newCol.name = unclassifiedName;
            newCol.libraryID = Zotero.Libraries.userLibraryID;
            await newCol.saveTx();
            pathMap[unclassifiedName] = newCol.id;
            return newCol.id;
        };

        let pw = new Zotero.ProgressWindow({ closeOnClick: false });
        pw.changeHeadline("Zotero AI: 智能归类");
        pw.show();
        let progress = new pw.ItemProgress("chrome://zotero/skin/tick.png", "准备中...");

        let successCount = 0;
        let unclassifiedCount = 0;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let title = item.getField('title');
            let itemID = item.id;
            let abstract = item.getField('abstractNote') || "无摘要";
            if (abstract.length > 500) abstract = abstract.substring(0, 500) + "...";
            let keywords = item.getTags().map(t => t.tag).join(", ");

            progress.setText(`分析中 (${i+1}/${items.length}): ${title.substring(0, 20)}...`);
            progress.setProgress((i / items.length) * 100);

            let prompt = `
你是一位精通**计算力学、天体物理与行星科学**的资深学术档案管理员。
请仔细分析以下论文的【标题】、【关键词】和【摘要】，并将其归类到给定的[叶子节点路径列表]中。

[待分类论文]:
标题: ${title}
关键词: ${keywords}
摘要: ${abstract}

[叶子节点路径列表] (候选池):
${pathList.join("\n")}

[分类决策规则 - 请严格执行]:
1. **多标签匹配 (Multi-label Classification)**: 
   - 论文可能涉及交叉学科。如果论文的核心内容同时**高度符合**多个不同的路径描述，请**同时选择**所有符合条件的路径。
   - 不要局限于只选一个，也不要强行选满多个，一切以内容匹配度为准。

2. **严格置信度过滤 (Confidence Threshold)**: 
   - 对于每一个候选路径，请评估其匹配置信度 (0.0 - 1.0)。
   - **仅保留**那些置信度严格大于 **${threshold}** 的路径。
   - 如果某路径仅仅是“沾边”或“提及”，但不是论文的核心研究点，其置信度通常不足，请**不要**选择。
   - **重要**：如果没有任何路径的置信度超过 ${threshold}，请直接返回空数组，不要强行归类。

3. **格式规范**: 
   - 返回的路径字符串必须与[叶子节点路径列表]中的内容**完全一致**（包括空格、符号）。
   - 不要截断路径，不要只返回最后一部分。

[输出格式]:
请仅返回纯 JSON 数据，不要包含 Markdown 标记：
{"paths": ["完整路径字符串A", "完整路径字符串B"]} 
或者如果没有匹配项：
{"paths": []}
`;

            let logResult = ""; 
            let rawResponseText = "";

            try {
                let response = await win.fetch(this.config.api_url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.config.api_key}` },
                    body: JSON.stringify({
                        model: this.config.model,
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.1
                    })
                });

                rawResponseText = await response.text();

                if (!response.ok) {
                    throw new Error(`API HTTP Error ${response.status}: ${rawResponseText.substring(0, 200).replace(/\n/g, " ")}`);
                }

                let data;
                try {
                    data = JSON.parse(rawResponseText);
                } catch (e) {
                    throw new Error("API Response is not JSON. Raw: " + rawResponseText.substring(0, 200));
                }

                let content = data.choices?.[0]?.message?.content;
                if (!content) {
                     throw new Error("Invalid API Structure: " + JSON.stringify(data));
                }
                
                let cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
                let result;
                try {
                    result = JSON.parse(cleanContent);
                } catch (e) {
                    throw new Error(`Model Output Invalid JSON. Model Said: ${cleanContent.replace(/\n/g, " ")}`);
                }

                item.setCollections([]); 
                let targetIDs = [];
                let targetNames = [];

                if (result.paths && Array.isArray(result.paths) && result.paths.length > 0) {
                    for (let p of result.paths) {
                        if (pathMap[p]) {
                            targetIDs.push(pathMap[p]);
                            targetNames.push(p);
                        }
                    }
                }

                if (targetIDs.length > 0) {
                    item.setCollections(targetIDs);
                    successCount++;
                    logResult = targetNames.join(" | ");
                } else {
                    let unID = await getUnclassifiedID();
                    item.addToCollection(unID);
                    unclassifiedCount++;
                    logResult = `${unclassifiedName} (未达阈值)`;
                }

                await item.saveTx();

            } catch (err) {
                let unID = await getUnclassifiedID();
                item.addToCollection(unID);
                unclassifiedCount++;
                logResult = `[ERROR] ${err.message}`; 
            }

            let nowStr = new Date().toLocaleString();
            let logLine = `[${nowStr}] [ID:${itemID}] ${title}\n    -> 结果: ${logResult}\n\n`;
            await this.appendLog(logPath, logLine);

            await sleep(1500); // 增加间隔以适应 API 速率限制
        }

        progress.setProgress(100);
        progress.setText("归类完成！");
        pw.addDescription(`日志已记录到:\n${logFilename}`);
        pw.startCloseTimer(5000);
    }

    async processAllItems(win) {
        // 1. 获取当前文库ID (兼容群组文库)
        let activeLibraryID = Zotero.getActiveZoteroPane().getSelectedItems()[0]?.libraryID || Zotero.Libraries.userLibraryID;

        // 2. 选择保存路径
        const fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        fp.init(win, "导出文献元数据 (JSON)", Components.interfaces.nsIFilePicker.modeSave);
        fp.appendFilter("JSON", "*.json");
        fp.defaultString = "Zotero_Metadata.json";
        let rv = await new Promise(r => fp.open(r));
        if (rv !== 0 && rv !== 2) return;
        let savePath = fp.file.path;

        // 3. 搜索文献
        let s = new Zotero.Search(); 
        s.libraryID = activeLibraryID;
        s.addCondition('itemType', 'isNot', 'attachment'); 
        s.addCondition('itemType', 'isNot', 'note');
        let itemIDs = await s.search();

        if (itemIDs.length === 0) { win.alert("当前文库无有效文献"); return; }

        // 4. 初始化 UI 和 日志
        let pw = new Zotero.ProgressWindow({ closeOnClick: false });
        pw.changeHeadline("导出元数据");
        pw.show();
        let progress = new pw.ItemProgress("chrome://zotero/skin/tick.png", "正在读取文献...");

        const logFilename = "Zotero_AI_Log.txt";
        const logPath = PathUtils.join(Zotero.DataDirectory.dir, logFilename);
        let startTime = new Date().toLocaleString();
        
        await this.appendLog(logPath, `\n========== 文献元数据导出任务 [${startTime}] ==========\n目标文件: ${savePath}\n`);

        let items = await Zotero.Items.getAsync(itemIDs);
        let exportData = [];
        let missingCount = 0;

        // 5. 遍历处理
        for(let i=0; i<items.length; i++) {
            let item = items[i];
            let title = item.getField('title');
            let abstract = item.getField('abstractNote') || ""; // 缺失则为空字符串
            
            // 获取关键词数组并转为字符串
            let tagsArray = item.getTags().map(t => t.tag);
            let keywords = tagsArray.join(", "); 

            // --- 检查缺失信息 ---
            let missingFields = [];
            if (!abstract || abstract.trim() === "") missingFields.push("摘要");
            if (tagsArray.length === 0) missingFields.push("关键词");

            // 如果有缺失，写入日志
            if (missingFields.length > 0) {
                missingCount++;
                let logLine = `[缺失信息] [ID:${item.id}] ${title.substring(0, 40)}...\n    -> 缺少: ${missingFields.join("、")}\n`;
                await this.appendLog(logPath, logLine);
            }

            // 构建数据对象
            exportData.push({
                id: item.id,
                title: title,
                abstract: abstract,
                keywords: keywords
            });

            // 更新进度条 (每50条更新一次)
            if(i % 50 === 0) {
                progress.setProgress((i / items.length) * 100);
                progress.setText(`处理中: ${i} / ${items.length}`);
                // 稍微休眠防止界面卡死
                await new Promise(r => setTimeout(r, 5));
            }
        }

        // 6. 保存文件
        try {
            await IOUtils.writeUTF8(savePath, JSON.stringify(exportData, null, 2));
            await this.appendLog(logPath, `[完成] 成功导出 ${items.length} 条文献。其中 ${missingCount} 条存在信息缺失，详情见上文。\n`);
            
            progress.setProgress(100);
            progress.setText("导出完成！");
            pw.addDescription(`文件已保存: ${savePath}`);
            pw.addDescription(`发现 ${missingCount} 条文献缺少摘要或关键词，已记录到日志。`);
        } catch (e) {
            await this.appendLog(logPath, `[错误] 文件保存失败: ${e.message}\n`);
            progress.setError();
            pw.addDescription("保存失败: " + e.message);
        }

        pw.startCloseTimer(5000);
    }

    async exportTreeToTXT(win) { 
        let { list } = this.getCollectionMap();
        if (list.length === 0) { win.alert("无文件夹"); return; }
        const fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        fp.init(win, "保存", Components.interfaces.nsIFilePicker.modeSave);
        fp.appendFilter("TXT", "*.txt"); fp.defaultString = "Zotero_Tree.txt";
        let rv = await new Promise(r => fp.open(r));
        if (rv === 0 || rv === 2) await IOUtils.writeUTF8(fp.file.path, list.join("\n"));
    }

    async exportAllKeywords(win) { 
        let libraryID = Zotero.Libraries.userLibraryID;
        let s = new Zotero.Search(); s.libraryID = libraryID;
        s.addCondition('itemType', 'isNot', 'attachment'); s.addCondition('itemType', 'isNot', 'note');
        let itemIDs = await s.search();
        let items = await Zotero.Items.getAsync(itemIDs);
        let uniqueTags = new Set();
        for (let item of items) { item.getTags().forEach(t => uniqueTags.add(t.tag)); }
        let sorted = Array.from(uniqueTags).sort((a,b)=>a.localeCompare(b,'zh'));
        const fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
        fp.init(win, "保存关键词", Components.interfaces.nsIFilePicker.modeSave);
        fp.appendFilter("TXT", "*.txt"); fp.defaultString = "Keywords.txt";
        let rv = await new Promise(r => fp.open(r));
        if (rv === 0 || rv === 2) await IOUtils.writeUTF8(fp.file.path, sorted.join(", "));
    }
}

function install() {}
function uninstall() {}
async function startup({ id, version, resourceURI, rootURI }) {
    await Zotero.uiReadyPromise;
    let win = Zotero.getMainWindow();
    zoteroAIPlugin = new ZoteroAI_Plugin();
    await zoteroAIPlugin.init();
    zoteroAIPlugin.injectMenu(win);
}
function shutdown() {
    if (zoteroAIPlugin && zoteroAIPlugin.mainMenu) zoteroAIPlugin.mainMenu.remove();

}

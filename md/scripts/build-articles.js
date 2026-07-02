/**
 * Article build script
 * Reads Markdown files from md/ directory, generates HTML files in articles/ directory
 * 
 * Directory structure:
 *   md/养生知识/形意拳与养生之道.md  →  articles/yangsheng-zhishi/xingyiquan-yu-yangsheng-zhi-dao.html
 *   md/养生知识/                     →  articles/yangsheng-zhishi/index.html (category list page)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const { pinyin } = require('pinyin-pro');

// 路径配置
const MD_DIR = path.resolve(__dirname, '..');
const ARTICLES_DIR = path.resolve(__dirname, '../../articles');
const TEMPLATES_DIR = path.resolve(__dirname, '../templates');

// 分类拼音映射（手动维护，确保 URL 美观）
const CATEGORY_PINYIN_MAP = {
    '拳法解析': 'quanfa-jiexi',
    '养生知识': 'yangsheng-zhishi',
    '防身技巧': 'fangshen-jiqiao',
    '学员故事': 'xueyuan-gushi'
};

// 月份中文映射
const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

/**
 * 中文转拼音（用连字符连接，全小写）
 */
function toPinyin(text) {
    return pinyin(text, { toneType: 'none', type: 'array', mode: 'normal' })
        .filter(s => s)
        .join('-')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

/**
 * 获取分类的拼音名
 */
function getCategoryPinyin(category) {
    if (CATEGORY_PINYIN_MAP[category]) {
        return CATEGORY_PINYIN_MAP[category];
    }
    return toPinyin(category);
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
function formatDate(date) {
    if (typeof date === 'string') {
        return date.split('T')[0];
    }
    if (date instanceof Date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    return String(date);
}

/**
 * 从日期中提取日
 */
function getDay(dateStr) {
    const d = new Date(dateStr);
    return d.getDate();
}

/**
 * 从日期中提取月份中文
 */
function getMonth(dateStr) {
    const d = new Date(dateStr);
    return MONTH_NAMES[d.getMonth()];
}

/**
 * 读取模板文件
 */
function readTemplate(name) {
    return fs.readFileSync(path.join(TEMPLATES_DIR, name), 'utf-8');
}

/**
 * 扫描 md/ 目录，收集所有文章信息
 */
function scanArticles() {
    const articles = [];

    const entries = fs.readdirSync(MD_DIR, { withFileTypes: true });
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (['scripts', 'templates', 'node_modules'].includes(entry.name)) continue;

        const categoryDir = path.join(MD_DIR, entry.name);
        const category = entry.name;
        const categoryPinyin = getCategoryPinyin(category);

        const mdFiles = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
        for (const mdFile of mdFiles) {
            const filePath = path.join(categoryDir, mdFile);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { data, content } = matter(fileContent);

            const nameWithoutExt = mdFile.replace('.md', '');
            const articlePinyin = data.slug || toPinyin(nameWithoutExt);
            const dateFormatted = formatDate(data.date || new Date().toISOString().split('T')[0]);

            articles.push({
                title: data.title || nameWithoutExt,
                date: dateFormatted,
                author: data.author || '形意归真',
                category,
                categoryPinyin,
                summary: data.summary || '',
                content,
                htmlContent: marked(content),
                articlePinyin,
                day: getDay(data.date || new Date()),
                month: getMonth(data.date || new Date()),
                relativePath: `${categoryPinyin}/${articlePinyin}.html`
            });
        }
    }

    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    return articles;
}

/**
 * 生成文章详情页
 */
function buildArticlePage(article, template) {
    let html = template;
    html = html.replace(/\{\{title\}\}/g, article.title);
    html = html.replace(/\{\{date\}\}/g, article.date);
    html = html.replace(/\{\{author\}\}/g, article.author);
    html = html.replace(/\{\{category\}\}/g, article.category);
    html = html.replace(/\{\{categoryPinyin\}\}/g, article.categoryPinyin);
    html = html.replace(/\{\{articlePinyin\}\}/g, article.articlePinyin);
    html = html.replace(/\{\{summary\}\}/g, article.summary);
    html = html.replace(/\{\{content\}\}/g, article.htmlContent);
    return html;
}

/**
 * 生成分类列表页（列表形式）
 */
function buildCategoryPage(category, categoryPinyin, articles, template) {
    const items = articles.map(article => `
                <a href="${article.articlePinyin}.html" class="article-list-item">
                    <div class="article-item-date">
                        <span class="article-item-date-day">${article.day}</span>
                        <span class="article-item-date-month">${article.month}</span>
                    </div>
                    <div class="article-list-item-right">
                        <div class="article-item-title">${article.title}</div>
                        <div class="article-item-summary">${article.summary}</div>
                    </div>
                    <span class="article-item-arrow">›</span>
                </a>`).join('\n');

    let html = template;
    html = html.replace(/\{\{category\}\}/g, category);
    html = html.replace(/\{\{categoryPinyin\}\}/g, categoryPinyin);
    html = html.replace(/\{\{articleCards\}\}/g, items);
    return html;
}

/**
 * 主构建流程
 */
function build() {
    console.log('Building articles...');

    if (fs.existsSync(ARTICLES_DIR)) {
        fs.rmSync(ARTICLES_DIR, { recursive: true });
    }
    fs.mkdirSync(ARTICLES_DIR, { recursive: true });

    const articles = scanArticles();
    console.log(`Found ${articles.length} articles`);

    const articleTemplate = readTemplate('article.html');
    const categoryTemplate = readTemplate('category.html');

    const categoryMap = {};
    for (const article of articles) {
        if (!categoryMap[article.category]) {
            categoryMap[article.category] = [];
        }
        categoryMap[article.category].push(article);
    }

    for (const [category, categoryArticles] of Object.entries(categoryMap)) {
        const categoryPinyin = getCategoryPinyin(category);
        const categoryDir = path.join(ARTICLES_DIR, categoryPinyin);

        fs.mkdirSync(categoryDir, { recursive: true });

        const categoryHtml = buildCategoryPage(category, categoryPinyin, categoryArticles, categoryTemplate);
        fs.writeFileSync(path.join(categoryDir, 'index.html'), categoryHtml, 'utf-8');
        console.log(`  Category: ${categoryPinyin}/index.html`);

        for (const article of categoryArticles) {
            const articleHtml = buildArticlePage(article, articleTemplate);
            const articlePath = path.join(categoryDir, `${article.articlePinyin}.html`);
            fs.writeFileSync(articlePath, articleHtml, 'utf-8');
            console.log(`  Article: ${categoryPinyin}/${article.articlePinyin}.html`);
        }
    }

    console.log(`Done! ${Object.keys(categoryMap).length} categories, ${articles.length} articles`);
}

build();

#!/usr/bin/env node
/**
 * 智能安全帽 · 静态站点生成器
 * 替代 Jekyll，使用 Node.js 构建 GitHub Pages 站点
 */

const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const sass = require('sass');

// ===== 配置 =====
const CONFIG = {
  title: '智能安全帽 · 项目进度',
  description: '智慧工地安全解决方案 — 研发进度汇报',
  url: 'https://ysdcedarqu.github.io',
  baseurl: '/zhinenganquanmao',
  sourceDir: __dirname + '/..',
  outputDir: path.join(__dirname, '..', '_site'),
};

const SOURCE = CONFIG.sourceDir;

// ===== 工具函数 =====
function relativeUrl(p) {
  if (!p) return CONFIG.baseurl;
  const base = CONFIG.baseurl || '';
  const normalized = p.startsWith('/') ? p : '/' + p;
  return base + normalized;
}

function parseDate(str) {
  if (!str) return new Date();
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
}

function formatDate(date, fmt) {
  const d = parseDate(date);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (fmt === 'ymd') return `${y} 年 ${m} 月 ${day} 日`;
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function statusBadge(status) {
  const map = {
    'completed': 'badge-success',
    '已完成': 'badge-success',
    'active': 'badge-warning',
    '进行中': 'badge-warning',
    'blocked': 'badge-danger',
    '阻塞': 'badge-danger',
    'open': 'badge-info',
    '未开始': 'badge-info',
    'closed': 'badge-success',
    '已解决': 'badge-success',
  };
  const cls = map[status] || 'badge-muted';
  return `<span class="badge ${cls}">${status}</span>`;
}

function severityBadge(severity) {
  const map = { '高': 'badge-danger', '中': 'badge-warning', '低': 'badge-info' };
  const cls = map[severity] || 'badge-muted';
  return `<span class="badge ${cls}">${severity}</span>`;
}

// 配置 marked
marked.setOptions({ breaks: true, gfm: true });

// ===== 数据收集 =====
function collectData() {
  const data = {
    site: { ...CONFIG, time: Date.now() },
    posts: [],
    issues: [],
    processPages: [],
    pages: [],
  };

  // 收集周报 (_posts/weekly/*.md)
  const postsDir = path.join(SOURCE, '_posts', 'weekly');
  if (fs.existsSync(postsDir)) {
    fs.readdirSync(postsDir)
      .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
      .forEach(f => {
      const raw = fs.readFileSync(path.join(postsDir, f), 'utf-8');
      const { data: fm, content } = matter(raw);
      if (fm.published === false) return; // 跳过未发布
      data.posts.push({
        ...fm,
        content: marked.parse(content),
        rawContent: content,
        url: relativeUrl('/weekly/' + f.replace('.md', '.html')),
        filename: f,
      });
    });
  }
  // 按日期倒序，无效日期的排到最后
  data.posts.sort((a, b) => {
    const da = parseDate(a.date);
    const db = parseDate(b.date);
    return db - da;
  });

  // 收集问题 (_issues/*.md)
  const issuesDir = path.join(SOURCE, '_issues');
  if (fs.existsSync(issuesDir)) {
    fs.readdirSync(issuesDir).filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md').forEach(f => {
      const raw = fs.readFileSync(path.join(issuesDir, f), 'utf-8');
      const { data: fm, content } = matter(raw);
      data.issues.push({
        ...fm,
        content: marked.parse(content),
        rawContent: content,
        url: relativeUrl('/issues/' + f.replace('.md', '.html')),
        filename: f,
      });
    });
  }

  // 收集流程页面 (process/*.md)
  const processDir = path.join(SOURCE, 'process');
  if (fs.existsSync(processDir)) {
    fs.readdirSync(processDir).filter(f => f.endsWith('.md')).forEach(f => {
      const raw = fs.readFileSync(path.join(processDir, f), 'utf-8');
      const { data: fm, content } = matter(raw);
      data.processPages.push({
        ...fm,
        content: marked.parse(content),
        rawContent: content,
        url: relativeUrl('/process/' + f.replace('.md', '.html')),
        filename: f,
        path: 'process/' + f,
      });
    });
  }
  data.processPages.sort((a, b) => (a.phase || 0) - (b.phase || 0));

  // 首页 (index.md)
  const indexRaw = fs.readFileSync(path.join(SOURCE, 'index.md'), 'utf-8');
  const indexParsed = matter(indexRaw);
  data.indexData = {
    ...indexParsed.data,
    content: indexParsed.content,
    url: relativeUrl('/'),
  };

  // 计算统计数据
  data.stats = {
    openIssues: data.issues.filter(i => i.status === 'open').length,
    totalIssues: data.issues.length,
    currentPhase: data.processPages.find(p => p.status === '进行中') || null,
    totalPhases: data.processPages.length,
    latestPost: data.posts[0] || null,
  };

  return data;
}

// ===== 构建流程 =====
async function build() {
  console.log('🔨 开始构建智能安全帽站点...\n');

  // 1. 收集数据
  console.log('📊 收集数据...');
  const data = collectData();
  console.log(`   - ${data.posts.length} 篇周报`);
  console.log(`   - ${data.issues.length} 个问题`);
  console.log(`   - ${data.processPages.length} 个流程阶段\n`);

  // 2. 编译 SCSS — 直接编译主样式文件
  console.log('🎨 编译 SCSS...');
  const scssPath = path.join(SOURCE, '_sass', 'main.scss');
  let cssResult;
  try {
    cssResult = sass.compile(scssPath, {
      style: 'compressed',
    });
    console.log('   ✓ SCSS 编译完成\n');
  } catch (err) {
    console.error('   ✗ SCSS 编译失败:', err.message);
    cssResult = null;
  }

  // 3. 清空输出目录
  const outDir = CONFIG.outputDir;
  fs.emptyDirSync(outDir);

  // 4. 复制静态资源
  console.log('📁 复制静态资源...');
  if (cssResult) {
    fs.outputFileSync(path.join(outDir, 'assets', 'css', 'style.css'), cssResult.css);
  }

  // 复制图片资源
  const imagesDir = path.join(SOURCE, 'assets', 'images');
  if (fs.existsSync(imagesDir)) {
    const outImagesDir = path.join(outDir, 'assets', 'images');
    fs.copySync(imagesDir, outImagesDir);
    const imgCount = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.')).length;
    console.log(`   ✓ 已复制 ${imgCount} 张图片`);
  }

  // 5. 渲染首页
  console.log('📄 渲染首页...');
  const indexHtml = renderIndex(data);
  fs.outputFileSync(path.join(outDir, 'index.html'), indexHtml);

  // 6. 渲染周报页面
  console.log('📄 渲染周报页面...');
  for (const post of data.posts) {
    const html = renderPost(post, data);
    const outPath = post.url.replace(CONFIG.baseurl, '');
    fs.outputFileSync(path.join(outDir, outPath), html);
  }
  console.log(`   - ${data.posts.length} 篇周报已生成`);

  // 7. 渲染问题页面
  console.log('📄 渲染问题页面...');
  for (const issue of data.issues) {
    const html = renderIssue(issue, data);
    const outPath = issue.url.replace(CONFIG.baseurl, '');
    fs.outputFileSync(path.join(outDir, outPath), html);
  }
  console.log(`   - ${data.issues.length} 个问题页面已生成`);

  // 8. 渲染流程页面
  console.log('📄 渲染流程页面...');
  for (const proc of data.processPages) {
    const html = renderProcess(proc, data);
    const outPath = proc.url.replace(CONFIG.baseurl, '');
    fs.outputFileSync(path.join(outDir, outPath), html);
  }
  console.log(`   - ${data.processPages.length} 个流程页面已生成`);

  // 9. 创建 .nojekyll 文件
  fs.outputFileSync(path.join(outDir, '.nojekyll'), '');

  console.log(`\n✅ 构建完成！输出目录: ${outDir}`);
  console.log(`   使用 'npm run serve' 本地预览，或部署到 GitHub Pages\n`);
}

// ===== 页面渲染函数 =====
function getInclude(name) {
  const incPath = path.join(SOURCE, '_includes', name);
  if (fs.existsSync(incPath)) {
    return fs.readFileSync(incPath, 'utf-8');
  }
  return '';
}

function renderLayout(page, data, bodyContent) {
  // 读取布局文件
  let layoutHtml = fs.readFileSync(path.join(SOURCE, '_layouts', 'default.html'), 'utf-8');

  // 先处理 include 文件中的 relative_url
  function processIncludes(html) {
    return html.replace(/\{\{\s*['"]([^'"]+)['"]\s*\|\s*relative_url\s*\}\}/g, (match, url) => {
      return relativeUrl(url);
    });
  }

  // 替换 include
  const navHtml = processIncludes(getInclude('nav.html'));
  const footerHtml = processIncludes(getInclude('footer.html'));

  // 构建完整的 HTML
  const title = (page.title ? page.title + ' · ' : '') + data.site.title;

  // 处理 seo 标签
  const seoMeta = `
  <meta name="description" content="${page.description || data.site.description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${page.description || data.site.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${data.site.url}${page.url || '/'}">
  `;

  // 替换布局中的 Liquid 标签（注意顺序：先替换 include，再处理其他）
  let html = layoutHtml
    .replace(/\{%\s*include\s+nav\.html\s*%\}/g, navHtml)
    .replace(/\{%\s*include\s+footer\.html\s*%\}/g, footerHtml)
    .replace(/\{\{\s*content\s*\}\}/g, bodyContent)
    .replace(/\{\{\s*['"][^'"]+['"]\s*\|\s*relative_url\s*\}\}/g, (match) => {
      const urlMatch = match.match(/['"]([^'"]+)['"]/);
      return urlMatch ? relativeUrl(urlMatch[1]) : match;
    })
    .replace(/\{%\s*seo\s*%\}/g, seoMeta)
    .replace(/\{\{\s*site\.title\s*\}\}/g, data.site.title)
    .replace(/\{\{\s*site\.description\s*\}\}/g, data.site.description);

  // 处理页面标题条件
  html = html.replace(/\{%\s*if\s+page\.title\s*%\}\s*\{\{\s*page\.title\s*\}\}\s*·\s*\{%\s*endif\s*%\}/g,
    page.title ? page.title + ' · ' : '');

  return html;
}

function renderIndex(data) {
  const stats = data.stats;
  const openIssues = stats.openIssues;
  const totalIssues = stats.totalIssues;
  const currentPhase = stats.currentPhase;
  const totalPhases = stats.totalPhases;
  const latestPost = stats.latestPost;
  const progress = latestPost ? latestPost.progress : 0;

  // 状态卡片
  const statusCardsHtml = `
    <div class="status-card">
      <div class="card-label">当前阶段</div>
      <div class="card-value" style="font-size: 1.4rem;">${currentPhase ? currentPhase.title : '未开始'}</div>
      <div class="card-sub">阶段 ${currentPhase ? currentPhase.phase : '—'}/${totalPhases}</div>
    </div>
    <div class="status-card">
      <div class="card-label">整体进度</div>
      <div class="card-value">${progress}%</div>
      <div class="progress-bar" style="margin-top: 12px;">
        <div class="progress-fill" style="width: ${progress}%;"></div>
      </div>
    </div>
    <div class="status-card">
      <div class="card-label">待解决问题</div>
      <div class="card-value">${openIssues}</div>
      <div class="card-sub">${totalIssues} 个问题总计</div>
    </div>
    <div class="status-card">
      <div class="card-label">最新周报</div>
      <div class="card-value" style="font-size: 1.1rem;">${latestPost ? latestPost.title : '暂无'}</div>
      <div class="card-sub">${latestPost ? formatDate(latestPost.date, 'ymd') : ''}</div>
    </div>`;

  // 流程时间线
  const timelineItems = data.processPages.map(p => {
    let cls = '';
    if (p.status === '已完成') cls = 'completed';
    else if (p.status === '进行中') cls = 'active';
    return `<a href="${p.url}" class="timeline-step ${cls}">
      <div class="step-dot">${p.icon || '📋'}</div>
      <div class="step-label">${p.title}</div>
    </a>`;
  }).join('\n');

  const currentPhaseHtml = currentPhase ? `
    <div style="display: inline-flex; align-items: center; gap: 12px; padding: 12px 28px; background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.15); border-radius: 50px;">
      <span style="color: var(--primary); font-weight: 700;">当前阶段：${currentPhase.title}</span>
      <span style="color: var(--text-muted);">—</span>
      <span style="color: var(--primary);">进度 ${currentPhase.progress || 0}%</span>
    </div>` : '';

  // 最新周报入口（点击查看，不预览内容）
  let latestPostHtml = '';
  if (latestPost) {
    latestPostHtml = `
      <div class="fade-in" style="margin-bottom: 2rem; text-align: center;">
        <a href="${latestPost.url}" style="display: inline-block; padding: 20px 40px; background: var(--bg-card); border: 1px solid var(--border-active); border-radius: 16px; transition: all 0.3s;">
          <p style="color: var(--primary); font-size: 0.9rem; font-weight: 600; letter-spacing: 1px; margin-bottom: 0.5rem;">📋 最新周报 · ${formatDate(latestPost.date, 'ymd')}</p>
          <p style="font-size: 1.3rem; font-weight: 700; color: #fff; margin: 0;">${latestPost.title}</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">进度 ${progress}% · 点击查看 →</p>
        </a>
      </div>`;
  }

  // 历史周报列表
  const olderPosts = data.posts.slice(1);
  const weeklyListHtml = olderPosts.length > 0 ? `
    <div class="fade-in">
      <h3 style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1.5rem; letter-spacing: 1px;">历史周报</h3>
      <div style="display: grid; gap: 1rem;">
        ${olderPosts.map(p => `
          <a href="${p.url}" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; transition: all 0.3s;">
            <div>
              <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">${p.title}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${formatDate(p.date, 'ymd')}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 0.85rem; color: var(--primary); font-weight: 700;">${p.progress || 0}%</span>
            </div>
          </a>`).join('\n')}
      </div>
    </div>` : '';

  // 问题追踪列表
  const openIssueList = data.issues.filter(i => i.status === 'open');
  const resolvedIssueList = data.issues.filter(i => i.status !== 'open');
  const issuesHtml = `
    <div class="fade-in" style="margin-bottom: 2rem;">
      <h3 style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1.5rem; letter-spacing: 1px;">
        待解决问题 (${openIssueList.length})
      </h3>
      <div style="display: grid; gap: 1rem;">
        ${openIssueList.map(i => `
          <a href="${i.url}" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; transition: all 0.3s;">
            <div>
              <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">${i.title}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${formatDate(i.date, 'ymd')}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${severityBadge(i.severity)}
              ${statusBadge(i.status)}
            </div>
          </a>`).join('\n')}
        ${openIssueList.length === 0 ? '<p style="color: var(--text-muted); text-align: center;">暂无待解决问题 🎉</p>' : ''}
      </div>
    </div>
    ${resolvedIssueList.length > 0 ? `
    <div class="fade-in">
      <h3 style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1.5rem; letter-spacing: 1px;">
        已解决问题 (${resolvedIssueList.length})
      </h3>
      <div style="display: grid; gap: 1rem;">
        ${resolvedIssueList.map(i => `
          <a href="${i.url}" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; opacity: 0.7;">
            <div>
              <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">${i.title}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted);">${formatDate(i.date, 'ymd')}</div>
            </div>
            <div>${statusBadge('已解决')}</div>
          </a>`).join('\n')}
      </div>
    </div>` : ''}`;

  // 组装首页内容
  const bodyContent = `
<section class="hero">
  <div class="hero-content">
    <span class="hero-badge">SMART CONSTRUCTION · SAFETY FIRST</span>
    <h1 class="hero-title">智能安全帽 · 项目进度</h1>
    <p class="hero-desc">集佩戴检测、姿态监测、实时定位、应急呼救、语音交互于一体的新一代工地安全解决方案</p>
    <div class="hero-stats">
      <div class="stat-item">
        <div class="stat-value">${currentPhase ? currentPhase.phase : '—'}/${totalPhases}</div>
        <div class="stat-label">当前阶段</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${progress}%</div>
        <div class="stat-label">整体进度</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${openIssues}</div>
        <div class="stat-label">待解决问题</div>
      </div>
    </div>
  </div>
</section>

<section id="overview" class="container">
  <div class="section">
    <div class="section-header fade-in">
      <h2>项目状态总览</h2>
      <p>关键指标实时监控</p>
    </div>
    <div class="status-cards fade-in">
      ${statusCardsHtml}
    </div>
  </div>
</section>

<section id="process" class="section-alt">
  <div class="container">
    <div class="section">
      <div class="section-header fade-in">
        <h2>研发流程</h2>
        <p>从需求分析到部署交付的全流程</p>
      </div>
      <div class="timeline fade-in">
        ${timelineItems}
      </div>
      ${currentPhaseHtml ? `<div style="text-align: center; margin-top: 2.5rem;" class="fade-in">${currentPhaseHtml}</div>` : ''}
    </div>
  </div>
</section>

<section id="weekly">
  <div class="container">
    <div class="section">
      <div class="section-header fade-in">
        <h2>周报</h2>
        <p>每周研发进展记录</p>
      </div>
      ${latestPostHtml}
      ${weeklyListHtml}
    </div>
  </div>
</section>

<section id="issues">
  <div class="container">
    <div class="section">
      <div class="section-header fade-in">
        <h2>问题跟踪</h2>
        <p>研发过程中的问题记录与解决追踪</p>
      </div>
      ${issuesHtml}
    </div>
  </div>
</section>`;

  return renderLayout({ title: '项目进度总览', url: '/' }, data, bodyContent);
}

function renderPost(post, data) {
  const issuesHtml = (post.issues && post.issues.length > 0) ? `
    <div class="info-panel panel-danger">
      <h3>遇到的问题</h3>
      <ul>${post.issues.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>` : '';
  const nextPlanHtml = (post.next_plan && post.next_plan.length > 0) ? `
    <div class="info-panel panel-success">
      <h3>下周计划</h3>
      <ul>${post.next_plan.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>` : '';

  const bodyContent = `
<div class="container">
  <div class="section">
    <a href="${relativeUrl('/')}#weekly" class="page-back">&larr; 返回周报列表</a>

    <p style="color: var(--primary); font-size: 1.4rem; font-weight: 700; letter-spacing: 2px; margin-bottom: 0.5rem;">
      ${formatDate(post.date, 'ymd')}
      ${post.org ? ' &nbsp;·&nbsp; ' + post.org : ''}
      ${post.reporter ? ' &nbsp;·&nbsp; ' + post.reporter : ''}
    </p>
    <h1 class="page-title">${post.title}</h1>

    ${post.progress !== undefined ? `
    <div style="margin: 1.5rem 0 2rem; max-width: 480px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-size: 0.8rem; color: var(--text-muted); letter-spacing: 1px;">本周进度</span>
        <span style="font-size: 0.85rem; color: var(--primary); font-weight: 700;">${post.progress}%</span>
      </div>
      <div class="progress-bar-lg">
        <div class="progress-fill" style="width: ${post.progress}%;"></div>
      </div>
    </div>` : ''}

    <div id="protected-content" style="display: none;">
      <div class="post-content">
        ${post.content || ''}
      </div>

      ${issuesHtml}
      ${nextPlanHtml}
    </div>

    <div id="password-gate" style="text-align: center; padding: 3rem 1rem;">
      <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 1rem;">🔒 此内容需要密码访问</p>
      <input type="password" id="pwd-input" placeholder="请输入访问密码" style="padding: 0.6rem 1rem; font-size: 1rem; border: 1px solid var(--border); border-radius: 6px; background: var(--bg-card); color: var(--text); width: 240px; max-width: 80%; text-align: center;" />
      <button id="pwd-submit" style="display: block; margin: 1rem auto 0; padding: 0.5rem 2rem; font-size: 0.95rem; background: var(--primary); color: #fff; border: none; border-radius: 6px; cursor: pointer;">确认</button>
      <p id="pwd-error" style="color: #f56c6c; font-size: 0.85rem; margin-top: 0.8rem; display: none;">密码错误，请重试</p>
    </div>
  </div>
</div>

<script>
  (function() {
    var gate = document.getElementById('password-gate');
    var content = document.getElementById('protected-content');
    var input = document.getElementById('pwd-input');
    var btn = document.getElementById('pwd-submit');
    var err = document.getElementById('pwd-error');

    if (sessionStorage.getItem('weekly-auth') === '1') {
      gate.style.display = 'none';
      content.style.display = 'block';
      return;
    }

    function check() {
      if (input.value === 'ysdznaqm') {
        sessionStorage.setItem('weekly-auth', '1');
        gate.style.display = 'none';
        content.style.display = 'block';
      } else {
        err.style.display = 'block';
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', check);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') check();
    });
    input.focus();
  })();
</script>`;

  return renderLayout(post, data, bodyContent);
}

function renderIssue(issue, data) {
  const resolutionHtml = issue.resolution ? `
    <div class="info-panel panel-success">
      <h3>解决方案</h3>
      <p>${issue.resolution}</p>
    </div>` : '';

  const bodyContent = `
<div class="container">
  <div class="section">
    <a href="${relativeUrl('/')}#issues" class="page-back">&larr; 返回问题列表</a>

    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 1rem;">
      <h1 class="page-title" style="margin-bottom: 0;">${issue.title}</h1>
      ${statusBadge(issue.status || 'open')}
    </div>

    <div class="page-meta">
      <div class="meta-item">
        <div class="meta-label">严重程度</div>
        <div class="meta-value">${severityBadge(issue.severity || '中')}</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">提出日期</div>
        <div class="meta-value">${formatDate(issue.date, 'ymd')}</div>
      </div>
      ${issue.resolution_date ? `
      <div class="meta-item">
        <div class="meta-label">解决日期</div>
        <div class="meta-value">${formatDate(issue.resolution_date, 'ymd')}</div>
      </div>` : ''}
    </div>

    <div class="post-content">
      ${issue.content || ''}
    </div>

    ${resolutionHtml}
  </div>
</div>`;

  return renderLayout(issue, data, bodyContent);
}

function renderProcess(proc, data) {
  const idx = data.processPages.findIndex(p => p.filename === proc.filename);
  const prevPage = idx > 0 ? data.processPages[idx - 1] : null;
  const nextPage = idx < data.processPages.length - 1 ? data.processPages[idx + 1] : null;

  const bodyContent = `
<div class="container">
  <div class="section">
    <a href="${relativeUrl('/')}#process" class="page-back">&larr; 返回流程总览</a>

    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 0.5rem;">
      <span style="font-size: 2.4rem; filter: drop-shadow(0 0 12px rgba(0,229,255,0.3));">${proc.icon || '📋'}</span>
      <div>
        <p style="font-size: 0.8rem; color: var(--primary); font-weight: 600; letter-spacing: 2px; margin-bottom: 2px;">PHASE ${proc.phase || '?'} / ${data.processPages.length}</p>
        <h1 class="page-title" style="margin-bottom: 0;">${proc.title}</h1>
      </div>
      ${statusBadge(proc.status || '未开始')}
    </div>

    ${proc.progress !== undefined ? `
    <div style="margin: 2rem 0;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span style="font-size: 0.8rem; color: var(--text-muted); letter-spacing: 1px;">阶段进度</span>
        <span style="font-size: 0.9rem; color: var(--primary); font-weight: 700;">${proc.progress}%</span>
      </div>
      <div class="progress-bar-lg">
        <div class="progress-fill" style="width: ${proc.progress}%;"></div>
      </div>
    </div>` : ''}

    <div class="post-content">
      ${proc.content || ''}
    </div>

    <div class="process-nav">
      ${prevPage ? `<a href="${prevPage.url}" style="color: var(--text-muted);">&larr; 上一阶段</a>` : '<span></span>'}
      ${nextPage ? `<a href="${nextPage.url}" style="color: var(--primary);">下一阶段 &rarr;</a>` : '<span></span>'}
    </div>
  </div>
</div>`;

  return renderLayout(proc, data, bodyContent);
}

// ===== 执行构建 =====
build().catch(err => {
  console.error('构建失败:', err);
  process.exit(1);
});

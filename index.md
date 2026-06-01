---
layout: default
title: 项目进度总览
---

<!-- Hero -->
<section class="hero">
  <div class="hero-content">
    <span class="hero-badge">SMART CONSTRUCTION · SAFETY FIRST</span>
    <h1 class="hero-title">智能安全帽 · 项目进度</h1>
    <p class="hero-desc">集佩戴检测、姿态监测、实时定位、应急呼救、语音交互于一体的新一代工地安全解决方案</p>
    <div class="hero-stats">
      {% assign open_issues = site.issues | where: 'status', 'open' %}
      {% assign current_phase = site.pages | where: 'status', '进行中' | first %}
      {% assign total_phases = site.pages | where_exp: "p", "p.phase" | size %}
      {% assign latest_post = site.posts | first %}
      <div class="stat-item">
        <div class="stat-value">{{ current_phase.phase | default: "—" }}/{{ total_phases }}</div>
        <div class="stat-label">当前阶段</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{% if latest_post %}{{ latest_post.progress }}{% else %}0{% endif %}%</div>
        <div class="stat-label">整体进度</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ open_issues.size }}</div>
        <div class="stat-label">待解决问题</div>
      </div>
    </div>
  </div>
</section>

<!-- 状态总览 -->
<section id="overview" class="container">
  <div class="section">
    <div class="section-header fade-in">
      <h2>项目状态总览</h2>
      <p>关键指标实时监控</p>
    </div>
    <div class="status-cards fade-in">
      {% assign current_phase = site.pages | where: 'status', '进行中' | first %}
      {% assign total_phases = site.pages | where_exp: "p", "p.phase" | size %}
      {% assign latest_post = site.posts | first %}
      <div class="status-card">
        <div class="card-label">当前阶段</div>
        <div class="card-value" style="font-size: 1.4rem;">{{ current_phase.title | default: "未开始" }}</div>
        <div class="card-sub">阶段 {{ current_phase.phase | default: "—" }}/{{ total_phases }}</div>
      </div>
      <div class="status-card">
        <div class="card-label">整体进度</div>
        <div class="card-value">{% if latest_post %}{{ latest_post.progress }}{% else %}0{% endif %}%</div>
        <div class="progress-bar" style="margin-top: 12px;">
          <div class="progress-fill" style="width: {% if latest_post %}{{ latest_post.progress }}{% else %}0{% endif %}%;"></div>
        </div>
      </div>
      <div class="status-card">
        <div class="card-label">待解决问题</div>
        <div class="card-value">{{ open_issues.size }}</div>
        <div class="card-sub">{{ site.issues.size }} 个问题总计</div>
      </div>
      <div class="status-card">
        <div class="card-label">周报数量</div>
        <div class="card-value">{{ site.posts.size }}</div>
        <div class="card-sub">持续更新中</div>
      </div>
    </div>
  </div>
</section>

<!-- 研发流程 -->
<section id="process" class="section-alt">
  <div class="container">
    <div class="section">
      <div class="section-header fade-in">
        <h2>研发流程</h2>
        <p>从需求分析到部署交付的全流程</p>
      </div>
      <div class="timeline fade-in">
        {% assign process_pages = site.pages | where_exp: "p", "p.path contains 'process/'" | sort: "phase" %}
        {% for p in process_pages %}
        <a href="{{ p.url | relative_url }}" class="timeline-step {% if p.status == '已完成' %}completed{% elsif p.status == '进行中' %}active{% endif %}">
          <div class="step-dot">{{ p.icon }}</div>
          <div class="step-label">{{ p.title }}</div>
        </a>
        {% endfor %}
      </div>
      {% if process_pages.size > 0 %}
      <div style="text-align: center; margin-top: 2.5rem;" class="fade-in">
        {% for p in process_pages %}
          {% if p.status == '进行中' %}
          <div style="display: inline-flex; align-items: center; gap: 12px; padding: 12px 28px; background: rgba(0,229,255,0.05); border: 1px solid rgba(0,229,255,0.15); border-radius: 50px;">
            <span style="color: var(--primary); font-weight: 700;">当前阶段：{{ p.title }}</span>
            <span style="color: var(--text-muted);">—</span>
            <span style="color: var(--primary);">进度 {{ p.progress }}%</span>
          </div>
          {% endif %}
        {% endfor %}
      </div>
      {% endif %}
    </div>
  </div>
</section>

<!-- 周报 -->
<section id="weekly">
  <div class="container">
    <div class="section">
      <div class="section-header fade-in">
        <h2>周报</h2>
        <p>每周研发进展记录</p>
      </div>
      {% if site.posts.size > 0 %}
      <ul class="item-list fade-in">
        {% for post in site.posts %}
        <a href="{{ post.url | relative_url }}" class="item-row">
          <span class="item-date">{{ post.date | date: "%m-%d" }}</span>
          <span class="item-title">{{ post.title }}</span>
          {% if post.progress %}<span class="item-meta">{{ post.progress }}%</span>{% endif %}
        </a>
        {% endfor %}
      </ul>
      {% else %}
      <p style="text-align: center; color: var(--text-muted); padding: 2rem;">暂无周报，即将开始更新</p>
      {% endif %}
    </div>
  </div>
</section>

<!-- 问题跟踪 -->
<section id="issues" class="section-alt">
  <div class="container">
    <div class="section">
      <div class="section-header fade-in">
        <h2>问题跟踪</h2>
        <p>研发过程中遇到的问题与解决方案</p>
      </div>
      {% if site.issues.size > 0 %}
      <ul class="item-list fade-in">
        {% for issue in site.issues %}
        <a href="{{ issue.url | relative_url }}" class="item-row">
          <span class="item-date">{{ issue.date | date: "%m-%d" }}</span>
          <span class="item-title">{{ issue.title }}</span>
          <span class="item-meta">{% include status-badge.html status=issue.status %}</span>
        </a>
        {% endfor %}
      </ul>
      {% else %}
      <p style="text-align: center; color: var(--text-muted); padding: 2rem;">暂无问题记录</p>
      {% endif %}
    </div>
  </div>
</section>

<!-- 功能模块 -->
<section id="tech">
  <div class="container">
    <div class="section">
      <div class="section-header fade-in">
        <h2>功能模块</h2>
        <p>九大功能模块技术路线</p>
      </div>
      <div class="features-grid fade-in">
        <div class="feature-card"><span class="card-icon">🪖</span><h3>佩戴合规检测</h3><p class="sub-features">脱帽检测 · 未佩戴报警</p><span class="tech-tag">霍尔传感器 + 磁贴</span></div>
        <div class="feature-card"><span class="card-icon">📐</span><h3>姿态监测</h3><p class="sub-features">跌倒检测 · 撞击检测</p><span class="tech-tag">六轴 IMU</span></div>
        <div class="feature-card"><span class="card-icon">📍</span><h3>实时位置</h3><p class="sub-features">实时定位 · 电子围栏 · 轨迹记录</p><span class="tech-tag">定位模块</span></div>
        <div class="feature-card"><span class="card-icon">🆘</span><h3>应急呼救</h3><p class="sub-features">SOS 按键 · 蜂鸣器报警</p><span class="tech-tag">按键 + 蜂鸣器</span></div>
        <div class="feature-card"><span class="card-icon">🎙️</span><h3>语音交互</h3><p class="sub-features">麦克风阵列 + 扬声器 · 播报 · 对讲</p><span class="tech-tag">音频模块</span></div>
        <div class="feature-card"><span class="card-icon">🔋</span><h3>电源系统</h3><p class="sub-features">可拆卸电池设计</p><span class="tech-tag">2000-3000mAh 锂电池</span></div>
        <div class="feature-card"><span class="card-icon">📷</span><h3>视频采集</h3><p class="sub-features">1080P 摄像头 · TF 卡存储</p><span class="tech-tag">摄像头 + TF 卡</span></div>
        <div class="feature-card"><span class="card-icon">💡</span><h3>照明灯</h3><p class="sub-features">暗光环境下提供照明</p><span class="tech-tag">LED 光源</span></div>
        <div class="feature-card"><span class="card-icon">☁️</span><h3>状态上报</h3><p class="sub-features">异常事件上传云端 · AI 识别</p><span class="tech-tag">4G 模块</span></div>
      </div>
    </div>
  </div>
</section>

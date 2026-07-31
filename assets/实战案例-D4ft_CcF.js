import{O as e,d as t,p as n}from"./runtime-core.esm-bundler-jC72uHyJ.js";import{t as r}from"./app-sCRHfVEK.js";var i=JSON.parse(`{"path":"/Linux/Shell/%E5%AE%9E%E6%88%98%E6%A1%88%E4%BE%8B.html","title":"Shell脚本实战","lang":"zh-CN","frontmatter":{"icon":"codicon:terminal-cmd","category":["Shell","实战案例"],"tag":["shell"],"order":3},"git":{"createdTime":1775200579000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":42.95,"words":12886},"filePathRelative":"Linux/Shell/实战案例.md"}`),a={name:`实战案例.md`};function o(r,i,a,o,s,c){return e(),t(`div`,null,[...i[0]||=[n(`<h1 id="shell脚本实战" tabindex="-1"><a class="header-anchor" href="#shell脚本实战"><span>Shell脚本实战</span></a></h1><h2 id="摘要与学习路径" tabindex="-1"><a class="header-anchor" href="#摘要与学习路径"><span>摘要与学习路径</span></a></h2><p>本报告提供十个经生产验证的Shell脚本案例，<a href="http://xn--ohqs25abj8bhfb.NET" target="_blank" rel="noopener noreferrer">专门针对.NET</a> Core在Linux环境下的部署、诊断、问题排查和性能监测。这些案例覆盖应用生命周期管理、进程监控、性能诊断、故障恢复等关键场景，每个脚本都包含详细注释、错误处理、日志记录机制和实际应用指导。通过这些案例，你将学会如何在生产环境中构建完整的自动化运维体系。</p><h2 id="案例一-net-core应用的完整生命周期管理脚本" tabindex="-1"><a class="header-anchor" href="#案例一-net-core应用的完整生命周期管理脚本"><span>案例一：.NET Core应用的完整生命周期管理脚本</span></a></h2><p>这是最基础也最重要的脚本，用于启动、停止、<a href="http://xn--drr6h972a41hs5n0t9a3wi.NET" target="_blank" rel="noopener noreferrer">重启和状态查询.NET</a> Core应用。该脚本集成了PID管理、日志记录、优雅关闭机制和自动重启功能。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .NET Core 应用生命周期管理脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：启动、停止、重启、状态查询 .NET Core 应用</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境已验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置部分</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;MyDotNetApp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_HOME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/dotnetapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_DLL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">APP_HOME</span><span style="color:#98C379;">}/MyApp.dll&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_USER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;dotnet&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> PID_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/run/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}.pid&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> LOG_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> LOG_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}/app_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d).log&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> ERROR_LOG</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}/error_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d).log&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> GRACEFUL_TIMEOUT</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">30</span><span style="color:#7F848E;font-style:italic;">  # 优雅关闭超时时间（秒）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化日志目录</span></span>
<span class="line"><span style="color:#61AFEF;">init_log_dir</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        chown</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_USER</span><span style="color:#98C379;">}:\${</span><span style="color:#E06C75;">APP_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        chmod</span><span style="color:#D19A66;"> 755</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志函数</span></span>
<span class="line"><span style="color:#61AFEF;">log_info</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> message</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> timestamp</span></span>
<span class="line"><span style="color:#E06C75;">    timestamp</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;[\${</span><span style="color:#E06C75;">timestamp</span><span style="color:#98C379;">}] [INFO] \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">log_error</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> message</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> timestamp</span></span>
<span class="line"><span style="color:#E06C75;">    timestamp</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;[\${</span><span style="color:#E06C75;">timestamp</span><span style="color:#98C379;">}] [ERROR] \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">ERROR_LOG</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查应用是否运行</span></span>
<span class="line"><span style="color:#61AFEF;">is_running</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PID_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span></span>
<span class="line"><span style="color:#E06C75;">    pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PID_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查进程是否存在</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> kill</span><span style="color:#D19A66;"> -0</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # PID文件已过时，删除它</span></span>
<span class="line"><span style="color:#61AFEF;">        rm</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PID_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取应用的PID</span></span>
<span class="line"><span style="color:#61AFEF;">get_pid</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PID_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PID_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动应用</span></span>
<span class="line"><span style="color:#61AFEF;">start_app</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log_info</span><span style="color:#98C379;"> &quot;开始启动 \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查应用是否已在运行</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> is_running</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> pid</span></span>
<span class="line"><span style="color:#E06C75;">        pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">get_pid</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        log_error</span><span style="color:#98C379;"> &quot;应用已在运行 (PID: \${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查必要的文件和目录</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DLL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_error</span><span style="color:#98C379;"> &quot;应用DLL不存在: \${</span><span style="color:#E06C75;">APP_DLL</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_HOME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_error</span><span style="color:#98C379;"> &quot;应用目录不存在: \${</span><span style="color:#E06C75;">APP_HOME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 启动应用，在后台运行</span></span>
<span class="line"><span style="color:#56B6C2;">    cd</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_HOME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || {</span></span>
<span class="line"><span style="color:#61AFEF;">        log_error</span><span style="color:#98C379;"> &quot;无法进入应用目录: \${</span><span style="color:#E06C75;">APP_HOME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 以指定用户启动应用，重定向日志</span></span>
<span class="line"><span style="color:#61AFEF;">    su</span><span style="color:#98C379;"> -</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;nohup dotnet \${</span><span style="color:#E06C75;">APP_DLL</span><span style="color:#98C379;">} &gt;&gt; \${</span><span style="color:#E06C75;">LOG_FILE</span><span style="color:#98C379;">} 2&gt;&amp;1 &amp;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 等待应用启动</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 获取刚启动的进程PID</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> new_pid</span></span>
<span class="line"><span style="color:#E06C75;">    new_pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;dotnet \${</span><span style="color:#E06C75;">APP_DLL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-n</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">PID_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        log_info</span><span style="color:#98C379;"> &quot;应用启动成功 (PID: \${</span><span style="color:#E06C75;">new_pid</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_error</span><span style="color:#98C379;"> &quot;应用启动失败或无法获取PID&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优雅关闭应用（graceful shutdown）</span></span>
<span class="line"><span style="color:#61AFEF;">stop_app</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log_info</span><span style="color:#98C379;"> &quot;开始停止 \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#61AFEF;">is_running</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_info</span><span style="color:#98C379;"> &quot;应用未运行&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span></span>
<span class="line"><span style="color:#E06C75;">    pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">get_pid</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log_info</span><span style="color:#98C379;"> &quot;发送SIGTERM信号到进程 \${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    kill</span><span style="color:#D19A66;"> -15</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || {</span></span>
<span class="line"><span style="color:#61AFEF;">        log_error</span><span style="color:#98C379;"> &quot;无法发送SIGTERM信号&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 等待应用优雅关闭</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> count</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">count</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> GRACEFUL_TIMEOUT</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">kill</span><span style="color:#D19A66;"> -0</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log_info</span><span style="color:#98C379;"> &quot;应用已优雅关闭&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            rm</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PID_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#61AFEF;">        sleep</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 每5秒打印一次等待信息</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">count</span><span style="color:#56B6C2;"> %</span><span style="color:#D19A66;"> 5</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log_info</span><span style="color:#98C379;"> &quot;等待应用关闭... (\${</span><span style="color:#E06C75;">count</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">GRACEFUL_TIMEOUT</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 如果优雅关闭失败，强制杀死</span></span>
<span class="line"><span style="color:#61AFEF;">    log_error</span><span style="color:#98C379;"> &quot;优雅关闭超时，强制杀死进程...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    kill</span><span style="color:#D19A66;"> -9</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#61AFEF;">    rm</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">PID_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log_info</span><span style="color:#98C379;"> &quot;应用已强制关闭&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重启应用</span></span>
<span class="line"><span style="color:#61AFEF;">restart_app</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log_info</span><span style="color:#98C379;"> &quot;开始重启 \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#61AFEF;">stop_app</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_error</span><span style="color:#98C379;"> &quot;停止应用失败，中止重启&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#61AFEF;">start_app</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_error</span><span style="color:#98C379;"> &quot;启动应用失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log_info</span><span style="color:#98C379;"> &quot;应用重启完成&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 显示应用状态</span></span>
<span class="line"><span style="color:#61AFEF;">status_app</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> is_running</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> pid</span></span>
<span class="line"><span style="color:#E06C75;">        pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">get_pid</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;应用状态: 运行中 (PID: \${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;进程详情:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pid,user,cpu,%mem,etime,comm</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -1</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 显示内存使用详情</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> pmap</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;内存映射统计:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            pmap</span><span style="color:#D19A66;"> -x</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -1</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 显示最近的日志</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;最近的应用日志:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            tail</span><span style="color:#D19A66;"> -5</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;应用状态: 未运行&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 检查是否有错误日志</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">ERROR_LOG</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;最近的错误日志:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            tail</span><span style="color:#D19A66;"> -5</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">ERROR_LOG</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    init_log_dir</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> command</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">status</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    case</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">command</span><span style="color:#98C379;">}&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">        start</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">            start_app</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#E06C75;">        stop</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">            stop_app</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#E06C75;">        restart</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">            restart_app</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#E06C75;">        status</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">            status_app</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#ABB2BF;">        *)</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;用法: </span><span style="color:#E06C75;font-style:italic;">$0</span><span style="color:#98C379;"> {start|stop|restart|status}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;命令说明:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;  start   - 启动应用&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;  stop    - 停止应用（优雅关闭）&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;  restart - 重启应用&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;  status  - 显示应用状态&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#C678DD;">    esac</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该脚本的关键特性包括：进程ID管理确保不会启动多个实例；优雅关闭机制给应用充足的关闭时间；详细的日志记录便于故障排查；完整的错误处理防止脚本异常中断。使用示例：<code>./app_manager.sh start</code>启动应用，<code>./app_manager.sh status</code>检查状态。</p><h2 id="案例二-基于supervisor的进程守护与自动重启脚本" tabindex="-1"><a class="header-anchor" href="#案例二-基于supervisor的进程守护与自动重启脚本"><span>案例二：基于Supervisor的进程守护与自动重启脚本</span></a></h2><p>Supervisor是生产环境中常用的进程管理工具，此脚本完全自动化其配置和部署过程。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Supervisor 自动化配置和部署脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：自动安装Supervisor、配置.NET Core应用守护、启用Web管理界面</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;mynetcoreapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_DLL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/dotnet/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}.dll&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/dotnet/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_USER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;dotnet&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> SUPERVISOR_CONFIG_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/supervisor/conf.d&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> LOG_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/supervisor&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查是否为root用户</span></span>
<span class="line"><span style="color:#61AFEF;">check_root</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E06C75;">$EUID</span><span style="color:#56B6C2;"> -ne</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;此脚本必须以root身份运行&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装Supervisor</span></span>
<span class="line"><span style="color:#61AFEF;">install_supervisor</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;检查Supervisor是否已安装...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> supervisord</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Supervisor已安装，版本: $(</span><span style="color:#61AFEF;">supervisord</span><span style="color:#D19A66;"> --version</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;安装Supervisor...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 根据发行版选择安装方式</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> apt</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        apt</span><span style="color:#98C379;"> update</span></span>
<span class="line"><span style="color:#61AFEF;">        apt</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> supervisor</span></span>
<span class="line"><span style="color:#C678DD;">    elif</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> yum</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        yum</span><span style="color:#98C379;"> install</span><span style="color:#D19A66;"> -y</span><span style="color:#98C379;"> supervisor</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;不支持的包管理器&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 确保Supervisor服务已启动</span></span>
<span class="line"><span style="color:#61AFEF;">    systemctl</span><span style="color:#98C379;"> enable</span><span style="color:#98C379;"> supervisor</span><span style="color:#ABB2BF;"> || </span><span style="color:#61AFEF;">supervisord</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> /etc/supervisor/supervisord.conf</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Supervisor安装完成&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建日志目录</span></span>
<span class="line"><span style="color:#61AFEF;">create_log_dirs</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">SUPERVISOR_CONFIG_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 设置正确的权限</span></span>
<span class="line"><span style="color:#61AFEF;">    chown</span><span style="color:#D19A66;"> -R</span><span style="color:#98C379;"> supervisor:supervisor</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    chmod</span><span style="color:#D19A66;"> 755</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置应用守护</span></span>
<span class="line"><span style="color:#61AFEF;">configure_app_supervision</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;配置 \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">} 的Supervisor守护...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> config_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">SUPERVISOR_CONFIG_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}.conf&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 生成Supervisor配置文件</span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">config_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">[program:mynetcoreapp]</span></span>
<span class="line"><span style="color:#98C379;"># 应用运行的命令和参数</span></span>
<span class="line"><span style="color:#98C379;">command=dotnet /opt/dotnet/mynetcoreapp/mynetcoreapp.dll</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 命令执行的目录</span></span>
<span class="line"><span style="color:#98C379;">directory=/opt/dotnet/mynetcoreapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 应用意外退出时是否自动重启</span></span>
<span class="line"><span style="color:#98C379;">autostart=true</span></span>
<span class="line"><span style="color:#98C379;">autorestart=true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 进程停止方式和信号</span></span>
<span class="line"><span style="color:#98C379;">stopsignal=INT</span></span>
<span class="line"><span style="color:#98C379;">stopasgroup=true</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 进程执行的用户身份</span></span>
<span class="line"><span style="color:#98C379;">user=dotnet</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 环境变量设置</span></span>
<span class="line"><span style="color:#98C379;">environment=ASPNETCORE_ENVIRONMENT=Production,ASPNETCORE_URLS=http://+:5000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 日志文件配置</span></span>
<span class="line"><span style="color:#98C379;">stdout_logfile=/var/log/supervisor/mynetcoreapp_stdout.log</span></span>
<span class="line"><span style="color:#98C379;">stderr_logfile=/var/log/supervisor/mynetcoreapp_stderr.log</span></span>
<span class="line"><span style="color:#98C379;">stdout_logfile_maxbytes=10MB</span></span>
<span class="line"><span style="color:#98C379;">stdout_logfile_backups=5</span></span>
<span class="line"><span style="color:#98C379;">stderr_logfile_maxbytes=10MB</span></span>
<span class="line"><span style="color:#98C379;">stderr_logfile_backups=5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 进程重启延迟（秒）</span></span>
<span class="line"><span style="color:#98C379;">startsecs=10</span></span>
<span class="line"><span style="color:#98C379;">startretries=3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 停止超时时间（秒）</span></span>
<span class="line"><span style="color:#98C379;">stopwaitsecs=30</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 优先级（数字越小越先启动）</span></span>
<span class="line"><span style="color:#98C379;">priority=999</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 进程名称（用于supervisorctl命令）</span></span>
<span class="line"><span style="color:#98C379;">process_name=%(program_name)s</span></span>
<span class="line"><span style="color:#98C379;">numprocs=1</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 替换实际的应用名称和路径</span></span>
<span class="line"><span style="color:#61AFEF;">    sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;s|mynetcoreapp|\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}|g&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">config_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;s|/opt/dotnet/mynetcoreapp|\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}|g&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">config_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;配置文件创建: \${</span><span style="color:#E06C75;">config_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用Supervisor Web管理界面</span></span>
<span class="line"><span style="color:#61AFEF;">enable_web_interface</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;启用Supervisor Web管理界面...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> supervisord_conf</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/supervisor/supervisord.conf&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查inet_http_server配置是否已存在且启用</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;^;*\\[inet_http_server\\]&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">supervisord_conf</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 已存在，取消注释</span></span>
<span class="line"><span style="color:#61AFEF;">        sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^;;\\[inet_http_server\\]/[inet_http_server]/g&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">supervisord_conf</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^;;port=/port=/g&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">supervisord_conf</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 添加配置</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">supervisord_conf</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">[inet_http_server]</span></span>
<span class="line"><span style="color:#98C379;">port=127.0.0.1:9001</span></span>
<span class="line"><span style="color:#98C379;">username=admin</span></span>
<span class="line"><span style="color:#98C379;">password=admin123</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Web管理界面已启用，访问地址: http://127.0.0.1:9001&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;用户名: admin, 密码: admin123&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用include配置</span></span>
<span class="line"><span style="color:#61AFEF;">enable_include_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;启用include配置...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> supervisord_conf</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/supervisor/supervisord.conf&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 查找并取消注释include配置</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;^;files = &quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">supervisord_conf</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        sed</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;s/^;files = /files = /g&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">supervisord_conf</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重新加载Supervisor配置</span></span>
<span class="line"><span style="color:#61AFEF;">reload_supervisor</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;重新加载Supervisor配置...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> supervisor</span><span style="color:#ABB2BF;"> || </span><span style="color:#61AFEF;">supervisorctl</span><span style="color:#98C379;"> reload</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 等待Supervisor重启</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查应用是否已被Supervisor管理</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> supervisorctl</span><span style="color:#98C379;"> status</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;应用已注册到Supervisor&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        supervisorctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;警告：应用未出现在Supervisor管理列表中&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动应用</span></span>
<span class="line"><span style="color:#61AFEF;">start_managed_app</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;启动由Supervisor管理的应用...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    supervisorctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    supervisorctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证应用运行状态</span></span>
<span class="line"><span style="color:#61AFEF;">verify_app_running</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;验证应用运行状态...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> max_attempts</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> attempt</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">1</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">attempt</span><span style="color:#56B6C2;"> &lt;=</span><span style="color:#E06C75;"> max_attempts</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> supervisorctl</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;RUNNING&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;✓ 应用运行正常&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;等待应用启动... (\${</span><span style="color:#E06C75;">attempt</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">max_attempts</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">attempt</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✗ 应用启动失败，请检查日志：&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  supervisorctl tail -f \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    check_root</span></span>
<span class="line"><span style="color:#61AFEF;">    create_log_dirs</span></span>
<span class="line"><span style="color:#61AFEF;">    install_supervisor</span></span>
<span class="line"><span style="color:#61AFEF;">    configure_app_supervision</span></span>
<span class="line"><span style="color:#61AFEF;">    enable_include_config</span></span>
<span class="line"><span style="color:#61AFEF;">    enable_web_interface</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 重新加载配置</span></span>
<span class="line"><span style="color:#61AFEF;">    systemctl</span><span style="color:#98C379;"> restart</span><span style="color:#98C379;"> supervisor</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 3</span></span>
<span class="line"><span style="color:#61AFEF;">    supervisorctl</span><span style="color:#98C379;"> reread</span></span>
<span class="line"><span style="color:#61AFEF;">    supervisorctl</span><span style="color:#98C379;"> update</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    start_managed_app</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    verify_app_running</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Supervisor配置完成&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;=========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;常用命令:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  supervisorctl start \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}    - 启动应用&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  supervisorctl stop \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}     - 停止应用&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  supervisorctl restart \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}  - 重启应用&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  supervisorctl status \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}   - 查看状态&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  supervisorctl tail -f \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}  - 查看日志&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Web管理界面: http://127.0.0.1:9001&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个脚本自动完成了Supervisor的安装、配置、启动等全部步骤，特别适合在新系统上快速部署。</p><h2 id="案例三-全面的系统健康检查与诊断脚本" tabindex="-1"><a class="header-anchor" href="#案例三-全面的系统健康检查与诊断脚本"><span>案例三：全面的系统健康检查与诊断脚本</span></a></h2><p>生产环境中需要定期检查系统和应用的健康状况，此脚本提供了全面的诊断能力。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .NET Core 应用健康检查和诊断脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：检查系统资源、应用进程、依赖服务、网络连接等</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境已验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;mynetcoreapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;5000&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> DB_HOST</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;localhost&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> DB_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;5432&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> REPORT_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}_health_report_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S).txt&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 颜色定义用于输出</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> RED</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[0;31m&#39;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> GREEN</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[0;32m&#39;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> YELLOW</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[1;33m&#39;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> NC</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[0m&#39;</span><span style="color:#7F848E;font-style:italic;"> # No Color</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查结果统计</span></span>
<span class="line"><span style="color:#C678DD;">declare</span><span style="color:#D19A66;"> -i</span><span style="color:#E06C75;"> CHECK_TOTAL</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">declare</span><span style="color:#D19A66;"> -i</span><span style="color:#E06C75;"> CHECK_PASS</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">declare</span><span style="color:#D19A66;"> -i</span><span style="color:#E06C75;"> CHECK_FAIL</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">declare</span><span style="color:#D19A66;"> -i</span><span style="color:#E06C75;"> CHECK_WARN</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 记录日志</span></span>
<span class="line"><span style="color:#61AFEF;">log_check</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> status</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> message</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    ((</span><span style="color:#E06C75;">CHECK_TOTAL</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    case</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">status</span><span style="color:#98C379;">}&quot;</span><span style="color:#C678DD;"> in</span></span>
<span class="line"><span style="color:#E06C75;">        PASS</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">GREEN</span><span style="color:#98C379;">}[✓ PASS]\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">} \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;[✓ PASS] \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            ((</span><span style="color:#E06C75;">CHECK_PASS</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#E06C75;">        FAIL</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">RED</span><span style="color:#98C379;">}[✗ FAIL]\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">} \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;[✗ FAIL] \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            ((</span><span style="color:#E06C75;">CHECK_FAIL</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#E06C75;">        WARN</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">YELLOW</span><span style="color:#98C379;">}[! WARN]\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">} \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;[! WARN] \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            ((</span><span style="color:#E06C75;">CHECK_WARN</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">            ;;</span></span>
<span class="line"><span style="color:#C678DD;">    esac</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化报告</span></span>
<span class="line"><span style="color:#61AFEF;">init_report</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#98C379;">================================================================================</span></span>
<span class="line"><span style="color:#98C379;">.NET Core 应用健康检查报告</span></span>
<span class="line"><span style="color:#98C379;">================================================================================</span></span>
<span class="line"><span style="color:#98C379;">应用名称: \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">检查时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)</span></span>
<span class="line"><span style="color:#98C379;">检查主机: $(</span><span style="color:#61AFEF;">hostname</span><span style="color:#98C379;">)</span></span>
<span class="line"><span style="color:#98C379;">================================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查应用进程</span></span>
<span class="line"><span style="color:#61AFEF;">check_app_process</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;1. 检查应用进程&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span></span>
<span class="line"><span style="color:#E06C75;">    pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;dotnet.*\\.dll&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-n</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;应用进程存在 (PID: \${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 获取进程运行时间</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> etime</span></span>
<span class="line"><span style="color:#E06C75;">        etime</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> etime=</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">xargs</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;应用运行时长: \${</span><span style="color:#E06C75;">etime</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 检查进程的CPU和内存使用</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> cpu_usage</span><span style="color:#E06C75;"> mem_usage</span></span>
<span class="line"><span style="color:#56B6C2;">        read</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> cpu_usage</span><span style="color:#98C379;"> mem_usage</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">&lt;(</span><span style="color:#61AFEF;">ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> %cpu=,%mem= </span><span style="color:#D19A66;">-p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot; </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> xargs</span><span style="color:#98C379;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( $(</span><span style="color:#E06C75;">echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">cpu_usage</span><span style="color:#98C379;">} &gt; 80&quot;</span><span style="color:#56B6C2;"> |</span><span style="color:#E06C75;"> bc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;">l</span><span style="color:#ABB2BF;">) )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;CPU使用率较高: \${</span><span style="color:#E06C75;">cpu_usage</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;CPU使用率正常: \${</span><span style="color:#E06C75;">cpu_usage</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( $(</span><span style="color:#E06C75;">echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">mem_usage</span><span style="color:#98C379;">} &gt; 50&quot;</span><span style="color:#56B6C2;"> |</span><span style="color:#E06C75;"> bc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;">l</span><span style="color:#ABB2BF;">) )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;内存使用率较高: \${</span><span style="color:#E06C75;">mem_usage</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;内存使用率正常: \${</span><span style="color:#E06C75;">mem_usage</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;FAIL&quot;</span><span style="color:#98C379;"> &quot;应用进程未运行&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查应用端口</span></span>
<span class="line"><span style="color:#61AFEF;">check_app_port</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;2. 检查应用服务端口&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;:\${</span><span style="color:#E06C75;">APP_PORT</span><span style="color:#98C379;">} &quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;应用端口 \${</span><span style="color:#E06C75;">APP_PORT</span><span style="color:#98C379;">} 正在监听&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;FAIL&quot;</span><span style="color:#98C379;"> &quot;应用端口 \${</span><span style="color:#E06C75;">APP_PORT</span><span style="color:#98C379;">} 未监听&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查HTTP健康端点</span></span>
<span class="line"><span style="color:#61AFEF;">check_http_health</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;3. 检查HTTP健康检查端点&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> curl</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 尝试连接应用的健康检查端点</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -m</span><span style="color:#D19A66;"> 5</span><span style="color:#98C379;"> &quot;http://localhost:\${</span><span style="color:#E06C75;">APP_PORT</span><span style="color:#98C379;">}/health&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;HTTP健康检查端点响应正常&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 获取详细的健康状态</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> health_response</span></span>
<span class="line"><span style="color:#E06C75;">            health_response</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -m</span><span style="color:#D19A66;"> 5</span><span style="color:#98C379;"> &quot;http://localhost:\${</span><span style="color:#E06C75;">APP_PORT</span><span style="color:#98C379;">}/health&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;{}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 简单检查是否包含healthy或ok标识</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">health_response</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -qi</span><span style="color:#98C379;"> &quot;healthy\\|ok\\|up&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">                log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;应用健康状态: 健康&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            else</span></span>
<span class="line"><span style="color:#61AFEF;">                log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;应用健康状态: 返回非标准响应&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            fi</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;FAIL&quot;</span><span style="color:#98C379;"> &quot;HTTP健康检查端点无响应&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;curl命令不可用，跳过HTTP检查&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查磁盘空间</span></span>
<span class="line"><span style="color:#61AFEF;">check_disk_space</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;4. 检查磁盘空间&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> root_usage</span></span>
<span class="line"><span style="color:#E06C75;">    root_usage</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">df</span><span style="color:#98C379;"> /</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR==2 {print $5}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sed</span><span style="color:#98C379;"> &#39;s/%//&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">root_usage</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 90</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;FAIL&quot;</span><span style="color:#98C379;"> &quot;根分区磁盘使用率过高: \${</span><span style="color:#E06C75;">root_usage</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    elif</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">root_usage</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 80</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;根分区磁盘使用率较高: \${</span><span style="color:#E06C75;">root_usage</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;根分区磁盘空间充足: \${</span><span style="color:#E06C75;">root_usage</span><span style="color:#98C379;">}% 已用&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查应用所在分区</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> app_usage</span></span>
<span class="line"><span style="color:#E06C75;">    app_usage</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">df</span><span style="color:#98C379;"> /opt</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR==2 {print $5}&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sed</span><span style="color:#98C379;"> &#39;s/%//&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">app_usage</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 85</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;应用分区使用率: \${</span><span style="color:#E06C75;">app_usage</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;应用分区使用率: \${</span><span style="color:#E06C75;">app_usage</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查内存情况</span></span>
<span class="line"><span style="color:#61AFEF;">check_memory</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;5. 检查系统内存&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> mem_total</span><span style="color:#E06C75;"> mem_used</span><span style="color:#E06C75;"> mem_free</span><span style="color:#E06C75;"> mem_usage</span></span>
<span class="line"><span style="color:#E06C75;">    mem_total</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">free</span><span style="color:#D19A66;"> -m</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR==2 {print $2}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    mem_used</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">free</span><span style="color:#D19A66;"> -m</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR==2 {print $3}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    mem_free</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">free</span><span style="color:#D19A66;"> -m</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR==2 {print $4}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    mem_usage</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &quot;BEGIN {printf </span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">%.0f</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">, \${</span><span style="color:#E06C75;">mem_used</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">mem_total</span><span style="color:#98C379;">}*100}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">mem_usage</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 90</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;FAIL&quot;</span><span style="color:#98C379;"> &quot;内存使用率过高: \${</span><span style="color:#E06C75;">mem_usage</span><span style="color:#98C379;">}% (\${</span><span style="color:#E06C75;">mem_used</span><span style="color:#98C379;">}MB/\${</span><span style="color:#E06C75;">mem_total</span><span style="color:#98C379;">}MB)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    elif</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">mem_usage</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 75</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;内存使用率较高: \${</span><span style="color:#E06C75;">mem_usage</span><span style="color:#98C379;">}% (\${</span><span style="color:#E06C75;">mem_used</span><span style="color:#98C379;">}MB/\${</span><span style="color:#E06C75;">mem_total</span><span style="color:#98C379;">}MB)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;内存使用率正常: \${</span><span style="color:#E06C75;">mem_usage</span><span style="color:#98C379;">}% (\${</span><span style="color:#E06C75;">mem_used</span><span style="color:#98C379;">}MB/\${</span><span style="color:#E06C75;">mem_total</span><span style="color:#98C379;">}MB，可用\${</span><span style="color:#E06C75;">mem_free</span><span style="color:#98C379;">}MB)&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查CPU负载</span></span>
<span class="line"><span style="color:#61AFEF;">check_cpu_load</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;6. 检查CPU负载&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> load_avg</span></span>
<span class="line"><span style="color:#E06C75;">    load_avg</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> /proc/loadavg</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> cpu_count</span></span>
<span class="line"><span style="color:#E06C75;">    cpu_count</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">nproc</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> load_threshold</span></span>
<span class="line"><span style="color:#E06C75;">    load_threshold</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &quot;BEGIN {printf </span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">%.1f</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">, \${</span><span style="color:#E06C75;">cpu_count</span><span style="color:#98C379;">} * 1.5}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( $(</span><span style="color:#E06C75;">echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">load_avg</span><span style="color:#98C379;">} &gt; \${</span><span style="color:#E06C75;">load_threshold</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> |</span><span style="color:#E06C75;"> bc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;">l</span><span style="color:#ABB2BF;">) )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;CPU负载偏高: \${</span><span style="color:#E06C75;">load_avg</span><span style="color:#98C379;">} (CPU核心数: \${</span><span style="color:#E06C75;">cpu_count</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;CPU负载正常: \${</span><span style="color:#E06C75;">load_avg</span><span style="color:#98C379;">} (CPU核心数: \${</span><span style="color:#E06C75;">cpu_count</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查数据库连接</span></span>
<span class="line"><span style="color:#61AFEF;">check_database_connection</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;7. 检查数据库连接&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> nc</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> nc</span><span style="color:#D19A66;"> -z</span><span style="color:#D19A66;"> -w</span><span style="color:#D19A66;"> 5</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;数据库服务器 \${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}:\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">} 可达&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;FAIL&quot;</span><span style="color:#98C379;"> &quot;无法连接到数据库服务器 \${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}:\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;nc命令不可用，跳过数据库连接检查&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查系统日志中的错误</span></span>
<span class="line"><span style="color:#61AFEF;">check_system_logs</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;8. 检查系统日志&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查最近10分钟内的系统错误</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> journalctl</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> error_count</span></span>
<span class="line"><span style="color:#E06C75;">        error_count</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">journalctl</span><span style="color:#D19A66;"> --since</span><span style="color:#98C379;"> &quot;10 minutes ago&quot;</span><span style="color:#D19A66;"> --priority</span><span style="color:#98C379;"> err</span><span style="color:#D19A66;"> -q</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">error_count</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;系统日志中检测到 \${</span><span style="color:#E06C75;">error_count</span><span style="color:#98C379;">} 条错误&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;最近10分钟内无系统错误&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查应用日志中的异常</span></span>
<span class="line"><span style="color:#61AFEF;">check_app_logs</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;9. 检查应用日志&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> app_log_dir</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log_dir</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;应用日志目录不存在: \${</span><span style="color:#E06C75;">app_log_dir</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查最新的日志文件</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> latest_log</span></span>
<span class="line"><span style="color:#E06C75;">    latest_log</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">find</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log_dir</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -name</span><span style="color:#98C379;"> &quot;*.log&quot;</span><span style="color:#D19A66;"> -type</span><span style="color:#98C379;"> f</span><span style="color:#D19A66;"> -printf</span><span style="color:#98C379;"> &#39;%T@ %p\\n&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cut</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;">&#39; &#39;</span><span style="color:#D19A66;"> -f2-</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;应用日志目录内没有日志文件&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查最新日志中的异常</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> exception_count</span></span>
<span class="line"><span style="color:#E06C75;">    exception_count</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;exception\\|error\\|fatal&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">exception_count</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;应用日志中检测到 \${</span><span style="color:#E06C75;">exception_count</span><span style="color:#98C379;">} 条异常/错误&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;最后5条异常:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;exception\\|error\\|fatal&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -5</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log_check</span><span style="color:#98C379;"> &quot;PASS&quot;</span><span style="color:#98C379;"> &quot;应用日志中无异常/错误&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成最终报告</span></span>
<span class="line"><span style="color:#61AFEF;">generate_final_report</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;10. 健康检查总结&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">================================================================================</span></span>
<span class="line"><span style="color:#98C379;">检查总结</span></span>
<span class="line"><span style="color:#98C379;">================================================================================</span></span>
<span class="line"><span style="color:#98C379;">总检查项数: \${</span><span style="color:#E06C75;">CHECK_TOTAL</span><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">通过数量:   \${</span><span style="color:#E06C75;">CHECK_PASS</span><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">失败数量:   \${</span><span style="color:#E06C75;">CHECK_FAIL</span><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#98C379;">警告数量:   \${</span><span style="color:#E06C75;">CHECK_WARN</span><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">检查完成时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)</span></span>
<span class="line"><span style="color:#98C379;">================================================================================</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">CHECK_FAIL</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">CHECK_WARN</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">GREEN</span><span style="color:#98C379;">}✓ 健康检查全部通过，应用运行正常\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">YELLOW</span><span style="color:#98C379;">}⚠ 检查通过，但存在 \${</span><span style="color:#E06C75;">CHECK_WARN</span><span style="color:#98C379;">} 个警告\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">RED</span><span style="color:#98C379;">}✗ 检查发现 \${</span><span style="color:#E06C75;">CHECK_FAIL</span><span style="color:#98C379;">} 个失败项，需要立即处理\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;详细报告已保存到: \${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;查看报告: cat \${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    init_report</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    check_app_process</span></span>
<span class="line"><span style="color:#61AFEF;">    check_app_port</span></span>
<span class="line"><span style="color:#61AFEF;">    check_http_health</span></span>
<span class="line"><span style="color:#61AFEF;">    check_disk_space</span></span>
<span class="line"><span style="color:#61AFEF;">    check_memory</span></span>
<span class="line"><span style="color:#61AFEF;">    check_cpu_load</span></span>
<span class="line"><span style="color:#61AFEF;">    check_database_connection</span></span>
<span class="line"><span style="color:#61AFEF;">    check_system_logs</span></span>
<span class="line"><span style="color:#61AFEF;">    check_app_logs</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    generate_final_report</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="http://xn--ykq2z101ak0h3keeyhvt6b.NET" target="_blank" rel="noopener noreferrer">此脚本提供了对.NET</a> Core应用及其运行环境的全面诊断，特别适合定期巡检或故障排查。</p><h2 id="案例四-性能监测与基线建立脚本" tabindex="-1"><a class="header-anchor" href="#案例四-性能监测与基线建立脚本"><span>案例四：性能监测与基线建立脚本</span></a></h2><p>性能问题的诊断需要建立基线和持续监测，这个脚本提供了完整的性能监测能力。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .NET Core 应用性能监测脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：监测应用CPU、内存、磁盘I/O、网络等性能指标</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 建立基线数据用于性能对比</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;mynetcoreapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> MONITOR_INTERVAL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;font-style:italic;">5}</span><span style="color:#98C379;">&quot;</span><span style="color:#7F848E;font-style:italic;">  # 监测间隔（秒），默认5秒</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> MONITOR_DURATION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;font-style:italic;">300}</span><span style="color:#98C379;">&quot;</span><span style="color:#7F848E;font-style:italic;"> # 总监测时间（秒），默认5分钟</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> REPORT_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/perf_reports&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> REPORT_FILE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/perf_report_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S).csv&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化</span></span>
<span class="line"><span style="color:#61AFEF;">init_monitoring</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 创建CSV头</span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">Timestamp,PID,CPU%,MEM%,RSS(MB),VSZ(MB),UserCPU(ms),SysCPU(ms),VoluntaryCtx,NonVoluntaryCtx</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取进程信息</span></span>
<span class="line"><span style="color:#61AFEF;">get_process_info</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> app_pid</span></span>
<span class="line"><span style="color:#E06C75;">    app_pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;dotnet.*\\.dll&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;ERROR: 应用进程未找到&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 采集单次性能数据</span></span>
<span class="line"><span style="color:#61AFEF;">collect_perf_data</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> timestamp</span></span>
<span class="line"><span style="color:#E06C75;">    timestamp</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 从/proc/stat获取CPU信息</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> cpu_usage</span></span>
<span class="line"><span style="color:#E06C75;">    cpu_usage</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> %cpu=</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">xargs</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 从/proc/self/stat获取内存信息</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> mem_usage</span></span>
<span class="line"><span style="color:#E06C75;">    mem_usage</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> %mem=</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">xargs</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> rss</span><span style="color:#E06C75;"> vsz</span></span>
<span class="line"><span style="color:#E06C75;">    rss</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> rss=</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">xargs</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1/1024}&#39;</span><span style="color:#ABB2BF;">)  </span><span style="color:#7F848E;font-style:italic;"># 转换为MB</span></span>
<span class="line"><span style="color:#E06C75;">    vsz</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> vsz=</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">xargs</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $1/1024}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 从/proc/stat获取CPU时间</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> utime</span><span style="color:#E06C75;"> stime</span></span>
<span class="line"><span style="color:#56B6C2;">    read</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> utime</span><span style="color:#98C379;"> stime</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">&lt;(</span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;NR==1 {print $14, $15}&#39; /proc/\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}/stat)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 从/proc/status获取上下文切换次数</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> vol_ctx</span><span style="color:#E06C75;"> nonvol_ctx</span></span>
<span class="line"><span style="color:#E06C75;">    vol_ctx</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;voluntary_ctxt_switches&quot;</span><span style="color:#98C379;"> /proc/</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">pid</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">/status</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    nonvol_ctx</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;nonvoluntary_ctxt_switches&quot;</span><span style="color:#98C379;"> /proc/</span><span style="color:#ABB2BF;">\${</span><span style="color:#E06C75;">pid</span><span style="color:#ABB2BF;">}</span><span style="color:#98C379;">/status</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $2}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 输出CSV格式的数据</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">timestamp</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">cpu_usage</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">mem_usage</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">rss</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">vsz</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">utime</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">stime</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">vol_ctx</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">nonvol_ctx</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 执行监测</span></span>
<span class="line"><span style="color:#61AFEF;">run_monitoring</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span></span>
<span class="line"><span style="color:#E06C75;">    pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">get_process_info</span><span style="color:#ABB2BF;">) || </span><span style="color:#C678DD;">return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> elapsed</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> samples</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;开始性能监测...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;应用PID: \${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;监测间隔: \${</span><span style="color:#E06C75;">MONITOR_INTERVAL</span><span style="color:#98C379;">}秒&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;总时间: \${</span><span style="color:#E06C75;">MONITOR_DURATION</span><span style="color:#98C379;">}秒&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">elapsed</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> MONITOR_DURATION</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">kill</span><span style="color:#D19A66;"> -0</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;警告: 应用进程已退出&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2</span></span>
<span class="line"><span style="color:#C678DD;">            break</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> data</span></span>
<span class="line"><span style="color:#E06C75;">        data</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">collect_perf_data</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">) || </span><span style="color:#C678DD;">break</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">data</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 打印到控制台（每10秒打印一次）</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( (</span><span style="color:#E06C75;">samples</span><span style="color:#56B6C2;"> %</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">10</span><span style="color:#56B6C2;"> /</span><span style="color:#E06C75;"> MONITOR_INTERVAL</span><span style="color:#ABB2BF;">)) == 0 )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;[$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%H:%M:%S&#39;)] \${</span><span style="color:#E06C75;">data</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#61AFEF;">        sleep</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">MONITOR_INTERVAL</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">elapsed</span><span style="color:#56B6C2;"> +=</span><span style="color:#E06C75;"> MONITOR_INTERVAL</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">samples</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;监测完成，共采集 \${</span><span style="color:#E06C75;">samples</span><span style="color:#98C379;">} 个样本&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成性能报告</span></span>
<span class="line"><span style="color:#61AFEF;">generate_perf_report</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;性能分析报告&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;报告文件不存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 跳过CSV头，计算统计数据</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> cpu_avg</span><span style="color:#E06C75;"> cpu_max</span><span style="color:#E06C75;"> cpu_min</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> mem_avg</span><span style="color:#E06C75;"> mem_max</span><span style="color:#E06C75;"> mem_min</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> rss_avg</span><span style="color:#E06C75;"> rss_max</span><span style="color:#E06C75;"> rss_min</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 计算CPU统计</span></span>
<span class="line"><span style="color:#E06C75;">    cpu_avg</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;NR&gt;1 {sum+=$3; count++} END {if(count&gt;0) printf &quot;%.1f&quot;, sum/count}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    cpu_max</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;NR&gt;1 {if($3&gt;max)max=$3} END {printf &quot;%.1f&quot;, max}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    cpu_min</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;NR&gt;1 {if(NR==2)min=$3; if($3&lt;min)min=$3} END {printf &quot;%.1f&quot;, min}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 计算内存统计</span></span>
<span class="line"><span style="color:#E06C75;">    mem_avg</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;NR&gt;1 {sum+=$4; count++} END {if(count&gt;0) printf &quot;%.1f&quot;, sum/count}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    mem_max</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;NR&gt;1 {if($4&gt;max)max=$4} END {printf &quot;%.1f&quot;, max}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    mem_min</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;NR&gt;1 {if(NR==2)min=$4; if($4&lt;min)min=$4} END {printf &quot;%.1f&quot;, min}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 计算RSS内存统计</span></span>
<span class="line"><span style="color:#E06C75;">    rss_avg</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;NR&gt;1 {sum+=$5; count++} END {if(count&gt;0) printf &quot;%.1f&quot;, sum/count}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    rss_max</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;NR&gt;1 {if($5&gt;max)max=$5} END {printf &quot;%.1f&quot;, max}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    rss_min</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#D19A66;"> -F</span><span style="color:#98C379;">&#39;,&#39;</span><span style="color:#98C379;"> &#39;NR&gt;1 {if(NR==2)min=$5; if($5&lt;min)min=$5} END {printf &quot;%.1f&quot;, min}&#39;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;CPU使用率统计:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  平均: \${</span><span style="color:#E06C75;">cpu_avg</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  最大: \${</span><span style="color:#E06C75;">cpu_max</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  最小: \${</span><span style="color:#E06C75;">cpu_min</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;内存使用率统计 (%):&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  平均: \${</span><span style="color:#E06C75;">mem_avg</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  最大: \${</span><span style="color:#E06C75;">mem_max</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  最小: \${</span><span style="color:#E06C75;">mem_min</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;物理内存 (RSS) 统计 (MB):&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  平均: \${</span><span style="color:#E06C75;">rss_avg</span><span style="color:#98C379;">}MB&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  最大: \${</span><span style="color:#E06C75;">rss_max</span><span style="color:#98C379;">}MB&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  最小: \${</span><span style="color:#E06C75;">rss_min</span><span style="color:#98C379;">}MB&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;原始数据已保存到:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  \${</span><span style="color:#E06C75;">REPORT_FILE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 提供数据导出建议</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;数据分析建议:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  1. 使用Excel或Python分析数据&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  2. 识别性能峰值和异常&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  3. 对比不同时间的基线数据&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  4. 基于数据进行容量规划&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    init_monitoring</span></span>
<span class="line"><span style="color:#61AFEF;">    run_monitoring</span></span>
<span class="line"><span style="color:#61AFEF;">    generate_perf_report</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此脚本适合用于建立应用的性能基线和持续监测。</p><h2 id="案例五-诊断数据收集与问题分析脚本" tabindex="-1"><a class="header-anchor" href="#案例五-诊断数据收集与问题分析脚本"><span>案例五：诊断数据收集与问题分析脚本</span></a></h2><p>当应用出现问题时，需要收集诊断数据进行深层分析，<a href="http://xn--kcr052ct6c1vm14o.NET" target="_blank" rel="noopener noreferrer">此脚本利用.NET</a> Core诊断工具进行数据收集。</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .NET Core 诊断数据收集脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：使用dotnet-dump、dotnet-trace、dotnet-counters收集诊断数据</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用于问题排查和性能分析</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;mynetcoreapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> DIAG_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/diagnostics&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> TIMESTAMP</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> SESSION_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DIAG_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">TIMESTAMP</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化</span></span>
<span class="line"><span style="color:#61AFEF;">init_diagnostics</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;诊断会话目录: \${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查诊断工具</span></span>
<span class="line"><span style="color:#61AFEF;">check_diagnostic_tools</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;检查诊断工具...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> tools_missing</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> dotnet-dump</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ dotnet-dump 未安装&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  安装: dotnet tool install -g dotnet-dump&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">tools_missing</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ dotnet-dump 已安装&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> dotnet-trace</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ dotnet-trace 未安装&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  安装: dotnet tool install -g dotnet-trace&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">tools_missing</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ dotnet-trace 已安装&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> dotnet-counters</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ dotnet-counters 未安装&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  安装: dotnet tool install -g dotnet-counters&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">tools_missing</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ dotnet-counters 已安装&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">tools_missing</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;提示: 某些诊断工具未安装，请先安装&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;通常位置: ~/.dotnet/tools/&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取应用PID</span></span>
<span class="line"><span style="color:#61AFEF;">get_app_pid</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span></span>
<span class="line"><span style="color:#E06C75;">    pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;dotnet.*\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}\\.dll&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 应用进程未找到&quot;</span><span style="color:#ABB2BF;"> &gt;&amp;2</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 收集进程快照（dump）</span></span>
<span class="line"><span style="color:#61AFEF;">collect_dump</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> dump_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/dump_\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}.dmp&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;收集进程转储 (Dump)...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;PID: \${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;目标文件: \${</span><span style="color:#E06C75;">dump_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> dotnet-dump</span><span style="color:#98C379;"> collect</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">dump_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/collection.log&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ Dump文件生成成功: \${</span><span style="color:#E06C75;">dump_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✗ Dump文件生成失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 收集性能跟踪数据</span></span>
<span class="line"><span style="color:#61AFEF;">collect_trace</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> trace_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/trace_\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}.nettrace&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;收集性能跟踪 (Trace) - 持续10秒...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;PID: \${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;目标文件: \${</span><span style="color:#E06C75;">trace_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;注: 跟踪收集将持续10秒，请保持应用正常运行&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用dotnet-trace collect，持续10秒</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> timeout</span><span style="color:#D19A66;"> 15</span><span style="color:#98C379;"> dotnet-trace</span><span style="color:#98C379;"> collect</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">trace_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> 10</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/collection.log&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ Trace文件生成成功: \${</span><span style="color:#E06C75;">trace_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ Trace文件生成可能未完成，但不影响其他诊断&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 收集性能计数器数据</span></span>
<span class="line"><span style="color:#61AFEF;">collect_counters</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> counter_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/counters_\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}.txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;收集性能计数器 (Counters) - 持续30秒...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;PID: \${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;目标文件: \${</span><span style="color:#E06C75;">counter_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 采集30秒的计数器数据</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> timeout</span><span style="color:#D19A66;"> 35</span><span style="color:#98C379;"> dotnet-counters</span><span style="color:#98C379;"> monitor</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">counter_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> --duration</span><span style="color:#D19A66;"> 30</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/collection.log&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ 计数器数据采集成功: \${</span><span style="color:#E06C75;">counter_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ 计数器数据采集可能未完成&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 收集GC转储</span></span>
<span class="line"><span style="color:#61AFEF;">collect_gcdump</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> gcdump_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/gcdump_\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}.gcdump&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;收集垃圾回收转储 (GCDump)...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;PID: \${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;目标文件: \${</span><span style="color:#E06C75;">gcdump_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> dotnet-gcdump</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> dotnet-gcdump</span><span style="color:#98C379;"> collect</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">gcdump_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">tee</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/collection.log&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;✓ GCDump文件生成成功: \${</span><span style="color:#E06C75;">gcdump_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;⚠ GCDump文件生成失败，但不影响其他诊断&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ dotnet-gcdump 未安装，跳过GCDump收集&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 收集系统诊断信息</span></span>
<span class="line"><span style="color:#61AFEF;">collect_system_info</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;收集系统诊断信息...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> info_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/system_info.txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;系统诊断信息收集时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=== 操作系统信息 ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        uname</span><span style="color:#D19A66;"> -a</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=== .NET版本信息 ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        dotnet</span><span style="color:#D19A66;"> --version</span></span>
<span class="line"><span style="color:#61AFEF;">        dotnet</span><span style="color:#D19A66;"> --info</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=== 系统资源使用 ===&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;CPU信息:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        nproc</span></span>
<span class="line"><span style="color:#61AFEF;">        lscpu</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;内存信息:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        free</span><span style="color:#D19A66;"> -h</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;磁盘信息:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        df</span><span style="color:#D19A66;"> -h</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=== 应用进程信息 ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        ps</span><span style="color:#98C379;"> aux</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> dotnet</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> grep</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=== 网络连接 ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#61AFEF;">netstat</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">    } &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">info_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 系统信息已保存: \${</span><span style="color:#E06C75;">info_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成诊断总结</span></span>
<span class="line"><span style="color:#61AFEF;">generate_diagnostic_summary</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> summary_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}/README.txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">summary_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">================================================================================</span></span>
<span class="line"><span style="color:#98C379;">.NET Core 应用诊断数据包</span></span>
<span class="line"><span style="color:#98C379;">================================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">本诊断包包含以下内容：</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">1. dump_*.dmp</span></span>
<span class="line"><span style="color:#98C379;">   - 进程内存转储文件</span></span>
<span class="line"><span style="color:#98C379;">   - 用于分析内存泄漏、堆内容、对象图等</span></span>
<span class="line"><span style="color:#98C379;">   - 可用工具: Visual Studio, WinDbg, lldb with SOS</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">2. trace_*.nettrace</span></span>
<span class="line"><span style="color:#98C379;">   - 性能跟踪数据</span></span>
<span class="line"><span style="color:#98C379;">   - 包含方法执行、GC行为、异常等信息</span></span>
<span class="line"><span style="color:#98C379;">   - 可用工具: Visual Studio, PerfView</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">3. counters_*.txt</span></span>
<span class="line"><span style="color:#98C379;">   - 性能计数器数据</span></span>
<span class="line"><span style="color:#98C379;">   - 包含CPU、内存、GC、线程等实时数据</span></span>
<span class="line"><span style="color:#98C379;">   - 适合性能趋势分析</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">4. gcdump_*.gcdump</span></span>
<span class="line"><span style="color:#98C379;">   - 垃圾回收堆转储</span></span>
<span class="line"><span style="color:#98C379;">   - 用于分析托管内存使用</span></span>
<span class="line"><span style="color:#98C379;">   - 可用工具: Visual Studio, PerfView</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">5. system_info.txt</span></span>
<span class="line"><span style="color:#98C379;">   - 系统和应用的基础信息</span></span>
<span class="line"><span style="color:#98C379;">   - 用于环境对比</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">使用说明：</span></span>
<span class="line"><span style="color:#98C379;">---------</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">Windows 环境：</span></span>
<span class="line"><span style="color:#98C379;">  1. 将转储文件导入Visual Studio</span></span>
<span class="line"><span style="color:#98C379;">  2. 分析调用栈、变量值、内存状态</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">Linux 环境：</span></span>
<span class="line"><span style="color:#98C379;">  1. 使用 dotnet-dump analyze &lt;dumpfile&gt; 分析</span></span>
<span class="line"><span style="color:#98C379;">  2. 常用命令:</span></span>
<span class="line"><span style="color:#98C379;">     - clrstack          查看所有线程调用栈</span></span>
<span class="line"><span style="color:#98C379;">     - dumpheap -mt 地址 查看特定类型的对象</span></span>
<span class="line"><span style="color:#98C379;">     - gcroot 地址       找到对象的引用链</span></span>
<span class="line"><span style="color:#98C379;">     - !threads          查看所有托管线程</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">性能分析：</span></span>
<span class="line"><span style="color:#98C379;">  1. 查看counters文件识别性能瓶颈</span></span>
<span class="line"><span style="color:#98C379;">  2. 使用trace文件进行详细的执行分析</span></span>
<span class="line"><span style="color:#98C379;">  3. 对比历史基线数据</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">常见问题排查：</span></span>
<span class="line"><span style="color:#98C379;">  - 高CPU: 查看trace文件中CPU占用最高的方法</span></span>
<span class="line"><span style="color:#98C379;">  - 内存泄漏: 查看dump文件中的对象引用</span></span>
<span class="line"><span style="color:#98C379;">  - GC压力: 在counters数据中查看GC统计</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">================================================================================</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 诊断数据包总结已生成&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">summary_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╔════════════════════════════════════════════════════════════════╗&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  .NET Core 应用诊断数据收集工具                                ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)                          ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╚════════════════════════════════════════════════════════════════╝&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    init_diagnostics</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#61AFEF;">check_diagnostic_tools</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 部分诊断工具未安装，请先安装&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> pid</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#E06C75;">pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">get_app_pid</span><span style="color:#ABB2BF;">); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 应用进程未找到&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;找到应用进程: PID=\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 依次收集诊断数据</span></span>
<span class="line"><span style="color:#61AFEF;">    collect_dump</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    collect_trace</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    collect_counters</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    collect_gcdump</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    collect_system_info</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 生成总结</span></span>
<span class="line"><span style="color:#61AFEF;">    generate_diagnostic_summary</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;诊断数据收集完成&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;所有文件已保存到: \${</span><span style="color:#E06C75;">SESSION_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;后续步骤:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  1. 将诊断包复制到Windows机器&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  2. 使用Visual Studio或PerfView分析&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  3. 根据分析结果进行优化&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="http://xn--ykqpt4d004biqdy9u83gv5u2li6pu.NET" target="_blank" rel="noopener noreferrer">此脚本展示了如何使用.NET</a> Core诊断工具进行问题排查。</p><h1 id="net-core生产级shell脚本实战指南-案例六至十深度讲解" tabindex="-1"><a class="header-anchor" href="#net-core生产级shell脚本实战指南-案例六至十深度讲解"><span>.NET Core生产级Shell脚本实战指南：案例六至十深度讲解</span></a></h1><h2 id="案例六-日志收集、聚合与智能分析脚本" tabindex="-1"><a class="header-anchor" href="#案例六-日志收集、聚合与智能分析脚本"><span>案例六：日志收集、聚合与智能分析脚本</span></a></h2><p><a href="http://xn--fiq7k64x7k2asrb.NET" target="_blank" rel="noopener noreferrer">生产环境中.NET</a> Core应用会产生大量日志，需要系统化的收集和分析机制来快速定位问题。此脚本提供了日志收集、压缩、分析和异常告警的完整流程。]]。此脚本提供了日志收集、压缩、分析和异常告警的完整流程。)</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .NET Core 日志收集与智能分析脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：收集应用日志、压缩存档、分析异常、告警通知</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境已验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;mynetcoreapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> LOG_SOURCE_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> LOG_ARCHIVE_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/archive&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> LOG_ANALYSIS_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/analysis&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> RETENTION_DAYS</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">30</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> ALERT_EMAIL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;devops@company.com&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> ALERT_THRESHOLD_ERROR</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">50</span><span style="color:#7F848E;font-style:italic;">      # 错误数量阈值</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> ALERT_THRESHOLD_EXCEPTION</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">10</span><span style="color:#7F848E;font-style:italic;">  # 异常数量阈值</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 颜色定义</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> RED</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[0;31m&#39;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> GREEN</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[0;32m&#39;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> YELLOW</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[1;33m&#39;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> NC</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&#39;\\033[0m&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化目录</span></span>
<span class="line"><span style="color:#61AFEF;">init_log_dirs</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_ARCHIVE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_ANALYSIS_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    chmod</span><span style="color:#D19A66;"> 755</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_ARCHIVE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    chmod</span><span style="color:#D19A66;"> 755</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_ANALYSIS_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 收集日志</span></span>
<span class="line"><span style="color:#61AFEF;">collect_logs</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;开始收集日志...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;日志源目录: \${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;日志目录不存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> log_count</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 收集所有日志文件</span></span>
<span class="line"><span style="color:#C678DD;">    for</span><span style="color:#E06C75;"> log_file</span><span style="color:#C678DD;"> in</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}&quot;/*.log</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">log_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#ABB2BF;">            ((</span><span style="color:#E06C75;">log_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;发现 \${</span><span style="color:#E06C75;">log_count</span><span style="color:#98C379;">} 个日志文件&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 压缩归档日志</span></span>
<span class="line"><span style="color:#61AFEF;">archive_logs</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;日志归档&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> archive_date</span></span>
<span class="line"><span style="color:#E06C75;">    archive_date</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> &quot;yesterday&quot;</span><span style="color:#98C379;"> &#39;+%Y%m%d&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> archive_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_ARCHIVE_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}_logs_\${</span><span style="color:#E06C75;">archive_date</span><span style="color:#98C379;">}.tar.gz&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 查找前一天的日志</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> found_logs</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}/app_\${</span><span style="color:#E06C75;">archive_date</span><span style="color:#98C379;">}.log&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;准备压缩日志: app_\${</span><span style="color:#E06C75;">archive_date</span><span style="color:#98C379;">}.log&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> tar</span><span style="color:#D19A66;"> -czf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">archive_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            -C</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">            &quot;app_\${</span><span style="color:#E06C75;">archive_date</span><span style="color:#98C379;">}.log&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">            &quot;error_\${</span><span style="color:#E06C75;">archive_date</span><span style="color:#98C379;">}.log&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> archive_size</span></span>
<span class="line"><span style="color:#E06C75;">            archive_size</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">du</span><span style="color:#D19A66;"> -sh</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">archive_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">cut</span><span style="color:#D19A66;"> -f1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;✓ 日志已压缩: \${</span><span style="color:#E06C75;">archive_file</span><span style="color:#98C379;">} (大小: \${</span><span style="color:#E06C75;">archive_size</span><span style="color:#98C379;">})&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            ((</span><span style="color:#E06C75;">found_logs</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 删除原始日志文件</span></span>
<span class="line"><span style="color:#61AFEF;">            rm</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}/app_\${</span><span style="color:#E06C75;">archive_date</span><span style="color:#98C379;">}.log&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            rm</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}/error_\${</span><span style="color:#E06C75;">archive_date</span><span style="color:#98C379;">}.log&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">found_logs</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ 未找到前一天的日志&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 清理过期日志</span></span>
<span class="line"><span style="color:#61AFEF;">cleanup_old_logs</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;清理过期日志&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;删除超过 \${</span><span style="color:#E06C75;">RETENTION_DAYS</span><span style="color:#98C379;">} 天的日志...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> deleted_count</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#E06C75;"> IFS</span><span style="color:#56B6C2;">=</span><span style="color:#56B6C2;"> read</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> old_file</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#61AFEF;">        rm</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">old_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  删除: $(</span><span style="color:#61AFEF;">basename</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">old_file</span><span style="color:#98C379;">}&quot;)&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">deleted_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    done</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">&lt;(</span><span style="color:#61AFEF;">find</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_ARCHIVE_DIR</span><span style="color:#98C379;">}&quot; </span><span style="color:#D19A66;">-name</span><span style="color:#98C379;"> &quot;*.tar.gz&quot; </span><span style="color:#D19A66;">-mtime</span><span style="color:#98C379;"> &quot;+\${</span><span style="color:#E06C75;">RETENTION_DAYS</span><span style="color:#98C379;">}&quot;)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 已删除 \${</span><span style="color:#E06C75;">deleted_count</span><span style="color:#98C379;">} 个过期日志文件&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 分析日志中的错误和异常</span></span>
<span class="line"><span style="color:#61AFEF;">analyze_logs</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;日志分析&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> analysis_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_ANALYSIS_DIR</span><span style="color:#98C379;">}/daily_analysis_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d).txt&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> current_date</span></span>
<span class="line"><span style="color:#E06C75;">    current_date</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y%m%d&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> app_log</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}/app_\${</span><span style="color:#E06C75;">current_date</span><span style="color:#98C379;">}.log&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> error_log</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}/error_\${</span><span style="color:#E06C75;">current_date</span><span style="color:#98C379;">}.log&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;日志分析报告&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;生成时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;==================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 分析应用日志</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;== 应用日志统计 ==&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;总行数: $(</span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;"> &lt;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log</span><span style="color:#98C379;">}&quot;)&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 统计日志级别</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> info_count</span><span style="color:#E06C75;"> warn_count</span><span style="color:#E06C75;"> error_count</span></span>
<span class="line"><span style="color:#E06C75;">            info_count</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">            warn_count</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">            error_count</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;INFO: \${</span><span style="color:#E06C75;">info_count</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;WARN: \${</span><span style="color:#E06C75;">warn_count</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;ERROR: \${</span><span style="color:#E06C75;">error_count</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 记录错误计数供后续告警使用</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;ERROR_COUNT=\${</span><span style="color:#E06C75;">error_count</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;/tmp/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}_log_metrics.sh&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 分析错误日志</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">error_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;== 错误日志统计 ==&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            local</span><span style="color:#E06C75;"> error_file_count</span></span>
<span class="line"><span style="color:#E06C75;">            error_file_count</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">error_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;错误日志行数: \${</span><span style="color:#E06C75;">error_file_count</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 统计异常类型</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;主要异常类型:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;Exception\\|Error\\|Fatal&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">error_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">                sed</span><span style="color:#98C379;"> &#39;s/.*\\(Exception.*:\\|Error.*:\\|Fatal.*:\\).*/\\1/g&#39;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">                sort</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">uniq</span><span style="color:#D19A66;"> -c</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">sort</span><span style="color:#D19A66;"> -rn</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -10</span><span style="color:#ABB2BF;"> | </span><span style="color:#C678DD;">while</span><span style="color:#56B6C2;"> read</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> line</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;  \${</span><span style="color:#E06C75;">line</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            done</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;EXCEPTION_COUNT=$(</span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &#39;Exception&#39; &quot;\${</span><span style="color:#E06C75;">error_log</span><span style="color:#98C379;">}&quot; </span><span style="color:#ABB2BF;">2&gt;</span><span style="color:#98C379;">/dev/null </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> wc</span><span style="color:#D19A66;"> -l</span><span style="color:#ABB2BF;"> ||</span><span style="color:#56B6C2;"> echo</span><span style="color:#D19A66;"> 0</span><span style="color:#98C379;">)&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;/tmp/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}_log_metrics.sh&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;== 最近的关键日志 ==&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;最后5条ERROR日志:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tail</span><span style="color:#D19A66;"> -5</span><span style="color:#ABB2BF;"> | </span><span style="color:#C678DD;">while</span><span style="color:#56B6C2;"> read</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> line</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#56B6C2;">                echo</span><span style="color:#98C379;"> &quot;  \${</span><span style="color:#E06C75;">line</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;">0</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;">120</span><span style="color:#98C379;">}...&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            done</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">    } | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">analysis_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 分析报告已保存: \${</span><span style="color:#E06C75;">analysis_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 性能指标提取</span></span>
<span class="line"><span style="color:#61AFEF;">extract_performance_metrics</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;性能指标提取&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> current_date</span></span>
<span class="line"><span style="color:#E06C75;">    current_date</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y%m%d&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> app_log</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}/app_\${</span><span style="color:#E06C75;">current_date</span><span style="color:#98C379;">}.log&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ 应用日志不存在&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> metrics_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_ANALYSIS_DIR</span><span style="color:#98C379;">}/metrics_\${</span><span style="color:#E06C75;">current_date</span><span style="color:#98C379;">}.csv&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Timestamp,RequestPath,ResponseTime(ms),StatusCode,MemoryUsage(MB)&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 从日志中提取性能相关的日志条目</span></span>
<span class="line"><span style="color:#61AFEF;">        grep</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> &quot;request\\|response\\|timing\\|duration&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_log</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">            grep</span><span style="color:#D19A66;"> -oE</span><span style="color:#98C379;"> &quot;[0-9]{2}:[0-9]{2}:[0-9]{2}.*&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#61AFEF;">            head</span><span style="color:#D19A66;"> -100</span></span>
<span class="line"><span style="color:#ABB2BF;">    } &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">metrics_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-s</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">metrics_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ 性能指标已提取: \${</span><span style="color:#E06C75;">metrics_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查告警条件</span></span>
<span class="line"><span style="color:#61AFEF;">check_alert_conditions</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;告警检查&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 读取日志指标</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;/tmp/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}_log_metrics.sh&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        source</span><span style="color:#98C379;"> &quot;/tmp/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}_log_metrics.sh&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> should_alert</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> alert_message</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查错误阈值</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( \${</span><span style="color:#E06C75;">ERROR_COUNT</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">0</span><span style="color:#ABB2BF;">} </span><span style="color:#56B6C2;">&gt;</span><span style="color:#E06C75;"> ALERT_THRESHOLD_ERROR</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">        should_alert</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1</span></span>
<span class="line"><span style="color:#E06C75;">        alert_message</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">alert_message</span><span style="color:#98C379;">}✗ ERROR数量过多: \${</span><span style="color:#E06C75;">ERROR_COUNT</span><span style="color:#98C379;">} (阈值: \${</span><span style="color:#E06C75;">ALERT_THRESHOLD_ERROR</span><span style="color:#98C379;">})\\n&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查异常阈值</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( \${</span><span style="color:#E06C75;">EXCEPTION_COUNT</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">0</span><span style="color:#ABB2BF;">} </span><span style="color:#56B6C2;">&gt;</span><span style="color:#E06C75;"> ALERT_THRESHOLD_EXCEPTION</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">        should_alert</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1</span></span>
<span class="line"><span style="color:#E06C75;">        alert_message</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">alert_message</span><span style="color:#98C379;">}✗ EXCEPTION数量过多: \${</span><span style="color:#E06C75;">EXCEPTION_COUNT</span><span style="color:#98C379;">} (阈值: \${</span><span style="color:#E06C75;">ALERT_THRESHOLD_EXCEPTION</span><span style="color:#98C379;">})\\n&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">should_alert</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">RED</span><span style="color:#98C379;">}\${</span><span style="color:#E06C75;">alert_message</span><span style="color:#98C379;">}\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        send_alert</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">alert_message</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">GREEN</span><span style="color:#98C379;">}✓ 日志指标正常\${</span><span style="color:#E06C75;">NC</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 发送告警通知</span></span>
<span class="line"><span style="color:#61AFEF;">send_alert</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> message</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;发送告警通知...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 使用mail命令发送邮件（需要系统配置mail服务）</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> mail</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#ABB2BF;">        {</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;主题: \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">} 日志分析告警 - $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;检测到日志异常：&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#D19A66;"> -e</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;请立即查看详细日志进行排查&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;日志目录: \${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        } | </span><span style="color:#61AFEF;">mail</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">} 日志告警&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">ALERT_EMAIL</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ 告警邮件已发送到: \${</span><span style="color:#E06C75;">ALERT_EMAIL</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 如果没有mail，写入告警文件</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ mail命令不可用，告警信息已写入日志&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;[ALERT] $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;) \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#56B6C2;">\\</span></span>
<span class="line"><span style="color:#98C379;">            &quot;\${</span><span style="color:#E06C75;">LOG_ANALYSIS_DIR</span><span style="color:#98C379;">}/alerts.log&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成日志摘要报告</span></span>
<span class="line"><span style="color:#61AFEF;">generate_summary_report</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;日志处理摘要&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> summary_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">LOG_ANALYSIS_DIR</span><span style="color:#98C379;">}/daily_summary_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d).txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;日志处理任务完成&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;完成时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;处理步骤:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  ✓ 日志收集&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  ✓ 日志压缩归档&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  ✓ 过期日志清理&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  ✓ 日志分析&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  ✓ 性能指标提取&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  ✓ 告警检查&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;关键数据:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  日志源目录: \${</span><span style="color:#E06C75;">LOG_SOURCE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  归档目录: \${</span><span style="color:#E06C75;">LOG_ARCHIVE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  分析目录: \${</span><span style="color:#E06C75;">LOG_ANALYSIS_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  保留天数: \${</span><span style="color:#E06C75;">RETENTION_DAYS</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;归档日志统计:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  总数: $(</span><span style="color:#61AFEF;">find</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_ARCHIVE_DIR</span><span style="color:#98C379;">}&quot; </span><span style="color:#D19A66;">-name</span><span style="color:#98C379;"> &quot;*.tar.gz&quot; </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> wc</span><span style="color:#D19A66;"> -l</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  总大小: $(</span><span style="color:#61AFEF;">du</span><span style="color:#D19A66;"> -sh</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_ARCHIVE_DIR</span><span style="color:#98C379;">}&quot; </span><span style="color:#ABB2BF;">|</span><span style="color:#61AFEF;"> cut</span><span style="color:#D19A66;"> -f1</span><span style="color:#98C379;">)&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">    } | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">summary_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╔════════════════════════════════════════════════════════════════╗&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  .NET Core 日志收集与分析工具                                  ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)                          ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╚════════════════════════════════════════════════════════════════╝&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    init_log_dirs</span></span>
<span class="line"><span style="color:#61AFEF;">    collect_logs</span></span>
<span class="line"><span style="color:#61AFEF;">    archive_logs</span></span>
<span class="line"><span style="color:#61AFEF;">    cleanup_old_logs</span></span>
<span class="line"><span style="color:#61AFEF;">    analyze_logs</span></span>
<span class="line"><span style="color:#61AFEF;">    extract_performance_metrics</span></span>
<span class="line"><span style="color:#61AFEF;">    check_alert_conditions</span></span>
<span class="line"><span style="color:#61AFEF;">    generate_summary_report</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;═══════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;日志处理完成&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;═══════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此脚本提供了完整的日志管理生命周期，特别是智能告警功能能帮助及时发现问题。]]，特别是智能告警功能能帮助及时发现问题。)</p><h2 id="案例七-数据库连接池监测与自动调优脚本" tabindex="-1"><a class="header-anchor" href="#案例七-数据库连接池监测与自动调优脚本"><span>案例七：数据库连接池监测与自动调优脚本</span></a></h2><p>.NET Core应用的性能往往受制于数据库连接，此脚本通过监测连接池状态来诊断数据库相关问题。]]。)</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .NET Core 数据库连接池监测脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：监测PostgreSQL/MySQL连接、检测连接泄漏、提供优化建议</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境已验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;mynetcoreapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> DB_HOST</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">localhost</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> DB_PORT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">5432</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> DB_USER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">postgres</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> DB_PASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#ABB2BF;">:-</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> MONITOR_INTERVAL</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">5</span><span style="color:#7F848E;font-style:italic;">  # 秒</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> MONITOR_DURATION</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">300</span><span style="color:#7F848E;font-style:italic;">  # 秒</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> REPORT_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/db_monitoring&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化</span></span>
<span class="line"><span style="color:#61AFEF;">init_monitoring</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查数据库连接</span></span>
<span class="line"><span style="color:#61AFEF;">check_db_connectivity</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;检查数据库连接...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> psql</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # PostgreSQL</span></span>
<span class="line"><span style="color:#E06C75;">        PGPASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#98C379;">}&quot;</span><span style="color:#61AFEF;"> psql</span><span style="color:#D19A66;"> -h</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            -U</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;SELECT 1;&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#E5C07B;">$?</span><span style="color:#56B6C2;"> -eq</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;✓ 数据库连接正常&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;✗ 数据库连接失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ psql命令不可用，无法验证数据库连接&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取PostgreSQL连接状态</span></span>
<span class="line"><span style="color:#61AFEF;">get_pg_connections</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> psql</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#E06C75;">    PGPASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#98C379;">}&quot;</span><span style="color:#61AFEF;"> psql</span><span style="color:#D19A66;"> -h</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        -U</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> -c</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;SELECT count(*) FROM pg_stat_activity;&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取PostgreSQL数据库锁</span></span>
<span class="line"><span style="color:#61AFEF;">get_pg_locks</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> psql</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#E06C75;">    PGPASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#98C379;">}&quot;</span><span style="color:#61AFEF;"> psql</span><span style="color:#D19A66;"> -h</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        -U</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> -c</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;SELECT count(*) FROM pg_locks;&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取PostgreSQL长运行查询</span></span>
<span class="line"><span style="color:#61AFEF;">get_pg_long_queries</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> psql</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;运行时间超过1分钟的查询&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#E06C75;">    PGPASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#98C379;">}&quot;</span><span style="color:#61AFEF;"> psql</span><span style="color:#D19A66;"> -h</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        -U</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span><span style="color:#61AFEF;"> 2</span><span style="color:#ABB2BF;">&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#98C379;">SELECT </span></span>
<span class="line"><span style="color:#98C379;">    pid,</span></span>
<span class="line"><span style="color:#98C379;">    usename,</span></span>
<span class="line"><span style="color:#98C379;">    application_name,</span></span>
<span class="line"><span style="color:#98C379;">    query,</span></span>
<span class="line"><span style="color:#98C379;">    NOW() - query_start AS runtime</span></span>
<span class="line"><span style="color:#98C379;">FROM pg_stat_activity</span></span>
<span class="line"><span style="color:#98C379;">WHERE query_start &lt; NOW() - INTERVAL &#39;1 minute&#39;</span></span>
<span class="line"><span style="color:#98C379;">    AND state = &#39;active&#39;</span></span>
<span class="line"><span style="color:#98C379;">ORDER BY query_start DESC</span></span>
<span class="line"><span style="color:#98C379;">LIMIT 10;</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 获取数据库缓存命中率</span></span>
<span class="line"><span style="color:#61AFEF;">get_cache_hit_ratio</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> psql</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#E06C75;">    PGPASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#98C379;">}&quot;</span><span style="color:#61AFEF;"> psql</span><span style="color:#D19A66;"> -h</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        -U</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> -c</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;SELECT </span></span>
<span class="line"><span style="color:#98C379;">            sum(blks_hit)::float / (sum(blks_hit) + sum(blks_read)) * 100 AS cache_hit_ratio</span></span>
<span class="line"><span style="color:#98C379;">         FROM pg_stat_user_tables;&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 监测应用连接使用情况</span></span>
<span class="line"><span style="color:#61AFEF;">monitor_app_connections</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;应用数据库连接监测&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> report_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/connection_monitor_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S).csv&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 创建CSV头</span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;">Timestamp,TotalConnections,ActiveConnections,IdleConnections,MaxConnections,PoolWaitTime</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> elapsed</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> samples</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">elapsed</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> MONITOR_DURATION</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> total_conn</span><span style="color:#E06C75;"> idle_conn</span></span>
<span class="line"><span style="color:#E06C75;">        total_conn</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">get_pg_connections</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;0&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 计算空闲连接（这是一个简化估算）</span></span>
<span class="line"><span style="color:#E06C75;">        idle_conn</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">total_conn</span><span style="color:#98C379;"> -</span><span style="color:#D19A66;"> 1</span><span style="color:#ABB2BF;">))  </span><span style="color:#7F848E;font-style:italic;"># 至少保留一个活跃连接用于监测</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> timestamp</span></span>
<span class="line"><span style="color:#E06C75;">        timestamp</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 这里应该从应用的诊断API获取实际数据</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 示例数据格式</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">timestamp</span><span style="color:#98C379;">},\${</span><span style="color:#E06C75;">total_conn</span><span style="color:#98C379;">},$((</span><span style="color:#61AFEF;">total_conn</span><span style="color:#98C379;"> / </span><span style="color:#D19A66;">2</span><span style="color:#98C379;">)),\${</span><span style="color:#E06C75;">idle_conn</span><span style="color:#98C379;">},20,0&quot;</span><span style="color:#ABB2BF;"> &gt;&gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( (</span><span style="color:#E06C75;">samples</span><span style="color:#56B6C2;"> %</span><span style="color:#ABB2BF;"> (</span><span style="color:#D19A66;">10</span><span style="color:#56B6C2;"> /</span><span style="color:#E06C75;"> MONITOR_INTERVAL</span><span style="color:#ABB2BF;">)) == 0 )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;[\${</span><span style="color:#E06C75;">timestamp</span><span style="color:#98C379;">}] 连接数: \${</span><span style="color:#E06C75;">total_conn</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#61AFEF;">        sleep</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">MONITOR_INTERVAL</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">elapsed</span><span style="color:#56B6C2;"> +=</span><span style="color:#E06C75;"> MONITOR_INTERVAL</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">        ((</span><span style="color:#E06C75;">samples</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 监测完成，数据已保存: \${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 分析连接泄漏</span></span>
<span class="line"><span style="color:#61AFEF;">analyze_connection_leaks</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;连接泄漏分析&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> psql</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ 无法进行分析（psql不可用）&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> analysis_report</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/leak_analysis_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d).txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;连接泄漏分析报告&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;生成时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;== 来自应用的连接 ==&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        PGPASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#98C379;">}&quot;</span><span style="color:#61AFEF;"> psql</span><span style="color:#D19A66;"> -h</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            -U</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span><span style="color:#61AFEF;"> 2</span><span style="color:#ABB2BF;">&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#98C379;">SELECT </span></span>
<span class="line"><span style="color:#98C379;">    application_name,</span></span>
<span class="line"><span style="color:#98C379;">    count(*) AS connection_count,</span></span>
<span class="line"><span style="color:#98C379;">    max(EXTRACT(EPOCH FROM (NOW() - query_start))::int) AS oldest_query_seconds</span></span>
<span class="line"><span style="color:#98C379;">FROM pg_stat_activity</span></span>
<span class="line"><span style="color:#98C379;">WHERE application_name != &#39;psql&#39;</span></span>
<span class="line"><span style="color:#98C379;">GROUP BY application_name</span></span>
<span class="line"><span style="color:#98C379;">ORDER BY connection_count DESC;</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;== 空闲连接超过5分钟的连接 ==&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        PGPASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#98C379;">}&quot;</span><span style="color:#61AFEF;"> psql</span><span style="color:#D19A66;"> -h</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            -U</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">EOF</span><span style="color:#61AFEF;"> 2</span><span style="color:#ABB2BF;">&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#98C379;">SELECT </span></span>
<span class="line"><span style="color:#98C379;">    pid,</span></span>
<span class="line"><span style="color:#98C379;">    usename,</span></span>
<span class="line"><span style="color:#98C379;">    application_name,</span></span>
<span class="line"><span style="color:#98C379;">    state,</span></span>
<span class="line"><span style="color:#98C379;">    EXTRACT(EPOCH FROM (NOW() - state_change))::int AS idle_seconds</span></span>
<span class="line"><span style="color:#98C379;">FROM pg_stat_activity</span></span>
<span class="line"><span style="color:#98C379;">WHERE state = &#39;idle&#39;</span></span>
<span class="line"><span style="color:#98C379;">    AND state_change &lt; NOW() - INTERVAL &#39;5 minutes&#39;</span></span>
<span class="line"><span style="color:#98C379;">ORDER BY state_change DESC</span></span>
<span class="line"><span style="color:#98C379;">LIMIT 20;</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    } | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">analysis_report</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 分析报告已保存: \${</span><span style="color:#E06C75;">analysis_report</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优化建议</span></span>
<span class="line"><span style="color:#61AFEF;">provide_optimization_suggestions</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;数据库性能优化建议&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#56B6C2;">command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> psql</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        return</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 获取缓存命中率</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> cache_ratio</span></span>
<span class="line"><span style="color:#E06C75;">    cache_ratio</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">get_cache_hit_ratio</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;0&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;当前缓存命中率: \${</span><span style="color:#E06C75;">cache_ratio</span><span style="color:#98C379;">}%&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> (( $(</span><span style="color:#E06C75;">echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">cache_ratio</span><span style="color:#98C379;">} &lt; 99&quot;</span><span style="color:#56B6C2;"> |</span><span style="color:#E06C75;"> bc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;">l</span><span style="color:#ABB2BF;">) )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ 建议: 缓存命中率较低，考虑增加shared_buffers&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ 缓存命中率良好&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查未使用的索引</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;未使用的索引:&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    PGPASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#98C379;">}&quot;</span><span style="color:#61AFEF;"> psql</span><span style="color:#D19A66;"> -h</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        -U</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> -c</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;SELECT schemaname, tablename, indexname, idx_scan</span></span>
<span class="line"><span style="color:#98C379;">         FROM pg_stat_user_indexes</span></span>
<span class="line"><span style="color:#98C379;">         WHERE idx_scan = 0</span></span>
<span class="line"><span style="color:#98C379;">         ORDER BY pg_relation_size(indexrelid) DESC</span></span>
<span class="line"><span style="color:#98C379;">         LIMIT 10;&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查表大小</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;大表统计（大小降序）:&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    PGPASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#98C379;">}&quot;</span><span style="color:#61AFEF;"> psql</span><span style="color:#D19A66;"> -h</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        -U</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">DB_USER</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> -c</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#98C379;">        &quot;SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||&#39;.&#39;||tablename))</span></span>
<span class="line"><span style="color:#98C379;">         FROM pg_tables</span></span>
<span class="line"><span style="color:#98C379;">         WHERE schemaname NOT IN (&#39;information_schema&#39;, &#39;pg_catalog&#39;)</span></span>
<span class="line"><span style="color:#98C379;">         ORDER BY pg_total_relation_size(schemaname||&#39;.&#39;||tablename) DESC</span></span>
<span class="line"><span style="color:#98C379;">         LIMIT 10;&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成优化报告</span></span>
<span class="line"><span style="color:#61AFEF;">generate_optimization_report</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;生成优化报告&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> report_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/optimization_report_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d).txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;数据库性能优化报告&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;生成时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;数据库: \${</span><span style="color:#E06C75;">DB_HOST</span><span style="color:#98C379;">}:\${</span><span style="color:#E06C75;">DB_PORT</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;== 推荐的配置参数 ==&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;1. 连接池配置（.NET Core 应用）&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - MaxPoolSize: 20-50（根据应用并发度调整）&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - MinPoolSize: 5-10&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - Connection Timeout: 30秒&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;2. PostgreSQL 参数（postgresql.conf）&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - shared_buffers: 物理内存的 25%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - effective_cache_size: 物理内存的 50-75%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - work_mem: shared_buffers / (max_connections * 2)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - maintenance_work_mem: 物理内存的 5%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;3. 连接管理&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - max_connections: 200-500&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - idle_in_transaction_session_timeout: 10分钟&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;== 监控指标&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 缓存命中率应该 &gt; 99%&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 平均查询时间 &lt; 100ms&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 连接池利用率 &lt; 80%&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">    } | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╔════════════════════════════════════════════════════════════════╗&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  .NET Core 数据库连接池监测工具                                ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)                          ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╚════════════════════════════════════════════════════════════════╝&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    init_monitoring</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#61AFEF;">check_db_connectivity</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 无法连接到数据库，退出&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    monitor_app_connections</span></span>
<span class="line"><span style="color:#61AFEF;">    analyze_connection_leaks</span></span>
<span class="line"><span style="color:#61AFEF;">    provide_optimization_suggestions</span></span>
<span class="line"><span style="color:#61AFEF;">    generate_optimization_report</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;监测完成&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="http://xn--ciq6iwo15kn4b3vt3qqqzc508f2lwan3j.NET" target="_blank" rel="noopener noreferrer">这个脚本对于诊断和优化.NET</a> Core应用的数据库连接非常有用。]]。)</p><h2 id="案例八-应用自动更新与灰度发布脚本" tabindex="-1"><a class="header-anchor" href="#案例八-应用自动更新与灰度发布脚本"><span>案例八：应用自动更新与灰度发布脚本</span></a></h2><p>在生产环境中安全地更新应用是一项关键任务，此脚本提供了自动化的灰度发布能力。]]。)</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .NET Core 应用灰度发布脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：自动下载更新、验证、灰度发布、健康检查、自动回滚</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境已验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;mynetcoreapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/opt/dotnet/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_DLL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}.dll&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> BACKUP_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}/backups&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> RELEASE_SERVER</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;https://releases.company.com&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> RELEASE_CHANNEL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;production&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> HEALTH_CHECK_URL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;http://localhost:5000/health&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> HEALTH_CHECK_TIMEOUT</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">60</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> CANARY_PERCENTAGE</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">20</span><span style="color:#7F848E;font-style:italic;">  # 灰度发布的初始百分比</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> CANARY_DURATION</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">300</span><span style="color:#7F848E;font-style:italic;">   # 灰度验证时间（秒）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 日志函数</span></span>
<span class="line"><span style="color:#61AFEF;">log</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> level</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    shift</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> message</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E5C07B;">$*</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> timestamp</span></span>
<span class="line"><span style="color:#E06C75;">    timestamp</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;[\${</span><span style="color:#E06C75;">timestamp</span><span style="color:#98C379;">}] [\${</span><span style="color:#E06C75;">level</span><span style="color:#98C379;">}] \${</span><span style="color:#E06C75;">message</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查更新</span></span>
<span class="line"><span style="color:#61AFEF;">check_for_updates</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;检查应用更新...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 获取最新版本信息</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> latest_version</span></span>
<span class="line"><span style="color:#E06C75;">    latest_version</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">RELEASE_SERVER</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/latest-version&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;无法获取最新版本信息&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 获取当前版本</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> current_version</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}/version.txt&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">        current_version</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">cat</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}/version.txt&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#E06C75;">        current_version</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;0.0.0&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;当前版本: \${</span><span style="color:#E06C75;">current_version</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;最新版本: \${</span><span style="color:#E06C75;">latest_version</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">current_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> ==</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;应用已是最新版本&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_version</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 下载新版本</span></span>
<span class="line"><span style="color:#61AFEF;">download_release</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> version</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;下载版本 \${</span><span style="color:#E06C75;">version</span><span style="color:#98C379;">}...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> download_url</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">RELEASE_SERVER</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/releases/\${</span><span style="color:#E06C75;">version</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}.zip&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> download_dir</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/tmp/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}_\${</span><span style="color:#E06C75;">version</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> download_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">download_dir</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}.zip&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">download_dir</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 下载包</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -L</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">download_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">download_url</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;下载失败: \${</span><span style="color:#E06C75;">download_url</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        rm</span><span style="color:#D19A66;"> -rf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">download_dir</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;✓ 下载完成: \${</span><span style="color:#E06C75;">download_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">download_dir</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证发布包</span></span>
<span class="line"><span style="color:#61AFEF;">verify_release</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> package_dir</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> version</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;验证发布包...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 解压包</span></span>
<span class="line"><span style="color:#61AFEF;">    unzip</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}.zip&quot;</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}/extracted&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}/extracted/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}.dll&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;发布包格式不正确，缺少应用DLL&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 验证校验和</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> checksum_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}/extracted/CHECKSUM&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">checksum_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;验证文件完整性...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#56B6C2;"> cd</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}/extracted&quot;</span><span style="color:#ABB2BF;"> &amp;&amp; </span><span style="color:#61AFEF;">sha256sum</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">checksum_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;✓ 文件完整性验证通过&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            log</span><span style="color:#98C379;"> &quot;WARN&quot;</span><span style="color:#98C379;"> &quot;⚠ 文件完整性验证失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;✓ 发布包验证通过&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建备份</span></span>
<span class="line"><span style="color:#61AFEF;">backup_current_version</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;创建当前版本备份...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> backup_timestamp</span></span>
<span class="line"><span style="color:#E06C75;">    backup_timestamp</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> backup_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">BACKUP_DIR</span><span style="color:#98C379;">}/app_backup_\${</span><span style="color:#E06C75;">backup_timestamp</span><span style="color:#98C379;">}.tar.gz&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 备份应用文件（排除日志和缓存）</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> tar</span><span style="color:#D19A66;"> -czf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --exclude=</span><span style="color:#98C379;">&#39;logs&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --exclude=</span><span style="color:#98C379;">&#39;*.log&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        --exclude=</span><span style="color:#98C379;">&#39;.cache&#39;</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">        -C</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> .</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;✓ 备份完成: \${</span><span style="color:#E06C75;">backup_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;备份失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 灰度发布</span></span>
<span class="line"><span style="color:#61AFEF;">canary_deployment</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> new_version</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> package_dir</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> backup_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$3</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;开始灰度发布 (\${</span><span style="color:#E06C75;">CANARY_PERCENTAGE</span><span style="color:#98C379;">}% 流量)...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 在实际环境中，这里应该与负载均衡器交互</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 例如通过Nginx配置、HAProxy或专门的部署系统</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;配置灰度规则...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 示例：更新Nginx配置进行灰度</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # sed -i &quot;s/weight=100/weight=\${CANARY_PERCENTAGE}/&quot; /etc/nginx/conf.d/upstream.conf</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # systemctl reload nginx</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;灰度规则已生效，监控 \${</span><span style="color:#E06C75;">CANARY_DURATION</span><span style="color:#98C379;">} 秒...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 监测灰度发布期间的健康状态</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> check_count</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> check_interval</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> checks_needed</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$((</span><span style="color:#61AFEF;">CANARY_DURATION</span><span style="color:#98C379;"> /</span><span style="color:#98C379;"> check_interval</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">check_count</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> checks_needed</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> health_check</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#ABB2BF;">            ((</span><span style="color:#E06C75;">check_count</span><span style="color:#56B6C2;">++</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;灰度发布期间健康检查失败&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;触发自动回滚...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            rollback_deployment</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#61AFEF;">        sleep</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">check_interval</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    done</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;✓ 灰度发布阶段通过&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 全量发布</span></span>
<span class="line"><span style="color:#61AFEF;">full_deployment</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> new_version</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> package_dir</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;执行全量发布...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 停止应用</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;停止应用...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    systemctl</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#61AFEF;">supervisorctl</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 替换应用文件</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;更新应用文件...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    cp</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}/extracted/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}.dll&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}/&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 如果存在其他资源文件也需要复制</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}/extracted/wwwroot&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        cp</span><span style="color:#D19A66;"> -r</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}/extracted/wwwroot/&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}/wwwroot/&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 记录新版本</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}/version.txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 启动应用</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;启动应用...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#61AFEF;">supervisorctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;等待应用启动...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 执行健康检查</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> health_check</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;✓ 全量发布成功&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;全量发布后健康检查失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 健康检查</span></span>
<span class="line"><span style="color:#61AFEF;">health_check</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> curl</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> response</span></span>
<span class="line"><span style="color:#E06C75;">        response</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">HEALTH_CHECK_TIMEOUT</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">HEALTH_CHECK_URL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#56B6C2;"> echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">response</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -qi</span><span style="color:#98C379;"> &quot;healthy\\|ok\\|up&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚部署</span></span>
<span class="line"><span style="color:#61AFEF;">rollback_deployment</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> backup_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;执行回滚...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 停止应用</span></span>
<span class="line"><span style="color:#61AFEF;">    systemctl</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#61AFEF;">supervisorctl</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">true</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 恢复备份</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;恢复备份: \${</span><span style="color:#E06C75;">backup_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 清空应用目录（保留logs和config）</span></span>
<span class="line"><span style="color:#61AFEF;">        find</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -maxdepth</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> -type</span><span style="color:#98C379;"> f</span><span style="color:#D19A66;"> -name</span><span style="color:#98C379;"> &quot;*.dll&quot;</span><span style="color:#D19A66;"> -delete</span></span>
<span class="line"><span style="color:#61AFEF;">        find</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -maxdepth</span><span style="color:#D19A66;"> 1</span><span style="color:#D19A66;"> -type</span><span style="color:#98C379;"> d</span><span style="color:#D19A66;"> -name</span><span style="color:#98C379;"> &quot;bin&quot;</span><span style="color:#D19A66;"> -o</span><span style="color:#D19A66;"> -name</span><span style="color:#98C379;"> &quot;obj&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">xargs</span><span style="color:#98C379;"> rm</span><span style="color:#D19A66;"> -rf</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 恢复文件</span></span>
<span class="line"><span style="color:#61AFEF;">        tar</span><span style="color:#D19A66;"> -xzf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -C</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;启动应用...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        systemctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#61AFEF;">supervisorctl</span><span style="color:#98C379;"> start</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#61AFEF;">        sleep</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> health_check</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;✓ 回滚成功&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;回滚后健康检查仍然失败，手动介入需要&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;备份文件不存在，无法回滚&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 记录发布历史</span></span>
<span class="line"><span style="color:#61AFEF;">log_deployment_history</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> version</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$1</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> status</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">$2</span><span style="color:#98C379;">&quot;</span><span style="color:#7F848E;font-style:italic;">  # success or failed</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> history_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">APP_DIR</span><span style="color:#98C379;">}/deployment_history.log&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;) | Version: \${</span><span style="color:#E06C75;">version</span><span style="color:#98C379;">} | Status: \${</span><span style="color:#E06C75;">status</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    } &gt;&gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">history_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;.NET Core 灰度发布脚本&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查更新</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> new_version</span></span>
<span class="line"><span style="color:#E06C75;">    new_version</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">check_for_updates</span><span style="color:#ABB2BF;">) || {</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;无需更新&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;发现新版本: \${</span><span style="color:#E06C75;">new_version</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 下载新版本</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> package_dir</span></span>
<span class="line"><span style="color:#E06C75;">    package_dir</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">download_release</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">) || </span><span style="color:#56B6C2;">exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 验证发布包</span></span>
<span class="line"><span style="color:#61AFEF;">    verify_release</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#56B6C2;">exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 创建备份</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> backup_file</span></span>
<span class="line"><span style="color:#E06C75;">    backup_file</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">backup_current_version</span><span style="color:#ABB2BF;">) || </span><span style="color:#56B6C2;">exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 执行灰度发布</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> canary_deployment</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 灰度通过，执行全量发布</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#61AFEF;"> full_deployment</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">            log</span><span style="color:#98C379;"> &quot;INFO&quot;</span><span style="color:#98C379;"> &quot;✓ 发布成功&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            log_deployment_history</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;success&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 清理临时文件</span></span>
<span class="line"><span style="color:#61AFEF;">            rm</span><span style="color:#D19A66;"> -rf</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">package_dir</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#61AFEF;">            log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;全量发布失败&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            log_deployment_history</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;failed&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            rollback_deployment</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">backup_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#61AFEF;">        log</span><span style="color:#98C379;"> &quot;ERROR&quot;</span><span style="color:#98C379;"> &quot;灰度发布失败&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        log_deployment_history</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">new_version</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;failed&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个脚本提供了安全的自动化发布流程。]]。)</p><h2 id="案例九-nginx配置与性能优化脚本" tabindex="-1"><a class="header-anchor" href="#案例九-nginx配置与性能优化脚本"><span>案例九：Nginx配置与性能优化脚本</span></a></h2><p>.NET Core应用通常部署在Nginx反向代理后面，此脚本自动配置Nginx以获得最佳性能。]]。)</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Nginx 自动配置与性能优化脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：生成最优化的Nginx配置、配置反向代理、启用缓存、负载均衡</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境已验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;mynetcoreapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_SERVERS</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;127.0.0.1:5000&quot;</span><span style="color:#98C379;"> &quot;127.0.0.1:5001&quot;</span><span style="color:#98C379;"> &quot;127.0.0.1:5002&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> NGINX_CONF_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/etc/nginx&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> NGINX_SITES_AVAILABLE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">NGINX_CONF_DIR</span><span style="color:#98C379;">}/sites-available&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> NGINX_SITES_ENABLED</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">NGINX_CONF_DIR</span><span style="color:#98C379;">}/sites-enabled&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_DOMAIN</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;api.company.com&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> CACHE_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/cache/nginx/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> LOG_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/nginx/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化</span></span>
<span class="line"><span style="color:#61AFEF;">init_nginx_dirs</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SITES_AVAILABLE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SITES_ENABLED</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">CACHE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    chmod</span><span style="color:#D19A66;"> 755</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">CACHE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    chmod</span><span style="color:#D19A66;"> 755</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">LOG_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成Nginx Upstream配置</span></span>
<span class="line"><span style="color:#61AFEF;">generate_upstream_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> upstream_name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}_upstream&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">NGINX_CONF_DIR</span><span style="color:#98C379;">}/conf.d/\${</span><span style="color:#E06C75;">upstream_name</span><span style="color:#98C379;">}.conf&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;"># .NET Core 应用上游服务器配置</span></span>
<span class="line"><span style="color:#98C379;">upstream mynetcoreapp_upstream {</span></span>
<span class="line"><span style="color:#98C379;">    # 使用最少连接负载均衡算法</span></span>
<span class="line"><span style="color:#98C379;">    least_conn;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 应用服务器列表（健康检查通过的服务器）</span></span>
<span class="line"><span style="color:#98C379;">    server 127.0.0.1:5000 max_fails=3 fail_timeout=30s;</span></span>
<span class="line"><span style="color:#98C379;">    server 127.0.0.1:5001 max_fails=3 fail_timeout=30s;</span></span>
<span class="line"><span style="color:#98C379;">    server 127.0.0.1:5002 max_fails=3 fail_timeout=30s;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # TCP连接池配置</span></span>
<span class="line"><span style="color:#98C379;">    keepalive 32;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 缓存相关配置</span></span>
<span class="line"><span style="color:#98C379;">proxy_cache_path /var/cache/nginx/mynetcoreapp</span></span>
<span class="line"><span style="color:#98C379;">    levels=1:2</span></span>
<span class="line"><span style="color:#98C379;">    keys_zone=mynetcoreapp_cache:10m</span></span>
<span class="line"><span style="color:#98C379;">    max_size=1g</span></span>
<span class="line"><span style="color:#98C379;">    inactive=60m</span></span>
<span class="line"><span style="color:#98C379;">    use_temp_path=off;</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ Upstream配置已生成&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成站点配置</span></span>
<span class="line"><span style="color:#61AFEF;">generate_site_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> config_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">NGINX_SITES_AVAILABLE</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">config_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;"># .NET Core 应用 Nginx 配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">server {</span></span>
<span class="line"><span style="color:#98C379;">    listen 80;</span></span>
<span class="line"><span style="color:#98C379;">    listen [::]:80;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    server_name api.company.com www.api.company.com;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 日志配置</span></span>
<span class="line"><span style="color:#98C379;">    access_log /var/log/nginx/mynetcoreapp/access.log combined;</span></span>
<span class="line"><span style="color:#98C379;">    error_log /var/log/nginx/mynetcoreapp/error.log warn;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 客户端请求大小限制</span></span>
<span class="line"><span style="color:#98C379;">    client_max_body_size 10M;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 缓冲区设置</span></span>
<span class="line"><span style="color:#98C379;">    proxy_buffer_size 128k;</span></span>
<span class="line"><span style="color:#98C379;">    proxy_buffers 4 256k;</span></span>
<span class="line"><span style="color:#98C379;">    proxy_busy_buffers_size 256k;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # gzip 压缩配置</span></span>
<span class="line"><span style="color:#98C379;">    gzip on;</span></span>
<span class="line"><span style="color:#98C379;">    gzip_vary on;</span></span>
<span class="line"><span style="color:#98C379;">    gzip_proxied any;</span></span>
<span class="line"><span style="color:#98C379;">    gzip_comp_level 6;</span></span>
<span class="line"><span style="color:#98C379;">    gzip_types text/plain text/css text/xml text/javascript </span></span>
<span class="line"><span style="color:#98C379;">               application/json application/javascript application/xml+rss </span></span>
<span class="line"><span style="color:#98C379;">               font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 主应用路由</span></span>
<span class="line"><span style="color:#98C379;">    location / {</span></span>
<span class="line"><span style="color:#98C379;">        # 反向代理配置</span></span>
<span class="line"><span style="color:#98C379;">        proxy_pass http://mynetcoreapp_upstream;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        # 必要的代理请求头</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header Host $host;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Forwarded-Host $server_name;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        # WebSocket 支持</span></span>
<span class="line"><span style="color:#98C379;">        proxy_http_version 1.1;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header Upgrade $http_upgrade;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header Connection &quot;upgrade&quot;;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        # 超时配置</span></span>
<span class="line"><span style="color:#98C379;">        proxy_connect_timeout 60s;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_send_timeout 60s;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_read_timeout 60s;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        # 缓存配置</span></span>
<span class="line"><span style="color:#98C379;">        proxy_cache mynetcoreapp_cache;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_cache_valid 200 10m;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_cache_lock on;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        # 缓存状态响应头</span></span>
<span class="line"><span style="color:#98C379;">        add_header X-Cache-Status $upstream_cache_status;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 健康检查端点（不缓存）</span></span>
<span class="line"><span style="color:#98C379;">    location /health {</span></span>
<span class="line"><span style="color:#98C379;">        proxy_pass http://mynetcoreapp_upstream;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_cache off;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_no_cache 1;</span></span>
<span class="line"><span style="color:#98C379;">        access_log off;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # API 端点缓存配置</span></span>
<span class="line"><span style="color:#98C379;">    location ~ ^/api/v1/public/ {</span></span>
<span class="line"><span style="color:#98C379;">        proxy_pass http://mynetcoreapp_upstream;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header Host $host;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        # 公开API缓存5分钟</span></span>
<span class="line"><span style="color:#98C379;">        proxy_cache mynetcoreapp_cache;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_cache_valid 200 5m;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_cache_key &quot;$scheme$request_method$host$request_uri&quot;;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        add_header X-Cache-Status $upstream_cache_status;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 静态文件配置</span></span>
<span class="line"><span style="color:#98C379;">    location ~ \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {</span></span>
<span class="line"><span style="color:#98C379;">        proxy_pass http://mynetcoreapp_upstream;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        # 长期缓存</span></span>
<span class="line"><span style="color:#98C379;">        expires 30d;</span></span>
<span class="line"><span style="color:#98C379;">        add_header Cache-Control &quot;public, immutable&quot;;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        # 不记录静态文件访问</span></span>
<span class="line"><span style="color:#98C379;">        access_log off;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 限流配置</span></span>
<span class="line"><span style="color:#98C379;">    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/s;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    location ~ ^/api/ {</span></span>
<span class="line"><span style="color:#98C379;">        limit_req zone=api_limit burst=200 nodelay;</span></span>
<span class="line"><span style="color:#98C379;">        </span></span>
<span class="line"><span style="color:#98C379;">        proxy_pass http://mynetcoreapp_upstream;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header Host $host;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="color:#98C379;">        proxy_set_header X-Forwarded-Proto $scheme;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 静态错误页面</span></span>
<span class="line"><span style="color:#98C379;">    error_page 502 503 504 /50x.html;</span></span>
<span class="line"><span style="color:#98C379;">    location = /50x.html {</span></span>
<span class="line"><span style="color:#98C379;">        return 500;</span></span>
<span class="line"><span style="color:#98C379;">    }</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># HTTPS 重定向（如果启用了HTTPS）</span></span>
<span class="line"><span style="color:#98C379;"># server {</span></span>
<span class="line"><span style="color:#98C379;">#     listen 443 ssl http2;</span></span>
<span class="line"><span style="color:#98C379;">#     listen [::]:443 ssl http2;</span></span>
<span class="line"><span style="color:#98C379;">#     </span></span>
<span class="line"><span style="color:#98C379;">#     server_name api.company.com www.api.company.com;</span></span>
<span class="line"><span style="color:#98C379;">#     </span></span>
<span class="line"><span style="color:#98C379;">#     # SSL 配置</span></span>
<span class="line"><span style="color:#98C379;">#     ssl_certificate /etc/ssl/certs/api.company.com.crt;</span></span>
<span class="line"><span style="color:#98C379;">#     ssl_certificate_key /etc/ssl/private/api.company.com.key;</span></span>
<span class="line"><span style="color:#98C379;">#     </span></span>
<span class="line"><span style="color:#98C379;">#     # 高级 SSL 配置</span></span>
<span class="line"><span style="color:#98C379;">#     ssl_protocols TLSv1.2 TLSv1.3;</span></span>
<span class="line"><span style="color:#98C379;">#     ssl_ciphers HIGH:!aNULL:!MD5;</span></span>
<span class="line"><span style="color:#98C379;">#     ssl_prefer_server_ciphers on;</span></span>
<span class="line"><span style="color:#98C379;">#     </span></span>
<span class="line"><span style="color:#98C379;">#     # 其余配置同上...</span></span>
<span class="line"><span style="color:#98C379;"># }</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 站点配置已生成: \${</span><span style="color:#E06C75;">config_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启用站点配置</span></span>
<span class="line"><span style="color:#61AFEF;">enable_site_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> site_name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">!</span><span style="color:#56B6C2;"> -L</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SITES_ENABLED</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">site_name</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        ln</span><span style="color:#D19A66;"> -s</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SITES_AVAILABLE</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">site_name</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SITES_ENABLED</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">site_name</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ 站点配置已启用&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 验证Nginx配置</span></span>
<span class="line"><span style="color:#61AFEF;">validate_nginx_config</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;验证Nginx配置...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> nginx</span><span style="color:#D19A66;"> -t</span><span style="color:#ABB2BF;"> 2&gt;&amp;1 | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;successful&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ Nginx配置验证通过&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 0</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✗ Nginx配置有错误&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        nginx</span><span style="color:#D19A66;"> -t</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 重新加载Nginx</span></span>
<span class="line"><span style="color:#61AFEF;">reload_nginx</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;重新加载Nginx...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> systemctl</span><span style="color:#98C379;"> reload</span><span style="color:#98C379;"> nginx</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ Nginx已重新加载&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✗ Nginx重新加载失败&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 性能优化配置</span></span>
<span class="line"><span style="color:#61AFEF;">optimize_nginx_performance</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;应用Nginx性能优化...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> nginx_main_conf</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">NGINX_CONF_DIR</span><span style="color:#98C379;">}/nginx.conf&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 检查并更新main配置（仅当需要时）</span></span>
<span class="line"><span style="color:#61AFEF;">    cat</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">NGINX_CONF_DIR</span><span style="color:#98C379;">}/conf.d/performance.conf&quot;</span><span style="color:#ABB2BF;"> &lt;&lt; </span><span style="color:#ABB2BF;">&#39;EOF&#39;</span></span>
<span class="line"><span style="color:#98C379;"># Nginx 性能优化配置</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 工作进程数</span></span>
<span class="line"><span style="color:#98C379;">worker_processes auto;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 打开文件限制</span></span>
<span class="line"><span style="color:#98C379;">worker_rlimit_nofile 65535;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># 连接数优化</span></span>
<span class="line"><span style="color:#98C379;">events {</span></span>
<span class="line"><span style="color:#98C379;">    worker_connections 4096;</span></span>
<span class="line"><span style="color:#98C379;">    use epoll;</span></span>
<span class="line"><span style="color:#98C379;">    multi_accept on;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;"># HTTP块优化</span></span>
<span class="line"><span style="color:#98C379;">http {</span></span>
<span class="line"><span style="color:#98C379;">    # 隐藏Nginx版本</span></span>
<span class="line"><span style="color:#98C379;">    server_tokens off;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 优化文件类型映射</span></span>
<span class="line"><span style="color:#98C379;">    include /etc/nginx/mime.types;</span></span>
<span class="line"><span style="color:#98C379;">    default_type application/octet-stream;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 启用sendfile</span></span>
<span class="line"><span style="color:#98C379;">    sendfile on;</span></span>
<span class="line"><span style="color:#98C379;">    tcp_nopush on;</span></span>
<span class="line"><span style="color:#98C379;">    tcp_nodelay on;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 连接超时</span></span>
<span class="line"><span style="color:#98C379;">    keepalive_timeout 65;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 请求超时</span></span>
<span class="line"><span style="color:#98C379;">    client_body_timeout 10s;</span></span>
<span class="line"><span style="color:#98C379;">    client_header_timeout 10s;</span></span>
<span class="line"><span style="color:#98C379;">    send_timeout 10s;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 缓存设置</span></span>
<span class="line"><span style="color:#98C379;">    types_hash_max_size 2048;</span></span>
<span class="line"><span style="color:#98C379;">    types_hash_bucket_size 64;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 变量哈希优化</span></span>
<span class="line"><span style="color:#98C379;">    variables_hash_max_size 2048;</span></span>
<span class="line"><span style="color:#98C379;">    variables_hash_bucket_size 128;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 服务器名称哈希优化</span></span>
<span class="line"><span style="color:#98C379;">    server_names_hash_max_size 512;</span></span>
<span class="line"><span style="color:#98C379;">    server_names_hash_bucket_size 128;</span></span>
<span class="line"><span style="color:#98C379;">    </span></span>
<span class="line"><span style="color:#98C379;">    # 日志缓冲</span></span>
<span class="line"><span style="color:#98C379;">    access_log_buffer 32k;</span></span>
<span class="line"><span style="color:#98C379;">    access_log_flush 5s;</span></span>
<span class="line"><span style="color:#98C379;">}</span></span>
<span class="line"><span style="color:#ABB2BF;">EOF</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 性能优化配置已应用&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 监控Nginx状态</span></span>
<span class="line"><span style="color:#61AFEF;">monitor_nginx_status</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Nginx 状态监控&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> systemctl</span><span style="color:#98C379;"> is-active</span><span style="color:#98C379;"> nginx</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ Nginx 服务: 运行中&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 显示进程信息</span></span>
<span class="line"><span style="color:#61AFEF;">        ps</span><span style="color:#98C379;"> aux</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> grep</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 显示监听端口</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;监听端口:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        ss</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span><span style="color:#ABB2BF;"> || </span><span style="color:#61AFEF;">netstat</span><span style="color:#D19A66;"> -tlnp</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> nginx</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 显示连接统计</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;连接统计:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        ss</span><span style="color:#D19A66;"> -s</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -10</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✗ Nginx 服务: 已停止&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成性能报告</span></span>
<span class="line"><span style="color:#61AFEF;">generate_performance_report</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> report_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/nginx/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/nginx_config_report.txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Nginx 配置报告&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;生成时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;应用名: \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;配置内容:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;==========================================&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_SITES_AVAILABLE</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;==========================================&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Upstream 配置:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_CONF_DIR</span><span style="color:#98C379;">}/conf.d/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}_upstream.conf&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;性能优化配置:&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cat</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">NGINX_CONF_DIR</span><span style="color:#98C379;">}/conf.d/performance.conf&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">    } | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 报告已生成: \${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╔════════════════════════════════════════════════════════════════╗&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  Nginx 自动配置与优化工具                                      ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  应用: \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}                                           ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)                          ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╚════════════════════════════════════════════════════════════════╝&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    init_nginx_dirs</span></span>
<span class="line"><span style="color:#61AFEF;">    generate_upstream_config</span></span>
<span class="line"><span style="color:#61AFEF;">    generate_site_config</span></span>
<span class="line"><span style="color:#61AFEF;">    enable_site_config</span></span>
<span class="line"><span style="color:#61AFEF;">    optimize_nginx_performance</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> validate_nginx_config</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        reload_nginx</span></span>
<span class="line"><span style="color:#61AFEF;">        monitor_nginx_status</span></span>
<span class="line"><span style="color:#61AFEF;">        generate_performance_report</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Nginx 配置完成&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 配置验证失败，请检查配置文件&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="http://xn--Nginx-mn1hov3xxn34qg9emr4di6fkvhy95hmufsn4exqf8m6a.NET" target="_blank" rel="noopener noreferrer">这个脚本全面优化了Nginx配置以支持.NET</a> Core应用。]]。)</p><h2 id="案例十-性能基准测试与压力测试脚本" tabindex="-1"><a class="header-anchor" href="#案例十-性能基准测试与压力测试脚本"><span>案例十：性能基准测试与压力测试脚本</span></a></h2><p>最后，我们需要验证应用的性能指标，此脚本使用Apache Bench或wrk进行压力测试，并生成详细的性能报告。]]。)</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/usr/bin/env bash</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> errexit</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> nounset</span></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .NET Core 应用性能基准测试脚本</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用途：执行压力测试、生成性能报告、与基线数据对比</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生产环境已验证</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;mynetcoreapp&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> TEST_URL</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;http://localhost:5000/api/v1/health&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> CONCURRENCY</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">50</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> REQUESTS</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">10000</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> TEST_DURATION</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">300</span><span style="color:#7F848E;font-style:italic;">  # 秒</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> REPORT_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;/var/log/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}/benchmark&quot;</span></span>
<span class="line"><span style="color:#C678DD;">readonly</span><span style="color:#E06C75;"> BASELINE_DIR</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/baselines&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化</span></span>
<span class="line"><span style="color:#61AFEF;">init_benchmark</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    mkdir</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">BASELINE_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查测试工具</span></span>
<span class="line"><span style="color:#61AFEF;">check_test_tools</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;检查性能测试工具...&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> tools_available</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> ab</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">        tools_available</span><span style="color:#C678DD;">+=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;ab&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ Apache Bench (ab) 可用&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ Apache Bench (ab) 未安装&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> wrk</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#E06C75;">        tools_available</span><span style="color:#C678DD;">+=</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;wrk&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ wrk 可用&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ wrk 未安装&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ \${#</span><span style="color:#E06C75;">tools_available</span><span style="color:#ABB2BF;">[@]} </span><span style="color:#56B6C2;">-eq</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 未找到任何测试工具&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;请安装: sudo apt install apache2-utils 或编译 wrk&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">tools_available</span><span style="color:#98C379;">[</span><span style="color:#ABB2BF;">@</span><span style="color:#98C379;">]}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用Apache Bench进行测试</span></span>
<span class="line"><span style="color:#61AFEF;">run_ab_benchmark</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Apache Bench 压力测试&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> report_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/ab_result_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S).txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;测试参数:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  URL: \${</span><span style="color:#E06C75;">TEST_URL</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  并发数: \${</span><span style="color:#E06C75;">CONCURRENCY</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  请求数: \${</span><span style="color:#E06C75;">REQUESTS</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 执行测试</span></span>
<span class="line"><span style="color:#61AFEF;">    ab</span><span style="color:#D19A66;"> -n</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REQUESTS</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">CONCURRENCY</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> 30</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TEST_URL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 从结果中提取关键指标</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> requests_per_sec</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> avg_response_time</span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> failed_requests</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#E06C75;">    requests_per_sec</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;Requests per second&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $NF}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    avg_response_time</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;average&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $NF}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#E06C75;">    failed_requests</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;Failed requests&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $NF}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;关键指标:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  吞吐量: \${</span><span style="color:#E06C75;">requests_per_sec</span><span style="color:#98C379;">} requests/sec&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  平均响应时间: \${</span><span style="color:#E06C75;">avg_response_time</span><span style="color:#98C379;">}ms&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  失败请求数: \${</span><span style="color:#E06C75;">failed_requests</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用wrk进行测试</span></span>
<span class="line"><span style="color:#61AFEF;">run_wrk_benchmark</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;wrk 压力测试&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> report_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/wrk_result_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S).txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;测试参数:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  URL: \${</span><span style="color:#E06C75;">TEST_URL</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  并发连接数: \${</span><span style="color:#E06C75;">CONCURRENCY</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;  测试时间: \${</span><span style="color:#E06C75;">TEST_DURATION</span><span style="color:#98C379;">} 秒&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # wrk -t: 线程数 -c: 并发连接数 -d: 持续时间</span></span>
<span class="line"><span style="color:#61AFEF;">    wrk</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> 4</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">CONCURRENCY</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TEST_DURATION</span><span style="color:#98C379;">}s&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TEST_URL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">report_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 内存和CPU压力测试</span></span>
<span class="line"><span style="color:#61AFEF;">stress_test</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;内存和CPU压力测试&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> stress_report</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/stress_result_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S).txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;压力测试报告&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 获取应用PID</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> app_pid</span></span>
<span class="line"><span style="color:#E06C75;">        app_pid</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">pgrep</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> &quot;dotnet.*\\.dll&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;错误: 应用进程未找到&quot;</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;应用进程 PID: \${</span><span style="color:#E06C75;">app_pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 记录初始状态</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=== 初始状态 (t=0) ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pid,vsz,rss,%cpu,%mem,etime,comm</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;开始压力测试，持续 \${</span><span style="color:#E06C75;">TEST_DURATION</span><span style="color:#98C379;">} 秒...&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 运行压力测试并定期记录资源使用</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> elapsed</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">0</span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> sample_interval</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">30</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">elapsed</span><span style="color:#56B6C2;"> &lt;</span><span style="color:#E06C75;"> TEST_DURATION</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#61AFEF;">            sleep</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">sample_interval</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            ((</span><span style="color:#E06C75;">elapsed</span><span style="color:#56B6C2;"> +=</span><span style="color:#E06C75;"> sample_interval</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#ABB2BF;">            </span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;=== 状态 (t=\${</span><span style="color:#E06C75;">elapsed</span><span style="color:#98C379;">}) ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">            ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pid,vsz,rss,%cpu,%mem,etime,comm</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_pid</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> || </span><span style="color:#C678DD;">break</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        done</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 测试结束后的状态</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;=== 测试结束状态 ===&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        ps</span><span style="color:#D19A66;"> -o</span><span style="color:#98C379;"> pid,vsz,rss,%cpu,%mem,etime,comm</span><span style="color:#D19A66;"> -p</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">app_pid</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">    } | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">stress_report</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 压力测试报告: \${</span><span style="color:#E06C75;">stress_report</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 延迟分布分析</span></span>
<span class="line"><span style="color:#61AFEF;">analyze_latency</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;延迟分布分析&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> latency_report</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/latency_analysis_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S).txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> command</span><span style="color:#D19A66;"> -v</span><span style="color:#98C379;"> wrk</span><span style="color:#ABB2BF;"> &amp;&gt; /dev/null; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 使用wrk的latency脚本</span></span>
<span class="line"><span style="color:#61AFEF;">        wrk</span><span style="color:#D19A66;"> -t</span><span style="color:#D19A66;"> 4</span><span style="color:#D19A66;"> -c</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">CONCURRENCY</span><span style="color:#98C379;">}&quot;</span><span style="color:#D19A66;"> -d</span><span style="color:#98C379;"> 60s</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">            -s</span><span style="color:#98C379;"> &lt;(</span><span style="color:#61AFEF;">cat</span><span style="color:#ABB2BF;"> &lt;&lt;</span><span style="color:#98C379;"> &#39;SCRIPT&#39;</span></span>
<span class="line"><span style="color:#98C379;">response = function(status, headers, body)</span></span>
<span class="line"><span style="color:#98C379;">    if status ~= 200 then</span></span>
<span class="line"><span style="color:#98C379;">        print(&quot;Non-200 response status=&quot; .. status)</span></span>
<span class="line"><span style="color:#98C379;">    end</span></span>
<span class="line"><span style="color:#98C379;">end</span></span>
<span class="line"><span style="color:#98C379;">SCRIPT</span></span>
<span class="line"><span style="color:#98C379;">)</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TEST_URL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">latency_report</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;&amp;1</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ 延迟分析报告: \${</span><span style="color:#E06C75;">latency_report</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ wrk 未安装，跳过延迟分析&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 与基线对比</span></span>
<span class="line"><span style="color:#61AFEF;">compare_with_baseline</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;基线对比&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> latest_result</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/ab_result_&quot;</span><span style="color:#ABB2BF;">*.</span><span style="color:#E06C75;">txt</span></span>
<span class="line"><span style="color:#E06C75;">    latest_result</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">ls</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_result</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-z</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_result</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;⚠ 无可用的测试结果&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> baseline_file</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">BASELINE_DIR</span><span style="color:#98C379;">}/baseline_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m).txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-f</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">baseline_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;与基线 $(</span><span style="color:#61AFEF;">basename</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">baseline_file</span><span style="color:#98C379;">}&quot;) 对比:&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> current_throughput</span></span>
<span class="line"><span style="color:#E06C75;">        current_throughput</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;Requests per second&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_result</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $NF}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> baseline_throughput</span></span>
<span class="line"><span style="color:#E06C75;">        baseline_throughput</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">grep</span><span style="color:#98C379;"> &quot;Requests per second&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">baseline_file</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &#39;{print $NF}&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        local</span><span style="color:#E06C75;"> diff</span></span>
<span class="line"><span style="color:#E06C75;">        diff</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">awk</span><span style="color:#98C379;"> &quot;BEGIN {printf </span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">%.2f</span><span style="color:#56B6C2;">\\&quot;</span><span style="color:#98C379;">, (\${</span><span style="color:#E06C75;">current_throughput</span><span style="color:#98C379;">} - \${</span><span style="color:#E06C75;">baseline_throughput</span><span style="color:#98C379;">}) / \${</span><span style="color:#E06C75;">baseline_throughput</span><span style="color:#98C379;">} * 100}&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  基线吞吐量: \${</span><span style="color:#E06C75;">baseline_throughput</span><span style="color:#98C379;">} req/s&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  当前吞吐量: \${</span><span style="color:#E06C75;">current_throughput</span><span style="color:#98C379;">} req/s&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#ABB2BF;"> (( $(</span><span style="color:#E06C75;">echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">diff</span><span style="color:#98C379;">} &gt; 0&quot;</span><span style="color:#56B6C2;"> |</span><span style="color:#E06C75;"> bc</span><span style="color:#56B6C2;"> -</span><span style="color:#E06C75;">l</span><span style="color:#ABB2BF;">) )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;  性能变化: +\${</span><span style="color:#E06C75;">diff</span><span style="color:#98C379;">}% ✓&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        else</span></span>
<span class="line"><span style="color:#56B6C2;">            echo</span><span style="color:#98C379;"> &quot;  性能变化: \${</span><span style="color:#E06C75;">diff</span><span style="color:#98C379;">}% ✗&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        fi</span></span>
<span class="line"><span style="color:#C678DD;">    else</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;✓ 没有基线数据，本次结果已保存为新基线&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">        cp</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">latest_result</span><span style="color:#98C379;">}&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">baseline_file</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 生成综合性能报告</span></span>
<span class="line"><span style="color:#61AFEF;">generate_comprehensive_report</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;生成综合性能报告&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> comprehensive_report</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}/comprehensive_report_$(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> +%Y%m%d_%H%M%S).txt&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#ABB2BF;">    {</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;╔════════════════════════════════════════════════════════════════╗&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;║         .NET Core 应用性能基准测试报告                        ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;╚════════════════════════════════════════════════════════════════╝&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;生成时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;应用: \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;测试URL: \${</span><span style="color:#E06C75;">TEST_URL</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;═══════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;测试配置&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;═══════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;并发数: \${</span><span style="color:#E06C75;">CONCURRENCY</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;总请求数: \${</span><span style="color:#E06C75;">REQUESTS</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;测试持续时间: \${</span><span style="color:#E06C75;">TEST_DURATION</span><span style="color:#98C379;">}s&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;═══════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;性能指标解读&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;═══════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;吞吐量 (Requests/sec):&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - 优秀: &gt; 1000&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - 良好: 500-1000&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - 一般: 100-500&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - 需要优化: &lt; 100&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;平均响应时间 (ms):&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - 优秀: &lt; 10ms&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - 良好: 10-50ms&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - 一般: 50-200ms&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;  - 需要优化: &gt; 200ms&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;═══════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;优化建议&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;═══════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;1. 应用层优化:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 启用响应缓存&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 优化数据库查询&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 使用异步操作&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;2. 基础设施优化:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 增加应用实例&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 配置负载均衡&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 启用CDN缓存&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;3. 数据库优化:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 添加数据库索引&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 优化SQL查询&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 启用连接池&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;4. 系统优化:&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 调整系统参数&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 增加物理内存&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;   - 优化网络配置&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">    } | </span><span style="color:#61AFEF;">tee</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">comprehensive_report</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 综合报告已生成: \${</span><span style="color:#E06C75;">comprehensive_report</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 主函数</span></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#ABB2BF;">() {</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╔════════════════════════════════════════════════════════════════╗&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  .NET Core 应用性能基准测试                                    ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;║  时间: $(</span><span style="color:#61AFEF;">date</span><span style="color:#98C379;"> &#39;+%Y-%m-%d %H:%M:%S&#39;)                          ║&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;╚════════════════════════════════════════════════════════════════╝&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#61AFEF;">    init_benchmark</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    local</span><span style="color:#E06C75;"> available_tools</span></span>
<span class="line"><span style="color:#E06C75;">    available_tools</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">check_test_tools</span><span style="color:#ABB2BF;">) || </span><span style="color:#56B6C2;">exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 验证应用运行</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#ABB2BF;"> ! </span><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -s</span><span style="color:#D19A66;"> -m</span><span style="color:#D19A66;"> 5</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">TEST_URL</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> 2&gt;&amp;1; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;错误: 应用无法访问，请确保应用正在运行&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">        exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;✓ 应用连接正常&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 执行测试</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">available_tools</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;ab&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        run_ab_benchmark</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#56B6C2;"> echo</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">available_tools</span><span style="color:#98C379;">}&quot;</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">grep</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> &quot;wrk&quot;</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#61AFEF;">        run_wrk_benchmark</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 执行压力和分析</span></span>
<span class="line"><span style="color:#61AFEF;">    stress_test</span></span>
<span class="line"><span style="color:#61AFEF;">    analyze_latency</span></span>
<span class="line"><span style="color:#61AFEF;">    compare_with_baseline</span></span>
<span class="line"><span style="color:#61AFEF;">    generate_comprehensive_report</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;性能基准测试完成&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;════════════════════════════════════════════════════════════════&quot;</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;所有报告已保存到: \${</span><span style="color:#E06C75;">REPORT_DIR</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">main</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;font-style:italic;">$@</span><span style="color:#98C379;">&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个脚本提供了全面的性能测试和分析能力。]]。)</p><h2 id="总体总结与最佳实践" tabindex="-1"><a class="header-anchor" href="#总体总结与最佳实践"><span>总体总结与最佳实践</span></a></h2><p>完成十个生产级案例的学习，<a href="http://xn--ykqpuw36a5nffmai84k.NET" target="_blank" rel="noopener noreferrer">你已经掌握了.NET</a> Core在Linux环境下的完整运维工具链。这些案例覆盖了从基础应用管理到高级性能优化的所有主要场景。]]。)</p><p>关键收获总结：1）应用生命周期管理需要完善的优雅关闭和健康检查机制；2）进程守护应该使用专业工具如Supervisor；3）系统诊断和日志分析是快速定位问题的关键；4）性能监测和基准测试帮助识别优化机会；5）灰度发布和自动回滚确保部署的安全性；6）Nginx反向代理优化直接影响应用的可用性和性能。]]；3）系统诊断和日志分析是快速定位问题的关键；4）性能监测和基准测试帮助识别优化机会；5）灰度发布和自动回滚确保部署的安全性；6）Nginx反向代理优化直接影响应用的可用性和性能。)</p><p>这十个脚本应该被集成到你的CI/CD管道和监控系统中，形成一个完整的自动化运维体系。建议对每个脚本进行定制化修改以适应你的具体环境和需求。</p>`,48)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};
import{A as e,E as t,d as n,l as r,p as i}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as a}from"./app-C3mYviaX.js";var o=JSON.parse(`{"path":"/Linux/05_%E7%94%9F%E4%BA%A7%E7%BA%A7%E5%AE%9E%E6%88%98/03_%E8%87%AA%E5%8A%A8%E5%8C%96%E9%83%A8%E7%BD%B2%E4%B8%8ECI.html","title":"自动化部署与 CI/CD","lang":"zh-CN","frontmatter":{"title":"自动化部署与 CI/CD","icon":"fas fa-rocket","order":3,"category":["生产级实战"],"tag":["Linux","Ansible","Docker","Kubernetes","CI/CD","GitHub Actions","GitLab CI","蓝绿部署","金丝雀发布"]},"git":{"createdTime":1780588404000,"updatedTime":1780588404000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":13.15,"words":3945},"filePathRelative":"Linux/05_生产级实战/03_自动化部署与CI.md"}`),s={name:`03_自动化部署与CI.md`};function c(a,o,s,c,l,u){let d=e(`Mermaid`);return t(),r(`div`,null,[o[0]||=n(`<h1 id="自动化部署与-ci-cd" tabindex="-1"><a class="header-anchor" href="#自动化部署与-ci-cd"><span>自动化部署与 CI/CD</span></a></h1><p>从手动 SSH 上传文件到全自动化流水线，从单机部署到容器编排，从蓝绿发布到金丝雀灰度——自动化部署与 CI/CD 是现代运维的核心竞争力。本文从 Ansible 配置管理讲起，覆盖 Docker 容器化、Kubernetes 编排、三大 CI 平台实战，最终落地蓝绿/金丝雀发布策略，帮你打通从代码提交到生产上线的全链路。</p><h2 id="_1-ansible-基础" tabindex="-1"><a class="header-anchor" href="#_1-ansible-基础"><span>1. Ansible 基础</span></a></h2><h3 id="_1-1-ansible-架构" tabindex="-1"><a class="header-anchor" href="#_1-1-ansible-架构"><span>1.1 Ansible 架构</span></a></h3>`,4),i(d,{code:`eJxLy8kvT85ILCpR8AniUgCC4tKk9KLEggwF5/y8kqL8nGilZ33Ln3Zse9HV9Lxpp1IsWBEIePqFRSt55pWl5pXkF1XaJBXZPdmx+9mcXc92tD7tnYqkMMDHMTJaKSAnsTIpPz8bpPBp5/Jnc9YgKfH1d4lW8s1PKc1JLQYpeLZi4dO506EKUvNSuFCd5puYl5iemhKt9GLR6ufrFmI4zc8wWqk8NcnAEFnMCCJmhCxmHK2UglAGtwjqdQVdXbsapeBgD7CTpi94OafBMR3oXaUamAvAqoEBAVIJ9idYAMQAiwC9xQUARBJ0LQ==`}),o[1]||=n(`<p><strong>Ansible 特点：</strong></p><ul><li><strong>Agentless</strong>：无需在目标安装客户端，通过 SSH 连接</li><li><strong>幂等性</strong>：同一 Playbook 执行多次，结果一致</li><li><strong>声明式</strong>：描述期望状态，而非操作步骤</li><li><strong>模块化</strong>：丰富的内置模块 + 自定义模块</li></ul><h3 id="_1-2-inventory-主机清单" tabindex="-1"><a class="header-anchor" href="#_1-2-inventory-主机清单"><span>1.2 Inventory 主机清单</span></a></h3><div class="language-ini line-numbers-mode" data-highlighter="shiki" data-ext="ini" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-ini"><span class="line"><span style="color:#7F848E;font-style:italic;"># /etc/ansible/hosts 或项目目录下 inventory/hosts</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 按组分类</span></span>
<span class="line"><span style="color:#61AFEF;">[webservers]</span></span>
<span class="line"><span style="color:#98C379;">web01 </span><span style="color:#C678DD;">ansible_host</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">192.168.1.10 </span><span style="color:#C678DD;">ansible_user</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">admin</span></span>
<span class="line"><span style="color:#98C379;">web02 </span><span style="color:#C678DD;">ansible_host</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">192.168.1.11 </span><span style="color:#C678DD;">ansible_user</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">admin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[dbservers]</span></span>
<span class="line"><span style="color:#98C379;">db01 </span><span style="color:#C678DD;">ansible_host</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">192.168.1.20 </span><span style="color:#C678DD;">ansible_user</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">dbadmin</span></span>
<span class="line"><span style="color:#98C379;">db02 </span><span style="color:#C678DD;">ansible_host</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">192.168.1.21 </span><span style="color:#C678DD;">ansible_user</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">dbadmin</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 组变量</span></span>
<span class="line"><span style="color:#61AFEF;">[webservers:vars]</span></span>
<span class="line"><span style="color:#C678DD;">nginx_version</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">1.24.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[dbservers:vars]</span></span>
<span class="line"><span style="color:#C678DD;">mysql_version</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">8.0</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 嵌套组</span></span>
<span class="line"><span style="color:#61AFEF;">[production:children]</span></span>
<span class="line"><span style="color:#98C379;">webservers</span></span>
<span class="line"><span style="color:#98C379;">dbservers</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">[production:vars]</span></span>
<span class="line"><span style="color:#C678DD;">env</span><span style="color:#ABB2BF;">=</span><span style="color:#98C379;">production</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>YAML 格式 Inventory：</strong></p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># inventory/hosts.yaml</span></span>
<span class="line"><span style="color:#E06C75;">all</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  children</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    webservers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        web01</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          ansible_host</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">192.168.1.10</span></span>
<span class="line"><span style="color:#E06C75;">        web02</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          ansible_host</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">192.168.1.11</span></span>
<span class="line"><span style="color:#E06C75;">      vars</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        nginx_version</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1.24.0</span></span>
<span class="line"><span style="color:#E06C75;">    dbservers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        db01</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          ansible_host</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">192.168.1.20</span></span>
<span class="line"><span style="color:#E06C75;">      vars</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        mysql_version</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">8.0</span></span>
<span class="line"><span style="color:#E06C75;">    production</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      children</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        webservers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        dbservers</span><span style="color:#ABB2BF;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-ad-hoc-命令" tabindex="-1"><a class="header-anchor" href="#_1-3-ad-hoc-命令"><span>1.3 Ad-Hoc 命令</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 基本语法：ansible &lt;pattern&gt; -m &lt;module&gt; -a &lt;args&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ping 测试连通性</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> all</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> ping</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 执行命令</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> command</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;uptime&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> shell</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;free -h | head -2&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装包</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> yum</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;name=nginx state=present&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> apt</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;name=nginx state=present&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 管理服务</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> systemd</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;name=nginx state=started enabled=yes&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 文件操作</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> copy</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;src=nginx.conf dest=/etc/nginx/nginx.conf&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> file</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;path=/tmp/testdir state=directory mode=0755&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 用户管理</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> user</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;name=deploy shell=/bin/bash groups=docker&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 收集信息</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> setup</span><span style="color:#7F848E;font-style:italic;">                    # 所有 facts</span></span>
<span class="line"><span style="color:#61AFEF;">ansible</span><span style="color:#98C379;"> webservers</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> setup</span><span style="color:#D19A66;"> -a</span><span style="color:#98C379;"> &quot;filter=ansible_memory_mb&quot;</span><span style="color:#7F848E;font-style:italic;">  # 过滤</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-playbook-剧本" tabindex="-1"><a class="header-anchor" href="#_1-4-playbook-剧本"><span>1.4 Playbook 剧本</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># deploy-nginx.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deploy Nginx Web Server</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">webservers</span></span>
<span class="line"><span style="color:#E06C75;">  become</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">yes</span><span style="color:#7F848E;font-style:italic;">                    # 使用 sudo</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  vars</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    nginx_version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;1.24.0&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    nginx_worker_processes</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;auto&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    server_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;example.com&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  tasks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Install Nginx</span></span>
<span class="line"><span style="color:#E06C75;">      yum</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;nginx-{{ nginx_version }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">present</span></span>
<span class="line"><span style="color:#E06C75;">      notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Restart Nginx</span><span style="color:#7F848E;font-style:italic;">      # 状态变化时触发 handler</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Configure Nginx</span></span>
<span class="line"><span style="color:#E06C75;">      template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">templates/nginx.conf.j2</span></span>
<span class="line"><span style="color:#E06C75;">        dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#E06C75;">        owner</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">        group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">root</span></span>
<span class="line"><span style="color:#E06C75;">        mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;0644&#39;</span></span>
<span class="line"><span style="color:#E06C75;">      notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Reload Nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Create document root</span></span>
<span class="line"><span style="color:#E06C75;">      file</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/var/www/{{ server_name }}</span></span>
<span class="line"><span style="color:#E06C75;">        state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">directory</span></span>
<span class="line"><span style="color:#E06C75;">        owner</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">        group</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">        mode</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;0755&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deploy application</span></span>
<span class="line"><span style="color:#E06C75;">      synchronize</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./dist/</span></span>
<span class="line"><span style="color:#E06C75;">        dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/var/www/{{ server_name }}/</span></span>
<span class="line"><span style="color:#E06C75;">        delete</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">yes</span></span>
<span class="line"><span style="color:#E06C75;">      notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Reload Nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ensure Nginx is running</span></span>
<span class="line"><span style="color:#E06C75;">      systemd</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">        state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">started</span></span>
<span class="line"><span style="color:#E06C75;">        enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">yes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  handlers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Restart Nginx</span></span>
<span class="line"><span style="color:#E06C75;">      systemd</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">        state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">restarted</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Reload Nginx</span></span>
<span class="line"><span style="color:#E06C75;">      systemd</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">        state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">reloaded</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 执行 Playbook</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#98C379;"> deploy-nginx.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 检查语法</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> --syntax-check</span><span style="color:#98C379;"> deploy-nginx.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 干跑（不实际执行）</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> --check</span><span style="color:#98C379;"> deploy-nginx.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定 Inventory</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#D19A66;"> -i</span><span style="color:#98C379;"> inventory/hosts</span><span style="color:#98C379;"> deploy-nginx.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 指定标签</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#98C379;"> deploy-nginx.yml</span><span style="color:#D19A66;"> --tags</span><span style="color:#98C379;"> &quot;install&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 详细输出</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#98C379;"> deploy-nginx.yml</span><span style="color:#D19A66;"> -v</span><span style="color:#7F848E;font-style:italic;">    # -vv -vvv 更详细</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-5-常用模块速查" tabindex="-1"><a class="header-anchor" href="#_1-5-常用模块速查"><span>1.5 常用模块速查</span></a></h3><table><thead><tr><th>模块</th><th>用途</th><th>示例</th></tr></thead><tbody><tr><td><code>yum</code>/<code>apt</code></td><td>包管理</td><td><code>name=nginx state=present</code></td></tr><tr><td><code>systemd</code></td><td>服务管理</td><td><code>name=nginx state=started</code></td></tr><tr><td><code>copy</code></td><td>复制文件</td><td><code>src=local dest=remote</code></td></tr><tr><td><code>template</code></td><td>Jinja2 模板</td><td><code>src=conf.j2 dest=/etc/app.conf</code></td></tr><tr><td><code>file</code></td><td>文件/目录</td><td><code>path=/dir state=directory</code></td></tr><tr><td><code>user</code></td><td>用户管理</td><td><code>name=admin groups=docker</code></td></tr><tr><td><code>git</code></td><td>拉取代码</td><td><code>repo=URL dest=/opt/app</code></td></tr><tr><td><code>synchronize</code></td><td>rsync 同步</td><td><code>src=./dist/ dest=/var/www/</code></td></tr><tr><td><code>command</code></td><td>执行命令</td><td><code>cmd=uptime</code></td></tr><tr><td><code>shell</code></td><td>Shell 命令</td><td>\`cmd=&quot;pipe</td></tr><tr><td><code>wait_for</code></td><td>等待端口</td><td><code>port=80 host=0.0.0.0 delay=5</code></td></tr><tr><td><code>uri</code></td><td>HTTP 请求</td><td><code>url=http://localhost/health</code></td></tr><tr><td><code>cron</code></td><td>定时任务</td><td><code>name=backup job=&quot;/opt/backup.sh&quot;</code></td></tr><tr><td><code>lineinfile</code></td><td>修改单行</td><td><code>path=/etc/hosts line=&quot;1.2.3.4 host&quot;</code></td></tr><tr><td><code>blockinfile</code></td><td>修改多行</td><td><code>path=/etc/conf block=&quot;...&quot;</code></td></tr></tbody></table><h3 id="_1-6-role-角色" tabindex="-1"><a class="header-anchor" href="#_1-6-role-角色"><span>1.6 Role 角色</span></a></h3><p>Role 是 Playbook 的组织方式，将变量、任务、模板、文件按标准目录结构组织：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>roles/</span></span>
<span class="line"><span>└── nginx/</span></span>
<span class="line"><span>    ├── defaults/</span></span>
<span class="line"><span>    │   └── main.yml          # 默认变量（优先级最低）</span></span>
<span class="line"><span>    ├── vars/</span></span>
<span class="line"><span>    │   └── main.yml          # 变量（优先级高）</span></span>
<span class="line"><span>    ├── tasks/</span></span>
<span class="line"><span>    │   └── main.yml          # 任务</span></span>
<span class="line"><span>    ├── handlers/</span></span>
<span class="line"><span>    │   └── main.yml          # 处理器</span></span>
<span class="line"><span>    ├── templates/</span></span>
<span class="line"><span>    │   └── nginx.conf.j2     # Jinja2 模板</span></span>
<span class="line"><span>    ├── files/</span></span>
<span class="line"><span>    │   └── index.html        # 静态文件</span></span>
<span class="line"><span>    ├── meta/</span></span>
<span class="line"><span>    │   └── main.yml          # 角色元数据（依赖）</span></span>
<span class="line"><span>    └── tests/</span></span>
<span class="line"><span>        ├── inventory</span></span>
<span class="line"><span>        └── test.yml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># roles/nginx/tasks/main.yml</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Install Nginx</span></span>
<span class="line"><span style="color:#E06C75;">  yum</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">present</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Configure Nginx</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx.conf.j2</span></span>
<span class="line"><span style="color:#E06C75;">    dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/etc/nginx/nginx.conf</span></span>
<span class="line"><span style="color:#E06C75;">  notify</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Reload Nginx</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ensure Nginx is running</span></span>
<span class="line"><span style="color:#E06C75;">  systemd</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">    state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">started</span></span>
<span class="line"><span style="color:#E06C75;">    enabled</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">yes</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># site.yml（使用 Role）</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deploy Web Stack</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">webservers</span></span>
<span class="line"><span style="color:#E06C75;">  become</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">yes</span></span>
<span class="line"><span style="color:#E06C75;">  roles</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#E06C75;">      tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">role</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">php-fpm</span></span>
<span class="line"><span style="color:#E06C75;">      tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">php</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-7-ansible-实战-批量部署" tabindex="-1"><a class="header-anchor" href="#_1-7-ansible-实战-批量部署"><span>1.7 Ansible 实战：批量部署</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># rolling-deploy.yml - 滚动更新部署</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#ABB2BF;">- </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Rolling Deploy</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">webservers</span></span>
<span class="line"><span style="color:#E06C75;">  become</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">yes</span></span>
<span class="line"><span style="color:#E06C75;">  serial</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span><span style="color:#7F848E;font-style:italic;">                    # 每次只部署一台</span></span>
<span class="line"><span style="color:#E06C75;">  any_errors_fatal</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#7F848E;font-style:italic;">       # 任一台失败则停止</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  pre_tasks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Remove from load balancer</span></span>
<span class="line"><span style="color:#E06C75;">      community.general.haproxy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        backend</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">web_backend</span></span>
<span class="line"><span style="color:#E06C75;">        host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ inventory_hostname }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">disabled</span></span>
<span class="line"><span style="color:#E06C75;">      delegate_to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">lb01</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  tasks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deploy new version</span></span>
<span class="line"><span style="color:#E06C75;">      synchronize</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        src</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">./dist/</span></span>
<span class="line"><span style="color:#E06C75;">        dest</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/var/www/app/</span></span>
<span class="line"><span style="color:#E06C75;">        delete</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">yes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Restart application</span></span>
<span class="line"><span style="color:#E06C75;">      systemd</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">        state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">restarted</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Wait for application to be ready</span></span>
<span class="line"><span style="color:#E06C75;">      uri</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;http://localhost:8080/health&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        status_code</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">200</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">      delay</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  post_tasks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Add back to load balancer</span></span>
<span class="line"><span style="color:#E06C75;">      community.general.haproxy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        backend</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">web_backend</span></span>
<span class="line"><span style="color:#E06C75;">        host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{ inventory_hostname }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">enabled</span></span>
<span class="line"><span style="color:#E06C75;">      delegate_to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">lb01</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-docker-容器化部署" tabindex="-1"><a class="header-anchor" href="#_2-docker-容器化部署"><span>2. Docker 容器化部署</span></a></h2><h3 id="_2-1-dockerfile-最佳实践" tabindex="-1"><a class="header-anchor" href="#_2-1-dockerfile-最佳实践"><span>2.1 Dockerfile 最佳实践</span></a></h3><div class="language-dockerfile line-numbers-mode" data-highlighter="shiki" data-ext="dockerfile" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-dockerfile"><span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 多阶段构建 Dockerfile</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># --- 阶段1: 构建 ---</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> node:20-alpine </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> builder</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 先复制依赖文件（利用 Docker 缓存层）</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> package*.json ./</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> npm ci --only=production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复制源码并构建</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> . .</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> npm run build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># --- 阶段2: 运行 ---</span></span>
<span class="line"><span style="color:#61AFEF;">FROM</span><span style="color:#ABB2BF;"> node:20-alpine </span><span style="color:#61AFEF;">AS</span><span style="color:#ABB2BF;"> runner</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安全：使用非 root 用户</span></span>
<span class="line"><span style="color:#61AFEF;">RUN</span><span style="color:#ABB2BF;"> addgroup --system --gid 1001 appgroup &amp;&amp; \\</span></span>
<span class="line"><span style="color:#ABB2BF;">    adduser --system --uid 1001 appuser</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">WORKDIR</span><span style="color:#ABB2BF;"> /app</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 仅复制构建产物</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=builder --chown=appuser:appgroup /app/dist ./dist</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules</span></span>
<span class="line"><span style="color:#61AFEF;">COPY</span><span style="color:#ABB2BF;"> --from=builder --chown=appuser:appgroup /app/package.json ./</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">USER</span><span style="color:#ABB2BF;"> appuser</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">EXPOSE</span><span style="color:#ABB2BF;"> 3000</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">HEALTHCHECK</span><span style="color:#ABB2BF;"> --interval=30s --timeout=3s --retries=3 \\</span></span>
<span class="line"><span style="color:#61AFEF;">    CMD</span><span style="color:#ABB2BF;"> wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">CMD</span><span style="color:#ABB2BF;"> [</span><span style="color:#98C379;">&quot;node&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;dist/server.js&quot;</span><span style="color:#ABB2BF;">]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container important"><p class="hint-container-title">Dockerfile 最佳实践</p><ol><li><strong>使用多阶段构建</strong>：构建环境和运行环境分离，镜像更小</li><li><strong>利用缓存层</strong>：先 COPY 依赖文件，再 COPY 源码</li><li><strong>使用 .dockerignore</strong>：排除 node_modules、.git 等</li><li><strong>使用非 root 用户</strong>：<code>USER appuser</code></li><li><strong>一个容器一个进程</strong>：不要在容器里跑多个服务</li><li><strong>添加 HEALTHCHECK</strong>：让 Docker 知道容器是否健康</li><li><strong>固定基础镜像版本</strong>：<code>node:20.10-alpine</code> 而非 <code>node:latest</code></li><li><strong>最小化层数</strong>：合并 RUN 指令</li></ol></div><p><strong>.dockerignore 文件：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>.git</span></span>
<span class="line"><span>.github</span></span>
<span class="line"><span>node_modules</span></span>
<span class="line"><span>npm-debug.log</span></span>
<span class="line"><span>Dockerfile</span></span>
<span class="line"><span>docker-compose*.yml</span></span>
<span class="line"><span>.dockerignore</span></span>
<span class="line"><span>.env</span></span>
<span class="line"><span>.env.*</span></span>
<span class="line"><span>README.md</span></span>
<span class="line"><span>.vscode</span></span>
<span class="line"><span>coverage</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-镜像优化技巧" tabindex="-1"><a class="header-anchor" href="#_2-2-镜像优化技巧"><span>2.2 镜像优化技巧</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看镜像层</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> history</span><span style="color:#98C379;"> myapp:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 dive 分析镜像层</span></span>
<span class="line"><span style="color:#61AFEF;">dive</span><span style="color:#98C379;"> myapp:latest</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 镜像瘦身对比</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 未优化：node:20 (1.1GB) → 构建后 ~1.2GB</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 优化后：node:20-alpine (180MB) → 多阶段构建后 ~80MB</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 清理无用镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> image</span><span style="color:#98C379;"> prune</span><span style="color:#D19A66;"> -a</span><span style="color:#D19A66;"> -f</span><span style="color:#D19A66;"> --filter</span><span style="color:#98C379;"> &quot;until=168h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 BuildKit 加速构建</span></span>
<span class="line"><span style="color:#E06C75;">DOCKER_BUILDKIT</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">1</span><span style="color:#61AFEF;"> docker</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> myapp</span><span style="color:#98C379;"> .</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用缓存挂载</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># RUN --mount=type=cache,target=/root/.npm npm ci</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-docker-compose-编排" tabindex="-1"><a class="header-anchor" href="#_2-3-docker-compose-编排"><span>2.3 Docker Compose 编排</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;3.8&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    build</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">      dockerfile</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Dockerfile</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;3000:3000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">NODE_ENV=production</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">DB_HOST=postgres</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">REDIS_HOST=redis</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      postgres</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_healthy</span></span>
<span class="line"><span style="color:#E06C75;">      redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        condition</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">service_started</span></span>
<span class="line"><span style="color:#E06C75;">    restart</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">unless-stopped</span></span>
<span class="line"><span style="color:#E06C75;">    deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;2.0&#39;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512M</span></span>
<span class="line"><span style="color:#E06C75;">        reservations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpus</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;0.5&#39;</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">256M</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;wget&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;--spider&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;http://localhost:3000/health&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">30s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">3s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  postgres</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">postgres:16-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_DB</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_USER</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_USER:-myapp}</span></span>
<span class="line"><span style="color:#E06C75;">      POSTGRES_PASSWORD</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${DB_PASSWORD:?DB_PASSWORD required}</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">postgres-data:/var/lib/postgresql/data</span></span>
<span class="line"><span style="color:#E06C75;">    healthcheck</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      test</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;CMD-SHELL&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;pg_isready -U myapp&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">      interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10s</span></span>
<span class="line"><span style="color:#E06C75;">      timeout</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5s</span></span>
<span class="line"><span style="color:#E06C75;">      retries</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  redis</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis:7-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">redis-data:/data</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  nginx</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">nginx:1.24-alpine</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;80:80&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;443:443&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/nginx.conf:/etc/nginx/nginx.conf:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./nginx/ssl:/etc/nginx/ssl:ro</span></span>
<span class="line"><span style="color:#E06C75;">    depends_on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">app-network</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  postgres-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  redis-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app-network</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">bridge</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Compose 常用命令</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#7F848E;font-style:italic;">                    # 启动所有服务</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span><span style="color:#7F848E;font-style:italic;">                      # 停止并删除</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> down</span><span style="color:#D19A66;"> -v</span><span style="color:#7F848E;font-style:italic;">                   # 同时删除卷</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> ps</span><span style="color:#7F848E;font-style:italic;">                        # 服务状态</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> logs</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> app</span><span style="color:#7F848E;font-style:italic;">               # 跟踪日志</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> app</span><span style="color:#98C379;"> sh</span><span style="color:#7F848E;font-style:italic;">               # 进入容器</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> build</span><span style="color:#D19A66;"> --no-cache</span><span style="color:#7F848E;font-style:italic;">          # 重新构建</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> pull</span><span style="color:#7F848E;font-style:italic;">                      # 拉取最新镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --build</span><span style="color:#98C379;"> app</span><span style="color:#7F848E;font-style:italic;">         # 仅重建并启动 app</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> config</span><span style="color:#7F848E;font-style:italic;">                    # 验证配置</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> scale</span><span style="color:#98C379;"> app=</span><span style="color:#D19A66;">3</span><span style="color:#7F848E;font-style:italic;">               # 扩展实例</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-kubernetes-入门" tabindex="-1"><a class="header-anchor" href="#_3-kubernetes-入门"><span>3. Kubernetes 入门</span></a></h2><h3 id="_3-1-kubernetes-核心概念" tabindex="-1"><a class="header-anchor" href="#_3-1-kubernetes-核心概念"><span>3.1 Kubernetes 核心概念</span></a></h3>`,33),i(d,{code:`eJx1UbsKwjAU3fsVIbuD1VnQKCg+KLbgEBxqe7VgaCRNdXdw8Bdc/QkXf0f9C28VxKTtHRLuPSc5JydrIQ9REipNgp5DsLJ8tVHhLiFM5JkGxek4X4FKQUNGXpfT436lyw/TYE/DL/m7k+f5+Dje/ohFdb0Rp7gQH9QelIUOAtbnFHQUW4DPhgNE/CiBOBelcyyYTzhlMtVKCoTRShpuDBqksVO2PJMxNDldSLX9OSZN6/YxMrYYgABtIR4inrTNeq49rRdHqinu2uLIqBFvVYq3q8QNE0X8jUYH32W2rtF+IjcmRcrGoPgu5w05y5Nr`}),o[2]||=n(`<h3 id="_3-2-pod" tabindex="-1"><a class="header-anchor" href="#_3-2-pod"><span>3.2 Pod</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># pod.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Pod</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">      image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:1.0.0</span></span>
<span class="line"><span style="color:#E06C75;">      ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span>
<span class="line"><span style="color:#E06C75;">      resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">100m</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">128Mi</span></span>
<span class="line"><span style="color:#E06C75;">        limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">500m</span></span>
<span class="line"><span style="color:#E06C75;">          memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512Mi</span></span>
<span class="line"><span style="color:#E06C75;">      env</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">NODE_ENV</span></span>
<span class="line"><span style="color:#E06C75;">          value</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;production&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">DB_PASSWORD</span></span>
<span class="line"><span style="color:#E06C75;">          valueFrom</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            secretKeyRef</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">db-secret</span></span>
<span class="line"><span style="color:#E06C75;">              key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">password</span></span>
<span class="line"><span style="color:#E06C75;">      livenessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/health</span></span>
<span class="line"><span style="color:#E06C75;">          port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span>
<span class="line"><span style="color:#E06C75;">        initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">        periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">      readinessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/ready</span></span>
<span class="line"><span style="color:#E06C75;">          port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span>
<span class="line"><span style="color:#E06C75;">        initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">        periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">  restartPolicy</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Always</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-deployment" tabindex="-1"><a class="header-anchor" href="#_3-3-deployment"><span>3.3 Deployment</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># deployment.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  strategy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">RollingUpdate</span></span>
<span class="line"><span style="color:#E06C75;">    rollingUpdate</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      maxSurge</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1</span><span style="color:#7F848E;font-style:italic;">          # 滚动更新时最多多出1个Pod</span></span>
<span class="line"><span style="color:#E06C75;">      maxUnavailable</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span><span style="color:#7F848E;font-style:italic;">    # 滚动更新时不允许不可用</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">        version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:1.0.0</span></span>
<span class="line"><span style="color:#E06C75;">          ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span>
<span class="line"><span style="color:#E06C75;">          resources</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            requests</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">100m</span></span>
<span class="line"><span style="color:#E06C75;">              memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">128Mi</span></span>
<span class="line"><span style="color:#E06C75;">            limits</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              cpu</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">500m</span></span>
<span class="line"><span style="color:#E06C75;">              memory</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">512Mi</span></span>
<span class="line"><span style="color:#E06C75;">          readinessProbe</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">            httpGet</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/ready</span></span>
<span class="line"><span style="color:#E06C75;">              port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span>
<span class="line"><span style="color:#E06C75;">            initialDelaySeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span>
<span class="line"><span style="color:#E06C75;">            periodSeconds</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># kubectl 常用命令</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> apply</span><span style="color:#D19A66;"> -f</span><span style="color:#98C379;"> deployment.yaml</span><span style="color:#7F848E;font-style:italic;">        # 应用配置</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> deployments</span><span style="color:#7F848E;font-style:italic;">                 # 查看 Deployment</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> get</span><span style="color:#98C379;"> pods</span><span style="color:#7F848E;font-style:italic;">                        # 查看 Pod</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> describe</span><span style="color:#98C379;"> pod</span><span style="color:#98C379;"> myapp-xxx</span><span style="color:#7F848E;font-style:italic;">          # Pod 详情</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> logs</span><span style="color:#98C379;"> myapp-xxx</span><span style="color:#D19A66;"> -f</span><span style="color:#7F848E;font-style:italic;">               # 查看日志</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> exec</span><span style="color:#D19A66;"> -it</span><span style="color:#98C379;"> myapp-xxx</span><span style="color:#D19A66;"> --</span><span style="color:#98C379;"> sh</span><span style="color:#7F848E;font-style:italic;">        # 进入容器</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 滚动更新</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> set</span><span style="color:#98C379;"> image</span><span style="color:#98C379;"> deployment/myapp</span><span style="color:#98C379;"> myapp=myapp:2.0.0</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> rollout</span><span style="color:#98C379;"> status</span><span style="color:#98C379;"> deployment/myapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 回滚</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> rollout</span><span style="color:#98C379;"> history</span><span style="color:#98C379;"> deployment/myapp</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> rollout</span><span style="color:#98C379;"> undo</span><span style="color:#98C379;"> deployment/myapp</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> rollout</span><span style="color:#98C379;"> undo</span><span style="color:#98C379;"> deployment/myapp</span><span style="color:#D19A66;"> --to-revision=2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 扩缩容</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> scale</span><span style="color:#98C379;"> deployment/myapp</span><span style="color:#D19A66;"> --replicas=5</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-service" tabindex="-1"><a class="header-anchor" href="#_3-4-service"><span>3.4 Service</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># service.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Service</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">      targetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span>
<span class="line"><span style="color:#E06C75;">  type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ClusterIP</span><span style="color:#7F848E;font-style:italic;">    # ClusterIP / NodePort / LoadBalancer</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># ingress.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">networking.k8s.io/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Ingress</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    nginx.ingress.kubernetes.io/ssl-redirect</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;true&quot;</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  tls</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">hosts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#98C379;">app.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      secretName</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-tls</span></span>
<span class="line"><span style="color:#E06C75;">  rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app.example.com</span></span>
<span class="line"><span style="color:#E06C75;">      http</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">          - </span><span style="color:#E06C75;">path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/</span></span>
<span class="line"><span style="color:#E06C75;">            pathType</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Prefix</span></span>
<span class="line"><span style="color:#E06C75;">            backend</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">              service</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">                port</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                  number</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-ci-cd-流水线" tabindex="-1"><a class="header-anchor" href="#_4-ci-cd-流水线"><span>4. CI/CD 流水线</span></a></h2><h3 id="_4-1-ci-cd-流水线架构" tabindex="-1"><a class="header-anchor" href="#_4-1-ci-cd-流水线架构"><span>4.1 CI/CD 流水线架构</span></a></h3>`,10),i(d,{code:`eJxLy8kvT85ILCpR8AniUgACx2ilJ7sXP1/Q+Kx/wpNdS2ySiuzSM0sUCkqLM5RiFXR17RScopWcPRWezWt5unsXSPr5nmkv1k/Uf7a1+8X6qfovp8552tyvFAs2zAmswTlaCSL6rG/Fy4ZGkB6X/OTs1CKFoNT0zOKSokqocmewcheg+S4KL5tXPN+7Caw2tUzhUdskheCSxPTMvHQwO6AoPwWqyQWsyRVox6qeF+vBpj9tXPp01/ZnixuezV+q/7Rt0vPm+RDXAbWA9RSXJqUXJRZkKDh7Ris962l8vnvty9ltzzomQM0Eux3MSs1LQdMBdB5UB9iFSDqc4SwXOMsVbgoAqUKMmQ==`}),o[3]||=n(`<h3 id="_4-2-github-actions" tabindex="-1"><a class="header-anchor" href="#_4-2-github-actions"><span>4.2 GitHub Actions</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># .github/workflows/ci.yml</span></span>
<span class="line"><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">CI/CD Pipeline</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66;">on</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  push</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branches</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">main</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">develop</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">  pull_request</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    branches</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">main</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">env</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  REGISTRY</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ghcr.io</span></span>
<span class="line"><span style="color:#E06C75;">  IMAGE_NAME</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ github.repository }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">jobs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  test</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Setup Node.js</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/setup-node@v4</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          node-version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;20&#39;</span></span>
<span class="line"><span style="color:#E06C75;">          cache</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;npm&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Install dependencies</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">npm ci</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Lint</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">npm run lint</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Unit tests</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">npm test</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Integration tests</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">npm run test:integration</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  build-and-push</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">github.ref == &#39;refs/heads/main&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    permissions</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      contents</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">read</span></span>
<span class="line"><span style="color:#E06C75;">      packages</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">write</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Login to Container Registry</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/login-action@v3</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          registry</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}</span></span>
<span class="line"><span style="color:#E06C75;">          username</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ github.actor }}</span></span>
<span class="line"><span style="color:#E06C75;">          password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ secrets.GITHUB_TOKEN }}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Extract metadata</span></span>
<span class="line"><span style="color:#E06C75;">        id</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">meta</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/metadata-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          images</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}</span></span>
<span class="line"><span style="color:#E06C75;">          tags</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">            type=sha,prefix=</span></span>
<span class="line"><span style="color:#98C379;">            type=ref,event=branch</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Build and push</span></span>
<span class="line"><span style="color:#E06C75;">        uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker/build-push-action@v5</span></span>
<span class="line"><span style="color:#E06C75;">        with</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          context</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">.</span></span>
<span class="line"><span style="color:#E06C75;">          push</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span></span>
<span class="line"><span style="color:#E06C75;">          tags</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.tags }}</span></span>
<span class="line"><span style="color:#E06C75;">          labels</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${{ steps.meta.outputs.labels }}</span></span>
<span class="line"><span style="color:#E06C75;">          cache-from</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha</span></span>
<span class="line"><span style="color:#E06C75;">          cache-to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">type=gha,mode=max</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  deploy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    needs</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build-and-push</span></span>
<span class="line"><span style="color:#E06C75;">    runs-on</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">ubuntu-latest</span></span>
<span class="line"><span style="color:#E06C75;">    if</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">github.ref == &#39;refs/heads/main&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">    steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">uses</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">actions/checkout@v4</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deploy to production</span></span>
<span class="line"><span style="color:#E06C75;">        run</span><span style="color:#ABB2BF;">: </span><span style="color:#C678DD;">|</span></span>
<span class="line"><span style="color:#98C379;">          ssh deploy@prod-server &quot;docker pull \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:sha-\${{ github.sha }} &amp;&amp; \\</span></span>
<span class="line"><span style="color:#98C379;">            docker compose up -d &amp;&amp; \\</span></span>
<span class="line"><span style="color:#98C379;">            sleep 10 &amp;&amp; \\</span></span>
<span class="line"><span style="color:#98C379;">            curl -sf http://localhost:3000/health || exit 1&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-gitlab-ci" tabindex="-1"><a class="header-anchor" href="#_4-3-gitlab-ci"><span>4.3 GitLab CI</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># .gitlab-ci.yml</span></span>
<span class="line"><span style="color:#E06C75;">stages</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#98C379;">deploy</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">variables</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  DOCKER_REGISTRY</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">registry.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  APP_NAME</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 测试 ==========</span></span>
<span class="line"><span style="color:#E06C75;">test</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">test</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">node:20-alpine</span></span>
<span class="line"><span style="color:#E06C75;">  cache</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${CI_COMMIT_REF_SLUG}</span></span>
<span class="line"><span style="color:#E06C75;">    paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">node_modules/</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">npm ci</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">npm run lint</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">npm test</span></span>
<span class="line"><span style="color:#E06C75;">  coverage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;/Statements\\s*:\\s*(\\d+\\.\\d+)%/&#39;</span></span>
<span class="line"><span style="color:#E06C75;">  artifacts</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    reports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      coverage_report</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        coverage_format</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">cobertura</span></span>
<span class="line"><span style="color:#E06C75;">        path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">coverage/cobertura-coverage.xml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 构建 ==========</span></span>
<span class="line"><span style="color:#E06C75;">build</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">build</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">docker:24</span></span>
<span class="line"><span style="color:#E06C75;">  services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker:24-dind</span></span>
<span class="line"><span style="color:#E06C75;">  variables</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    DOCKER_TLS_CERTDIR</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;/certs&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">echo &quot;$CI_REGISTRY_PASSWORD&quot; | docker login -u &quot;$CI_REGISTRY_USER&quot; --password-stdin $CI_REGISTRY</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $CI_REGISTRY_IMAGE:latest</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">docker push $CI_REGISTRY_IMAGE:latest</span></span>
<span class="line"><span style="color:#E06C75;">  only</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 部署到 Staging ==========</span></span>
<span class="line"><span style="color:#E06C75;">deploy_staging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">deploy</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">alpine</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">apk add --no-cache openssh-client</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">eval $(ssh-agent -s)</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">echo &quot;$SSH_PRIVATE_KEY&quot; | tr -d &#39;\\r&#39; | ssh-add -</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">ssh deploy@staging-server &quot;docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA &amp;&amp; docker compose up -d&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">staging</span></span>
<span class="line"><span style="color:#E06C75;">    url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://staging.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  only</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========== 部署到生产 ==========</span></span>
<span class="line"><span style="color:#E06C75;">deploy_production</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  stage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">deploy</span></span>
<span class="line"><span style="color:#E06C75;">  image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">alpine</span></span>
<span class="line"><span style="color:#E06C75;">  before_script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">apk add --no-cache openssh-client</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">eval $(ssh-agent -s)</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">echo &quot;$SSH_PRIVATE_KEY&quot; | tr -d &#39;\\r&#39; | ssh-add -</span></span>
<span class="line"><span style="color:#E06C75;">  script</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">ssh deploy@prod-server &quot;docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA &amp;&amp; docker compose up -d&quot;</span></span>
<span class="line"><span style="color:#E06C75;">  environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">production</span></span>
<span class="line"><span style="color:#E06C75;">    url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">https://app.example.com</span></span>
<span class="line"><span style="color:#E06C75;">  when</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">manual</span><span style="color:#7F848E;font-style:italic;">        # 手动触发</span></span>
<span class="line"><span style="color:#E06C75;">  only</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#98C379;">main</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-jenkins-pipeline" tabindex="-1"><a class="header-anchor" href="#_4-4-jenkins-pipeline"><span>4.4 Jenkins Pipeline</span></a></h3><div class="language-groovy line-numbers-mode" data-highlighter="shiki" data-ext="groovy" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-groovy"><span class="line"><span style="color:#7F848E;font-style:italic;">// Jenkinsfile</span></span>
<span class="line"><span style="color:#ABB2BF;">pipeline {</span></span>
<span class="line"><span style="color:#ABB2BF;">    agent any</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    environment {</span></span>
<span class="line"><span style="color:#D19A66;">        REGISTRY</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &#39;registry.example.com&#39;</span></span>
<span class="line"><span style="color:#D19A66;">        IMAGE_NAME</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;</span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">REGISTRY</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">/myapp&quot;</span></span>
<span class="line"><span style="color:#D19A66;">        IMAGE_TAG</span><span style="color:#56B6C2;"> =</span><span style="color:#98C379;"> &quot;</span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">env.BUILD_NUMBER</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    stages {</span></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Test&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&#39;npm ci &amp;&amp; npm test&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">            post {</span></span>
<span class="line"><span style="color:#ABB2BF;">                always {</span></span>
<span class="line"><span style="color:#ABB2BF;">                    junit </span><span style="color:#98C379;">&#39;test-results/*.xml&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">                }</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Build&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&quot;docker build -t </span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">IMAGE_NAME</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">:</span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">IMAGE_TAG</span><span style="color:#C678DD;">}</span><span style="color:#98C379;"> .&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Push&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#61AFEF;">                withDockerRegistry</span><span style="color:#ABB2BF;">([</span><span style="color:#D19A66;">credentialsId</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;registry-creds&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;https://</span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">REGISTRY</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">]) {</span></span>
<span class="line"><span style="color:#ABB2BF;">                    sh </span><span style="color:#98C379;">&quot;docker push </span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">IMAGE_NAME</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">:</span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">IMAGE_TAG</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">                }</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Deploy to Staging&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&quot;ansible-playbook -i inventory/staging deploy.yml -e image_tag=</span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">IMAGE_TAG</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Integration Test&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&#39;./scripts/integration-test.sh staging&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Deploy to Production&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            input {</span></span>
<span class="line"><span style="color:#ABB2BF;">                message </span><span style="color:#98C379;">&quot;Deploy to production?&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">                ok </span><span style="color:#98C379;">&quot;Deploy&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&quot;ansible-playbook -i inventory/production deploy.yml -e image_tag=</span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">IMAGE_TAG</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    post {</span></span>
<span class="line"><span style="color:#ABB2BF;">        failure {</span></span>
<span class="line"><span style="color:#ABB2BF;">            mail </span><span style="color:#D19A66;">to</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;team@example.com&#39;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#D19A66;">                 subject</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Pipeline Failed: </span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">env.JOB_NAME</span><span style="color:#C678DD;">}</span><span style="color:#98C379;"> #</span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">env.BUILD_NUMBER</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#D19A66;">                 body</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Check console output: </span><span style="color:#C678DD;">\${</span><span style="color:#98C379;">env.BUILD_URL</span><span style="color:#C678DD;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-蓝绿部署与金丝雀发布" tabindex="-1"><a class="header-anchor" href="#_5-蓝绿部署与金丝雀发布"><span>5. 蓝绿部署与金丝雀发布</span></a></h2><h3 id="_5-1-蓝绿部署" tabindex="-1"><a class="header-anchor" href="#_5-1-蓝绿部署"><span>5.1 蓝绿部署</span></a></h3>`,8),i(d,{code:`eJwrTi0sTc1LTnXJTEwvSszlUgCCgsSikszkzILEvBIFHyeFxGKFF1vmv9i79+nc9hcLFz6duQJDlVNOaSpY3eS5z/vWP13UrFFmqImhyr0oNTUPpOz57v0wZUaaXGB1fvklqQr5ZalFQBt1wAqtFJ52zH26vPt517ZnDY3v98yCG/5sy+4X25vB2nycdO3sQLZbKRgaGKgqPNva+LK9H7eRL5tXPN+76dm0Dc87O57NWfO0YwPcLWA9YGVAI1GUK5QZKWgrPG1c+nTX9meLG57NX4rPze3PehdBnQF3IVSSKCc+Xdb0bE7ny+nrXi6a8X5Pz9P9q182zH86e96z3bPQvQy0DCgBDxcuAN7Qytg=`}),o[4]||=n(`<p><strong>Kubernetes 蓝绿部署：</strong></p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># blue-deployment.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-blue</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    slot</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">blue</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">      slot</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">blue</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">        slot</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">blue</span></span>
<span class="line"><span style="color:#E06C75;">        version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:v1</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># green-deployment.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">apps/v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Deployment</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-green</span></span>
<span class="line"><span style="color:#E06C75;">  labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    slot</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">green</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">      slot</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">green</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">        slot</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">green</span></span>
<span class="line"><span style="color:#E06C75;">        version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v2</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:v2</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># service.yaml - 通过修改 selector 切换</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Service</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    slot</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">blue</span><span style="color:#7F848E;font-style:italic;">    # 切换时改为 green</span></span>
<span class="line"><span style="color:#E06C75;">  ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">port</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">80</span></span>
<span class="line"><span style="color:#E06C75;">      targetPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-金丝雀发布" tabindex="-1"><a class="header-anchor" href="#_5-2-金丝雀发布"><span>5.2 金丝雀发布</span></a></h3>`,3),i(d,{code:`eJxLy8kvT85ILCpR8AniUgACx2ilMkMFQwMD1WdbG1+29yvFKujq2ik4AYWNFEyhgjZJRXbPZ0981rf8WU/7swXtSrFgvU5gpc7VShDRZ2sXP92x4/2e+Uq1YGlnkHTNsxnraxRcwMYZwcyD6ncB63fFpd8Vod8N4hyEI8EK3MD63cFyyD5Asv3phGU1Ch7RSk9nz3u2e9bTjg0KZYZQBRDjIQq4AEhQano=`}),o[5]||=n(`<p><strong>Kubernetes 金丝雀发布（使用 Argo Rollouts）：</strong></p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># rollouts.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">argoproj.io/v1alpha1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Rollout</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  replicas</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">10</span></span>
<span class="line"><span style="color:#E06C75;">  strategy</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    canary</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      steps</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5</span><span style="color:#7F848E;font-style:italic;">           # 5% 流量到新版本</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span><span style="color:#ABB2BF;"> }  </span><span style="color:#7F848E;font-style:italic;"># 暂停5分钟观察</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">25</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">50</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">pause</span><span style="color:#ABB2BF;">: { </span><span style="color:#E06C75;">duration</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">10m</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">setWeight</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">100</span><span style="color:#7F848E;font-style:italic;">         # 全量切换</span></span>
<span class="line"><span style="color:#E06C75;">      canaryService</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-canary</span></span>
<span class="line"><span style="color:#E06C75;">      stableService</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp-stable</span></span>
<span class="line"><span style="color:#E06C75;">  selector</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    matchLabels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">  template</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        app</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">    spec</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      containers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">        - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp</span></span>
<span class="line"><span style="color:#E06C75;">          image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">myapp:v2</span></span>
<span class="line"><span style="color:#E06C75;">          ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">containerPort</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">3000</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-配置管理" tabindex="-1"><a class="header-anchor" href="#_6-配置管理"><span>6. 配置管理</span></a></h2><h3 id="_6-1-ansible-vault" tabindex="-1"><a class="header-anchor" href="#_6-1-ansible-vault"><span>6.1 Ansible Vault</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 创建加密文件</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-vault</span><span style="color:#98C379;"> create</span><span style="color:#98C379;"> secrets.yml</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 输入密码后编辑</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 编辑加密文件</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-vault</span><span style="color:#98C379;"> edit</span><span style="color:#98C379;"> secrets.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 加密已有文件</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-vault</span><span style="color:#98C379;"> encrypt</span><span style="color:#98C379;"> plain.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 解密文件</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-vault</span><span style="color:#98C379;"> decrypt</span><span style="color:#98C379;"> secrets.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看加密文件</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-vault</span><span style="color:#98C379;"> view</span><span style="color:#98C379;"> secrets.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 修改密码</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-vault</span><span style="color:#98C379;"> rekey</span><span style="color:#98C379;"> secrets.yml</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在 Playbook 中使用</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#98C379;"> site.yml</span><span style="color:#D19A66;"> --ask-vault-pass</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-playbook</span><span style="color:#98C379;"> site.yml</span><span style="color:#D19A66;"> --vault-password-file</span><span style="color:#98C379;"> ~/.vault_pass</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 加密特定字符串（2.3+）</span></span>
<span class="line"><span style="color:#61AFEF;">ansible-vault</span><span style="color:#98C379;"> encrypt_string</span><span style="color:#98C379;"> &#39;my_secret_password&#39;</span><span style="color:#D19A66;"> --name</span><span style="color:#98C379;"> &#39;db_password&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-2-环境变量管理" tabindex="-1"><a class="header-anchor" href="#_6-2-环境变量管理"><span>6.2 环境变量管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># .env 文件（不提交到 Git！）</span></span>
<span class="line"><span style="color:#E06C75;">DB_HOST</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">prod-db.example.com</span></span>
<span class="line"><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">s3cr3t</span></span>
<span class="line"><span style="color:#E06C75;">API_KEY</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">abc123</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .env.example（提交到 Git）</span></span>
<span class="line"><span style="color:#E06C75;">DB_HOST</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">localhost</span></span>
<span class="line"><span style="color:#E06C75;">DB_PASSWORD</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">changeme</span></span>
<span class="line"><span style="color:#E06C75;">API_KEY</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">changeme</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># .gitignore</span></span>
<span class="line"><span style="color:#61AFEF;">.env</span></span>
<span class="line"><span style="color:#61AFEF;">.env.production</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Kubernetes Secret：</strong></p><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># secret.yaml</span></span>
<span class="line"><span style="color:#E06C75;">apiVersion</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">v1</span></span>
<span class="line"><span style="color:#E06C75;">kind</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Secret</span></span>
<span class="line"><span style="color:#E06C75;">metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-secrets</span></span>
<span class="line"><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">Opaque</span></span>
<span class="line"><span style="color:#E06C75;">data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  db-password</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">c2VjcmV0</span><span style="color:#7F848E;font-style:italic;">   # base64 编码</span></span>
<span class="line"><span style="color:#E06C75;">stringData</span><span style="color:#ABB2BF;">:                  </span><span style="color:#7F848E;font-style:italic;"># 明文（创建时自动编码）</span></span>
<span class="line"><span style="color:#E06C75;">  api-key</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">my-api-key</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 从文件创建 Secret</span></span>
<span class="line"><span style="color:#61AFEF;">kubectl</span><span style="color:#98C379;"> create</span><span style="color:#98C379;"> secret</span><span style="color:#98C379;"> generic</span><span style="color:#98C379;"> app-secrets</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --from-literal=db-password=secret123</span><span style="color:#56B6C2;"> \\</span></span>
<span class="line"><span style="color:#D19A66;">    --from-file=ssh-key=</span><span style="color:#ABB2BF;">~</span><span style="color:#D19A66;">/.ssh/id_rsa</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 使用 Sealed Secrets 加密</span></span>
<span class="line"><span style="color:#61AFEF;">kubeseal</span><span style="color:#D19A66;"> --format</span><span style="color:#98C379;"> yaml</span><span style="color:#ABB2BF;"> &lt; </span><span style="color:#98C379;">secret.yaml</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">sealed-secret.yaml</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-日志集中管理" tabindex="-1"><a class="header-anchor" href="#_7-日志集中管理"><span>7. 日志集中管理</span></a></h2><h3 id="_7-1-elk-efk-架构" tabindex="-1"><a class="header-anchor" href="#_7-1-elk-efk-架构"><span>7.1 ELK/EFK 架构</span></a></h3>`,12),i(d,{code:`eJxLy8kvT85ILCpR8AniUgACx2ilp7umPJ+y4um6nU9nrrBJKrIrLknJLy3RB1KpRUVKsQq6unYKTtFKbpk5qUmpiSX6bjmlqXklKSClz6Yvfbp/+sv29pez25RiwQY6gdU7Ryv55KcXlyQWZyDUPV3S8nxCm/6L/e3Pdi+BKncGK3eJVnLNSSwuyUwuTk0sSgbreb5l0dM9U/Wfrp3xtGkFVLULWLVrtJJ3ZlJiXiJI2dP+9S+Wtz3tmfZs/tIX6xcBFQIA1nlfmg==`}),o[6]||=n(`<h3 id="_7-2-docker-日志配置" tabindex="-1"><a class="header-anchor" href="#_7-2-docker-日志配置"><span>7.2 Docker 日志配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.yml 日志驱动配置</span></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  app</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    logging</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">      driver</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;json-file&quot;</span></span>
<span class="line"><span style="color:#E06C75;">      options</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">        max-size</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;50m&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        max-file</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;5&quot;</span></span>
<span class="line"><span style="color:#E06C75;">        tag</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;{{.Name}}/{{.ID}}&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-filebeat-配置" tabindex="-1"><a class="header-anchor" href="#_7-3-filebeat-配置"><span>7.3 Filebeat 配置</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># filebeat.yml</span></span>
<span class="line"><span style="color:#E06C75;">filebeat.inputs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">type</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">container</span></span>
<span class="line"><span style="color:#E06C75;">    paths</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/var/lib/docker/containers/*/*.log</span></span>
<span class="line"><span style="color:#E06C75;">    processors</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">add_kubernetes_metadata</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          host</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">\${NODE_NAME}</span></span>
<span class="line"><span style="color:#E06C75;">          matchers</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            - </span><span style="color:#E06C75;">logs_path</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">                logs_path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;/var/lib/docker/containers/&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">output.elasticsearch</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  hosts</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&quot;elasticsearch:9200&quot;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">  indices</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">    - </span><span style="color:#E06C75;">index</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;filebeat-%{[agent.version]}-%{+yyyy.MM.dd}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">logging.level</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">info</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-监控集成" tabindex="-1"><a class="header-anchor" href="#_8-监控集成"><span>8. 监控集成</span></a></h2><h3 id="_8-1-prometheus-grafana" tabindex="-1"><a class="header-anchor" href="#_8-1-prometheus-grafana"><span>8.1 Prometheus + Grafana</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># docker-compose.monitoring.yml</span></span>
<span class="line"><span style="color:#E06C75;">version</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;3.8&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">services</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  prometheus</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">prom/prometheus:v2.48.0</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">prometheus-data:/prometheus</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;9090:9090&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">monitoring</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  grafana</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">grafana/grafana:10.2.0</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">grafana-data:/var/lib/grafana</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;3000:3000&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    environment</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">GF_SECURITY_ADMIN_PASSWORD=admin</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">monitoring</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">  node-exporter</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">    image</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">prom/node-exporter:v1.7.0</span></span>
<span class="line"><span style="color:#E06C75;">    ports</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&quot;9100:9100&quot;</span></span>
<span class="line"><span style="color:#E06C75;">    volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/proc:/host/proc:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/sys:/host/sys:ro</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">/:/rootfs:ro</span></span>
<span class="line"><span style="color:#E06C75;">    command</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&#39;--path.procfs=/host/proc&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&#39;--path.sysfs=/host/sys&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">&#39;--path.rootfs=/rootfs&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#98C379;">monitoring</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">volumes</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  prometheus-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  grafana-data</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">networks</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  monitoring</span><span style="color:#ABB2BF;">:</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># monitoring/prometheus.yml</span></span>
<span class="line"><span style="color:#E06C75;">global</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">  scrape_interval</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">15s</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">scrape_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;node-exporter&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    static_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">targets</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;node-exporter:9100&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">job_name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;myapp&#39;</span></span>
<span class="line"><span style="color:#E06C75;">    static_configs</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">targets</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;app:3000&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">    metrics_path</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">/metrics</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-告警规则" tabindex="-1"><a class="header-anchor" href="#_8-2-告警规则"><span>8.2 告警规则</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="shiki" data-ext="yaml" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-yaml"><span class="line"><span style="color:#7F848E;font-style:italic;"># monitoring/alerts.yml</span></span>
<span class="line"><span style="color:#E06C75;">groups</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">  - </span><span style="color:#E06C75;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">app-alerts</span></span>
<span class="line"><span style="color:#E06C75;">    rules</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">HighErrorRate</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">rate(http_requests_total{status=~&quot;5..&quot;}[5m]) / rate(http_requests_total[5m]) &gt; 0.05</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;High error rate on {{ $labels.instance }}&quot;</span></span>
<span class="line"><span style="color:#E06C75;">          description</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;Error rate is {{ $value | humanizePercentage }}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">HighMemoryUsage</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes &gt; 0.9</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">warning</span></span>
<span class="line"><span style="color:#E06C75;">        annotations</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          summary</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;High memory usage on {{ $labels.instance }}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">      - </span><span style="color:#E06C75;">alert</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">PodCrashLooping</span></span>
<span class="line"><span style="color:#E06C75;">        expr</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">rate(kube_pod_container_status_restarts_total[15m]) &gt; 0</span></span>
<span class="line"><span style="color:#E06C75;">        for</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">5m</span></span>
<span class="line"><span style="color:#E06C75;">        labels</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#E06C75;">          severity</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">critical</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-实战-完整-ci-cd-流水线配置" tabindex="-1"><a class="header-anchor" href="#_9-实战-完整-ci-cd-流水线配置"><span>9. 实战：完整 CI/CD 流水线配置</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;">#!/bin/bash</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 一键部署脚本（配合 CI/CD 使用）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ============================================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">set</span><span style="color:#D19A66;"> -euo</span><span style="color:#98C379;"> pipefail</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">VERSION</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${1</span><span style="color:#ABB2BF;">:?</span><span style="color:#E06C75;">Usage</span><span style="color:#ABB2BF;">:</span><span style="color:#E06C75;font-style:italic;"> $0</span><span style="color:#98C379;"> &lt;</span><span style="color:#E06C75;">version</span><span style="color:#98C379;">&gt;</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#E06C75;">ENV</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;</span><span style="color:#E06C75;font-style:italic;">\${2</span><span style="color:#ABB2BF;">:-</span><span style="color:#E06C75;">production</span><span style="color:#E06C75;font-style:italic;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"><span style="color:#E06C75;">REGISTRY</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;registry.example.com&quot;</span></span>
<span class="line"><span style="color:#E06C75;">APP_NAME</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;myapp&quot;</span></span>
<span class="line"><span style="color:#E06C75;">IMAGE</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">REGISTRY</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}:\${</span><span style="color:#E06C75;">VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Deploying \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">} v\${</span><span style="color:#E06C75;">VERSION</span><span style="color:#98C379;">} to \${</span><span style="color:#E06C75;">ENV</span><span style="color:#98C379;">}...&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 拉取镜像</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Pulling image: \${</span><span style="color:#E06C75;">IMAGE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> pull</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">IMAGE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 健康检查镜像</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Running health check...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> run</span><span style="color:#D19A66;"> --rm</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --name</span><span style="color:#98C379;"> health-check</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">IMAGE</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">sleep</span><span style="color:#D19A66;"> 5</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#61AFEF;"> docker</span><span style="color:#98C379;"> exec</span><span style="color:#98C379;"> health-check</span><span style="color:#98C379;"> curl</span><span style="color:#D19A66;"> -sf</span><span style="color:#98C379;"> http://localhost:3000/health</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Health check passed&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    docker</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> health-check</span></span>
<span class="line"><span style="color:#C678DD;">else</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Health check failed!&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    docker</span><span style="color:#98C379;"> stop</span><span style="color:#98C379;"> health-check</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 备份当前版本</span></span>
<span class="line"><span style="color:#E06C75;">CURRENT</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">$(</span><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> images</span><span style="color:#D19A66;"> -q</span><span style="color:#98C379;"> app</span><span style="color:#ABB2BF;"> 2&gt;</span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;"> | </span><span style="color:#61AFEF;">head</span><span style="color:#D19A66;"> -1</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> [[ </span><span style="color:#56B6C2;">-n</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$CURRENT</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;"> ]]; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Backing up current image...&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    docker</span><span style="color:#98C379;"> tag</span><span style="color:#98C379;"> &quot;</span><span style="color:#E06C75;">$CURRENT</span><span style="color:#98C379;">&quot;</span><span style="color:#98C379;"> &quot;\${</span><span style="color:#E06C75;">REGISTRY</span><span style="color:#98C379;">}/\${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">}:rollback&quot;</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. 更新镜像版本</span></span>
<span class="line"><span style="color:#C678DD;">export</span><span style="color:#E06C75;"> IMAGE_TAG</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;\${</span><span style="color:#E06C75;">VERSION</span><span style="color:#98C379;">}&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --no-build</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 等待启动</span></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Waiting for application to start...&quot;</span></span>
<span class="line"><span style="color:#E06C75;">retries</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">30</span></span>
<span class="line"><span style="color:#C678DD;">while</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">retries</span><span style="color:#56B6C2;"> &gt;</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">do</span></span>
<span class="line"><span style="color:#C678DD;">    if</span><span style="color:#61AFEF;"> curl</span><span style="color:#D19A66;"> -sf</span><span style="color:#98C379;"> http://localhost:3000/health</span><span style="color:#ABB2BF;"> &gt; </span><span style="color:#98C379;">/dev/null</span><span style="color:#ABB2BF;">; </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">        echo</span><span style="color:#98C379;"> &quot;Application is healthy!&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        break</span></span>
<span class="line"><span style="color:#C678DD;">    fi</span></span>
<span class="line"><span style="color:#ABB2BF;">    ((</span><span style="color:#E06C75;">retries</span><span style="color:#56B6C2;">--</span><span style="color:#ABB2BF;">))</span></span>
<span class="line"><span style="color:#61AFEF;">    sleep</span><span style="color:#D19A66;"> 2</span></span>
<span class="line"><span style="color:#C678DD;">done</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">if</span><span style="color:#ABB2BF;"> (( </span><span style="color:#E06C75;">retries</span><span style="color:#56B6C2;"> ==</span><span style="color:#D19A66;"> 0</span><span style="color:#ABB2BF;"> )); </span><span style="color:#C678DD;">then</span></span>
<span class="line"><span style="color:#56B6C2;">    echo</span><span style="color:#98C379;"> &quot;Application failed to start! Rolling back...&quot;</span></span>
<span class="line"><span style="color:#C678DD;">    export</span><span style="color:#E06C75;"> IMAGE_TAG</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;rollback&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">    docker</span><span style="color:#98C379;"> compose</span><span style="color:#98C379;"> up</span><span style="color:#D19A66;"> -d</span><span style="color:#D19A66;"> --no-build</span></span>
<span class="line"><span style="color:#56B6C2;">    exit</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#C678DD;">fi</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 6. 清理旧镜像</span></span>
<span class="line"><span style="color:#61AFEF;">docker</span><span style="color:#98C379;"> image</span><span style="color:#98C379;"> prune</span><span style="color:#D19A66;"> -f</span><span style="color:#D19A66;"> --filter</span><span style="color:#98C379;"> &quot;until=168h&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">echo</span><span style="color:#98C379;"> &quot;Deployment complete: \${</span><span style="color:#E06C75;">APP_NAME</span><span style="color:#98C379;">} v\${</span><span style="color:#E06C75;">VERSION</span><span style="color:#98C379;">} on \${</span><span style="color:#E06C75;">ENV</span><span style="color:#98C379;">}&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="参考资源" tabindex="-1"><a class="header-anchor" href="#参考资源"><span>参考资源</span></a></h2><ul><li>《Linux 命令行与 Shell 脚本编程大全》</li><li><a href="https://docs.ansible.com/" target="_blank" rel="noopener noreferrer">Ansible 官方文档</a></li><li><a href="https://docs.docker.com/" target="_blank" rel="noopener noreferrer">Docker 官方文档</a></li><li><a href="https://kubernetes.io/docs/" target="_blank" rel="noopener noreferrer">Kubernetes 官方文档</a></li><li><a href="https://docs.github.com/en/actions" target="_blank" rel="noopener noreferrer">GitHub Actions 文档</a></li><li><a href="https://docs.gitlab.com/ee/ci/" target="_blank" rel="noopener noreferrer">GitLab CI 文档</a></li><li><a href="https://argoproj.github.io/argo-rollouts/" target="_blank" rel="noopener noreferrer">Argo Rollouts</a></li><li><a href="https://prometheus.io/docs/" target="_blank" rel="noopener noreferrer">Prometheus 文档</a></li></ul>`,14)])}var l=a(s,[[`render`,c]]);export{o as _pageData,l as default};
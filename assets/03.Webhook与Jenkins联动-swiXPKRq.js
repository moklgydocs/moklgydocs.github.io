import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as r}from"./app-CuUTPG3l.js";var i=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/GitLab/03.Webhook%E4%B8%8EJenkins%E8%81%94%E5%8A%A8.html","title":"Webhook 与 Jenkins 联动","lang":"zh-CN","frontmatter":{"title":"Webhook 与 Jenkins 联动","date":"2025-04-14T00:00:00.000Z","category":["GitLab"],"tag":["GitLab","Webhook","Jenkins","CI/CD"],"order":3},"git":{"createdTime":1776135420000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":2.59,"words":777},"filePathRelative":"运维与部署/GitLab/03.Webhook与Jenkins联动.md"}`),a={name:`03.Webhook与Jenkins联动.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="webhook-与-jenkins-联动" tabindex="-1"><a class="header-anchor" href="#webhook-与-jenkins-联动"><span>Webhook 与 Jenkins 联动</span></a></h1><p>代码推送到 GitLab，自动触发 Jenkins 构建。不用手动点&quot;构建&quot;，提交代码就自动跑。</p><hr><h2 id="整体流程" tabindex="-1"><a class="header-anchor" href="#整体流程"><span>整体流程</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>开发者 git push → GitLab → Webhook 通知 → Jenkins → 构建/测试/部署</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>详细流程：</span></span>
<span class="line"><span>1. 开发者 push 代码到 GitLab</span></span>
<span class="line"><span>2. GitLab 触发 Webhook，发 POST 请求给 Jenkins</span></span>
<span class="line"><span>3. Jenkins 收到请求，拉取最新代码</span></span>
<span class="line"><span>4. Jenkins 执行构建流水线（编译 → 测试 → 打包 → 部署）</span></span>
<span class="line"><span>5. Jenkins 把构建结果反馈给 GitLab（成功/失败标记）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="jenkins-端配置" tabindex="-1"><a class="header-anchor" href="#jenkins-端配置"><span>Jenkins 端配置</span></a></h2><h3 id="_1-安装插件" tabindex="-1"><a class="header-anchor" href="#_1-安装插件"><span>1. 安装插件</span></a></h3><p>Jenkins → 系统管理 → 插件管理 → 搜索安装：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>✅ GitLab Plugin</span></span>
<span class="line"><span>✅ Git Plugin（一般已有）</span></span>
<span class="line"><span>✅ Generic Webhook Trigger Plugin（可选，更灵活）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-配置-gitlab-连接" tabindex="-1"><a class="header-anchor" href="#_2-配置-gitlab-连接"><span>2. 配置 GitLab 连接</span></a></h3><p>Jenkins → 系统管理 → 系统配置 → GitLab：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Connection name: my-gitlab</span></span>
<span class="line"><span>GitLab host URL: http://gitlab.company.com</span></span>
<span class="line"><span>Credentials: GitLab API token（在GitLab里生成）</span></span>
<span class="line"><span>→ Test Connection → 成功</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>在 GitLab 生成 API Token：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>GitLab → 头像 → Preferences → Access Tokens</span></span>
<span class="line"><span>→ Token name: jenkins</span></span>
<span class="line"><span>→ Scopes: api</span></span>
<span class="line"><span>→ Create personal access token</span></span>
<span class="line"><span>→ 复制 token</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-创建-jenkins-job" tabindex="-1"><a class="header-anchor" href="#_3-创建-jenkins-job"><span>3. 创建 Jenkins Job</span></a></h3><p><strong>Freestyle 项目：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>源码管理：</span></span>
<span class="line"><span>  → Git</span></span>
<span class="line"><span>  → Repository URL: http://gitlab.company.com/group/erp-api.git</span></span>
<span class="line"><span>  → Credentials: 添加 GitLab 用户名密码</span></span>
<span class="line"><span>  → Branch Specifier: */develop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>构建触发器：</span></span>
<span class="line"><span>  → ✅ Build when a change is pushed to GitLab</span></span>
<span class="line"><span>  → GitLab webhook URL: http://jenkins.company.com/project/erp-api</span></span>
<span class="line"><span>  → ✅ Push Events</span></span>
<span class="line"><span>  → ✅ Accepted Merge Request Events</span></span>
<span class="line"><span>  → 高级 → Secret token → Generate → 复制这个 token</span></span>
<span class="line"><span></span></span>
<span class="line"><span>构建步骤：</span></span>
<span class="line"><span>  → 执行 shell</span></span>
<span class="line"><span>  → dotnet publish -c Release -o ./publish</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Pipeline 项目（推荐）：</strong></p><div class="language-groovy line-numbers-mode" data-highlighter="shiki" data-ext="groovy" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-groovy"><span class="line"><span style="color:#7F848E;font-style:italic;">// Jenkinsfile</span></span>
<span class="line"><span style="color:#ABB2BF;">pipeline {</span></span>
<span class="line"><span style="color:#ABB2BF;">    agent any</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    triggers {</span></span>
<span class="line"><span style="color:#61AFEF;">        gitlab</span><span style="color:#ABB2BF;">(</span><span style="color:#D19A66;">triggerOnPush</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">triggerOnMergeRequest</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">true</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    stages {</span></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Checkout&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                git </span><span style="color:#D19A66;">branch</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;develop&#39;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#D19A66;">                    url</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;http://gitlab.company.com/group/erp-api.git&#39;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#D19A66;">                    credentialsId</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;gitlab-cred&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Build&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&#39;dotnet publish -c Release -o ./publish&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Docker Build&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&#39;docker build -t erp-api:\${BUILD_NUMBER} .&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Deploy&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            when { branch </span><span style="color:#98C379;">&#39;main&#39;</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&#39;&#39;&#39;</span></span>
<span class="line"><span style="color:#98C379;">                    docker tag erp-api:\${BUILD_NUMBER} registry.company.com/erp-api:\${BUILD_NUMBER}</span></span>
<span class="line"><span style="color:#98C379;">                    docker push registry.company.com/erp-api:\${BUILD_NUMBER}</span></span>
<span class="line"><span style="color:#98C379;">                &#39;&#39;&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    post {</span></span>
<span class="line"><span style="color:#ABB2BF;">        success { updateGitlabCommitStatus </span><span style="color:#D19A66;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;build&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;success&#39;</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">        failure { updateGitlabCommitStatus </span><span style="color:#D19A66;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;build&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;failed&#39;</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="gitlab-端配置-webhook" tabindex="-1"><a class="header-anchor" href="#gitlab-端配置-webhook"><span>GitLab 端配置 Webhook</span></a></h2><p>项目 → Settings → Webhooks：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>URL: http://jenkins.company.com/project/erp-api</span></span>
<span class="line"><span>Secret token: （Jenkins 生成的 token）</span></span>
<span class="line"><span>Trigger:</span></span>
<span class="line"><span>  ✅ Push events → develop</span></span>
<span class="line"><span>  ✅ Merge request events</span></span>
<span class="line"><span>SSL verification: ❌（内网可以关闭）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>→ Add webhook</span></span>
<span class="line"><span>→ Test → Push events → 看到 200 OK</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="按分支触发不同行为" tabindex="-1"><a class="header-anchor" href="#按分支触发不同行为"><span>按分支触发不同行为</span></a></h2><div class="language-groovy line-numbers-mode" data-highlighter="shiki" data-ext="groovy" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-groovy"><span class="line"><span style="color:#7F848E;font-style:italic;">// Jenkinsfile</span></span>
<span class="line"><span style="color:#ABB2BF;">pipeline {</span></span>
<span class="line"><span style="color:#ABB2BF;">    agent any</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    stages {</span></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Build&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&#39;dotnet publish -c Release -o ./publish&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Deploy to Dev&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            when { branch </span><span style="color:#98C379;">&#39;develop&#39;</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&#39;ssh dev-server &quot;cd /opt/apps/erp &amp;&amp; docker compose up -d&quot;&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Deploy to Staging&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            when { branch </span><span style="color:#98C379;">&#39;release/*&#39;</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&#39;ssh staging-server &quot;cd /opt/apps/erp &amp;&amp; docker compose up -d&quot;&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#61AFEF;">        stage</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;Deploy to Production&#39;</span><span style="color:#ABB2BF;">) {</span></span>
<span class="line"><span style="color:#ABB2BF;">            when { branch </span><span style="color:#98C379;">&#39;main&#39;</span><span style="color:#ABB2BF;"> }</span></span>
<span class="line"><span style="color:#ABB2BF;">            steps {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">                // 生产环境需要手动确认</span></span>
<span class="line"><span style="color:#ABB2BF;">                input </span><span style="color:#D19A66;">message</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;确认部署到生产环境？&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">                sh </span><span style="color:#98C379;">&#39;ssh prod-server &quot;cd /opt/apps/erp &amp;&amp; docker compose up -d&quot;&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="构建状态回写-gitlab" tabindex="-1"><a class="header-anchor" href="#构建状态回写-gitlab"><span>构建状态回写 GitLab</span></a></h2><p>Jenkins 构建完成后，在 GitLab 的提交/MR 上显示构建状态：</p><div class="language-groovy line-numbers-mode" data-highlighter="shiki" data-ext="groovy" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-groovy"><span class="line"><span style="color:#ABB2BF;">post {</span></span>
<span class="line"><span style="color:#ABB2BF;">    success {</span></span>
<span class="line"><span style="color:#ABB2BF;">        updateGitlabCommitStatus </span><span style="color:#D19A66;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;build&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;success&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    failure {</span></span>
<span class="line"><span style="color:#ABB2BF;">        updateGitlabCommitStatus </span><span style="color:#D19A66;">name</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;build&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">state</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;failed&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">    always {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        // 清理工作空间</span></span>
<span class="line"><span style="color:#61AFEF;">        cleanWs</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">    }</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>效果：GitLab 的 MR 页面会显示 ✅ pipeline passed 或 ❌ pipeline failed。</p><hr><h2 id="排错" tabindex="-1"><a class="header-anchor" href="#排错"><span>排错</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># Webhook 没触发？</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. GitLab → Webhooks → 看最近的请求记录</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">#    → 有没有发出去？返回什么状态码？</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. Jenkins 防火墙开了吗？</span></span>
<span class="line"><span style="color:#61AFEF;">curl</span><span style="color:#D19A66;"> -X</span><span style="color:#98C379;"> POST</span><span style="color:#98C379;"> http://jenkins.company.com/project/erp-api</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. Token 对吗？</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GitLab 的 Secret token 和 Jenkins 的要一致</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 4. Jenkins 日志</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># Jenkins → 系统管理 → 系统日志 → 搜索 &quot;gitlab&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 5. 网络不通？（Docker 环境常见）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># GitLab 和 Jenkins 在同一个 Docker Network？</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="速查" tabindex="-1"><a class="header-anchor" href="#速查"><span>速查</span></a></h2><table><thead><tr><th>步骤</th><th>在哪配</th><th>做什么</th></tr></thead><tbody><tr><td>装插件</td><td>Jenkins</td><td>GitLab Plugin</td></tr><tr><td>API Token</td><td>GitLab</td><td>给 Jenkins 调 API 用</td></tr><tr><td>GitLab 连接</td><td>Jenkins 系统配置</td><td>填 URL + Token</td></tr><tr><td>构建触发器</td><td>Jenkins Job</td><td>开启 GitLab trigger</td></tr><tr><td>Webhook</td><td>GitLab 项目设置</td><td>填 Jenkins URL + Secret</td></tr><tr><td>状态回写</td><td>Jenkinsfile post</td><td>updateGitlabCommitStatus</td></tr></tbody></table>`,39)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};
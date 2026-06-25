import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-BVtXrkU4.js";import{t as r}from"./app-DvxCNKUe.js";var i=JSON.parse(`{"path":"/%E8%BF%90%E7%BB%B4%E4%B8%8E%E9%83%A8%E7%BD%B2/GitLab/04.%E5%88%86%E6%94%AF%E4%BF%9D%E6%8A%A4%E4%B8%8E%E5%90%88%E5%B9%B6%E7%AD%96%E7%95%A5.html","title":"分支保护与合并策略","lang":"zh-CN","frontmatter":{"title":"分支保护与合并策略","date":"2025-04-14T00:00:00.000Z","category":["GitLab"],"tag":["GitLab","分支保护","Merge Request","代码审查"],"order":4},"git":{"createdTime":1776135420000,"updatedTime":1776135420000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":2.91,"words":872},"filePathRelative":"运维与部署/GitLab/04.分支保护与合并策略.md"}`),a={name:`04.分支保护与合并策略.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="分支保护与合并策略" tabindex="-1"><a class="header-anchor" href="#分支保护与合并策略"><span>分支保护与合并策略</span></a></h1><p>不保护分支，任何人都能往 main 推代码，哪天手滑就炸了。MR 审核 + 分支保护 = 代码质量的最后防线。</p><hr><h2 id="分支保护" tabindex="-1"><a class="header-anchor" href="#分支保护"><span>分支保护</span></a></h2><h3 id="配置入口" tabindex="-1"><a class="header-anchor" href="#配置入口"><span>配置入口</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>项目 → Settings → Repository → Protected branches</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="推荐配置" tabindex="-1"><a class="header-anchor" href="#推荐配置"><span>推荐配置</span></a></h3><table><thead><tr><th>分支</th><th>谁能 Push</th><th>谁能 Merge</th><th>允许 Force Push</th></tr></thead><tbody><tr><td><code>main</code></td><td>No one</td><td>Maintainers</td><td>❌</td></tr><tr><td><code>develop</code></td><td>Maintainers</td><td>Developers + Maintainers</td><td>❌</td></tr></tbody></table><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>main 分支：</span></span>
<span class="line"><span>  Allowed to merge: Maintainers</span></span>
<span class="line"><span>  Allowed to push and merge: No one</span></span>
<span class="line"><span>  → 只能通过 MR 合并，不能直接 push</span></span>
<span class="line"><span></span></span>
<span class="line"><span>develop 分支：</span></span>
<span class="line"><span>  Allowed to merge: Developers + Maintainers</span></span>
<span class="line"><span>  Allowed to push and merge: Maintainers</span></span>
<span class="line"><span>  → 开发者通过 MR 合并，负责人可以直接 push</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="merge-request-mr-流程" tabindex="-1"><a class="header-anchor" href="#merge-request-mr-流程"><span>Merge Request（MR）流程</span></a></h2><h3 id="完整流程" tabindex="-1"><a class="header-anchor" href="#完整流程"><span>完整流程</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>1. 开发者在 feature 分支写代码</span></span>
<span class="line"><span>2. push 到远程</span></span>
<span class="line"><span>3. 创建 MR（feature → develop）</span></span>
<span class="line"><span>4. 自动触发 CI 流水线</span></span>
<span class="line"><span>5. 指定审查人 Review 代码</span></span>
<span class="line"><span>6. 审查通过 + CI 通过 → 合并</span></span>
<span class="line"><span>7. 自动删除 feature 分支</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="创建-mr" tabindex="-1"><a class="header-anchor" href="#创建-mr"><span>创建 MR</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>GitLab → 项目 → Merge Requests → New merge request</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Source branch: feature/user-management</span></span>
<span class="line"><span>Target branch: develop</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Title: feat: 用户管理模块</span></span>
<span class="line"><span>Description:</span></span>
<span class="line"><span>  ## 改了什么</span></span>
<span class="line"><span>  - 添加用户 CRUD 接口</span></span>
<span class="line"><span>  - 添加角色关联</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  ## 测试了什么</span></span>
<span class="line"><span>  - 单元测试通过</span></span>
<span class="line"><span>  - Swagger 手动测试通过</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Assignee: 自己</span></span>
<span class="line"><span>Reviewer: 技术负责人</span></span>
<span class="line"><span>Labels: feature</span></span>
<span class="line"><span></span></span>
<span class="line"><span>☑ Delete source branch when merge request is accepted</span></span>
<span class="line"><span>☑ Squash commits when merge request is accepted</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="合并策略" tabindex="-1"><a class="header-anchor" href="#合并策略"><span>合并策略</span></a></h2><h3 id="三种合并方式" tabindex="-1"><a class="header-anchor" href="#三种合并方式"><span>三种合并方式</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>1. Merge commit（默认）</span></span>
<span class="line"><span>   保留所有提交历史，创建一个合并提交</span></span>
<span class="line"><span>   → 历史完整但可能杂乱</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2. Squash and merge（推荐功能分支）</span></span>
<span class="line"><span>   把 feature 分支的多次提交压成一个</span></span>
<span class="line"><span>   → develop 历史干净</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3. Fast-forward merge</span></span>
<span class="line"><span>   不创建合并提交，要求分支是最新的</span></span>
<span class="line"><span>   → 最干净但要求严格</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="推荐配置-1" tabindex="-1"><a class="header-anchor" href="#推荐配置-1"><span>推荐配置</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>项目 → Settings → Merge requests</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Merge method:</span></span>
<span class="line"><span>  → ✅ Merge commit with semi-linear history</span></span>
<span class="line"><span>     （要求分支 rebase 到最新，再合并）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Squash commits when merging:</span></span>
<span class="line"><span>  → Encourage（鼓励但不强制）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Merge checks:</span></span>
<span class="line"><span>  → ✅ Pipelines must succeed（CI 必须通过）</span></span>
<span class="line"><span>  → ✅ All discussions must be resolved（讨论必须解决）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="审查规则" tabindex="-1"><a class="header-anchor" href="#审查规则"><span>审查规则</span></a></h2><h3 id="approval-rules" tabindex="-1"><a class="header-anchor" href="#approval-rules"><span>Approval Rules</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>项目 → Settings → Merge requests → Approval rules</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Rule: 至少 1 人审批</span></span>
<span class="line"><span>  Approvals required: 1</span></span>
<span class="line"><span>  Eligible approvers: 项目 Maintainers</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 也可以设置多条规则</span></span>
<span class="line"><span>Rule: 后端审批</span></span>
<span class="line"><span>  Approvals required: 1</span></span>
<span class="line"><span>  Eligible approvers: 后端组成员</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="code-review-要点" tabindex="-1"><a class="header-anchor" href="#code-review-要点"><span>Code Review 要点</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>审查关注点：</span></span>
<span class="line"><span>  ✅ 逻辑正确性 —— 业务逻辑对不对</span></span>
<span class="line"><span>  ✅ 异常处理 —— 边界情况考虑了吗</span></span>
<span class="line"><span>  ✅ 安全性 —— SQL注入、XSS、密码硬编码</span></span>
<span class="line"><span>  ✅ 性能 —— N+1查询、大量内存分配</span></span>
<span class="line"><span>  ✅ 可维护性 —— 命名、注释、函数长度</span></span>
<span class="line"><span>  ❌ 不纠结代码风格 —— 交给 linter 自动化</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="review-操作" tabindex="-1"><a class="header-anchor" href="#review-操作"><span>Review 操作</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>在 MR 页面的 Changes tab：</span></span>
<span class="line"><span>  → 选中代码行 → 添加评论</span></span>
<span class="line"><span>  → 建议修改 → 用 suggestion 代码块</span></span>
<span class="line"><span>  → 审查完毕 → Approve（通过）或 Request changes（打回）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="ci-通过才能合并" tabindex="-1"><a class="header-anchor" href="#ci-通过才能合并"><span>CI 通过才能合并</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>Settings → Merge requests → Merge checks</span></span>
<span class="line"><span>→ ✅ Pipelines must succeed</span></span>
<span class="line"><span></span></span>
<span class="line"><span>效果：MR 的 CI 流水线没跑过，合并按钮是灰色的</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配合 <code>.gitlab-ci.yml</code>（如果使用 GitLab CI）或 Jenkins Webhook 回写状态。</p><hr><h2 id="推荐的项目设置总结" tabindex="-1"><a class="header-anchor" href="#推荐的项目设置总结"><span>推荐的项目设置总结</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>分支保护：</span></span>
<span class="line"><span>  main     → 只能通过 MR 合并</span></span>
<span class="line"><span>  develop  → Maintainer 可直接 push，Developer 走 MR</span></span>
<span class="line"><span></span></span>
<span class="line"><span>合并策略：</span></span>
<span class="line"><span>  → Semi-linear history</span></span>
<span class="line"><span>  → 鼓励 Squash</span></span>
<span class="line"><span>  → CI 必须通过</span></span>
<span class="line"><span>  → 讨论必须解决</span></span>
<span class="line"><span></span></span>
<span class="line"><span>审批规则：</span></span>
<span class="line"><span>  → 至少 1 人 Approve</span></span>
<span class="line"><span></span></span>
<span class="line"><span>自动化：</span></span>
<span class="line"><span>  → 合并后自动删除源分支</span></span>
<span class="line"><span>  → 合并后自动触发部署</span></span>
<span class="line"><span></span></span>
<span class="line"><span>命名规范：</span></span>
<span class="line"><span>  → feature/* → develop → main</span></span>
<span class="line"><span>  → bugfix/* → develop</span></span>
<span class="line"><span>  → hotfix/* → main + develop</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="速查" tabindex="-1"><a class="header-anchor" href="#速查"><span>速查</span></a></h2><table><thead><tr><th>目标</th><th>配置位置</th></tr></thead><tbody><tr><td>禁止直接 push main</td><td>Settings → Repository → Protected branches</td></tr><tr><td>CI 必须通过才能合并</td><td>Settings → Merge requests → Merge checks</td></tr><tr><td>需要审批才能合并</td><td>Settings → Merge requests → Approval rules</td></tr><tr><td>合并后自动删源分支</td><td>MR 创建时勾选 / Settings → Merge requests</td></tr><tr><td>Squash 提交</td><td>Settings → Merge requests → Squash commits</td></tr></tbody></table>`,39)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};
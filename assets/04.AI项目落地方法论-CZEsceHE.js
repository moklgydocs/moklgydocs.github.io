import{E as e,d as t,l as n}from"./runtime-core.esm-bundler-tCF-J6l5.js";import{t as r}from"./app-DL4DkHYg.js";var i=JSON.parse(`{"path":"/AI%E5%AE%9E%E8%B7%B5/04_%E6%9E%B6%E6%9E%84%E9%98%B6%E6%AE%B5/04.AI%E9%A1%B9%E7%9B%AE%E8%90%BD%E5%9C%B0%E6%96%B9%E6%B3%95%E8%AE%BA.html","title":"AI 项目落地方法论","lang":"zh-CN","frontmatter":{"title":"AI 项目落地方法论","icon":"fa6-solid:rocket","order":4,"category":["AI实践"],"tag":["项目管理","落地方法论","MVP","风险管控"]},"git":{"createdTime":1776847222000,"updatedTime":1776847222000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":1}]},"readingTime":{"minutes":5.44,"words":1631},"filePathRelative":"AI实践/04_架构阶段/04.AI项目落地方法论.md"}`),a={name:`04.AI项目落地方法论.md`};function o(r,i,a,o,s,c){return e(),n(`div`,null,[...i[0]||=[t(`<h1 id="ai-项目落地方法论" tabindex="-1"><a class="header-anchor" href="#ai-项目落地方法论"><span>AI 项目落地方法论</span></a></h1><p>技术能力只是 AI 落地的一半。另一半是：如何识别真正有价值的问题、如何快速验证假设、如何管理风险边界。</p><h2 id="_1-项目失败的常见原因" tabindex="-1"><a class="header-anchor" href="#_1-项目失败的常见原因"><span>1. 项目失败的常见原因</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>技术原因（30%）：</span></span>
<span class="line"><span>- 模型能力被高估，实际效果未达预期</span></span>
<span class="line"><span>- 数据质量差，RAG 检索不准</span></span>
<span class="line"><span>- 延迟太高，用户不接受</span></span>
<span class="line"><span></span></span>
<span class="line"><span>非技术原因（70%）：</span></span>
<span class="line"><span>- 没有真实用户需求，只是技术炫技</span></span>
<span class="line"><span>- 没有评估标准，不知道什么叫成功</span></span>
<span class="line"><span>- 上线后无人维护，质量持续退化</span></span>
<span class="line"><span>- 缺少反馈闭环，问题无法被发现</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-需求评估框架" tabindex="-1"><a class="header-anchor" href="#_2-需求评估框架"><span>2. 需求评估框架</span></a></h2><p>在动手之前，用以下问题过滤项目：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>✅ 适合 AI 的问题特征：</span></span>
<span class="line"><span>□ 大量重复但有变化的工作（不是完全机械的）</span></span>
<span class="line"><span>□ 现有方案效果差（太慢/太贵/质量不稳定）</span></span>
<span class="line"><span>□ 允许一定错误率（有人工兜底）</span></span>
<span class="line"><span>□ 数据可获得（文档/历史对话/标注数据）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>❌ 不适合或高风险的特征：</span></span>
<span class="line"><span>□ 要求100%准确（金融/医疗核心决策）</span></span>
<span class="line"><span>□ 数据极度稀少</span></span>
<span class="line"><span>□ 用户完全不接受错误</span></span>
<span class="line"><span>□ 法规明确禁止（部分行业）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="价值评估" tabindex="-1"><a class="header-anchor" href="#价值评估"><span>价值评估</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>预期价值 = </span></span>
<span class="line"><span>  (每次平均节省时间 × 每天执行次数 × 工时单价) </span></span>
<span class="line"><span>  - (LLM API 成本 + 开发成本/折旧 + 维护成本)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>示例：</span></span>
<span class="line"><span>- 客服问题自动回复</span></span>
<span class="line"><span>  - 节省时间：平均 3 分钟/次</span></span>
<span class="line"><span>  - 每天执行：500 次</span></span>
<span class="line"><span>  - 工时单价：0.5 元/分钟</span></span>
<span class="line"><span>  - 预期价值：750 元/天 = 27,000 元/月</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  - LLM 成本：500 次 × 0.5 元/次 = 250 元/天</span></span>
<span class="line"><span>  - 净价值：500 元/天 ✅ 值得做</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-mvp-策略" tabindex="-1"><a class="header-anchor" href="#_3-mvp-策略"><span>3. MVP 策略</span></a></h2><h3 id="分阶段验证" tabindex="-1"><a class="header-anchor" href="#分阶段验证"><span>分阶段验证</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>第一阶段：技术可行性（1-2 周）</span></span>
<span class="line"><span>→ 用 20-50 个样本手工测试</span></span>
<span class="line"><span>→ 不要构建任何系统，直接 Playground 验证</span></span>
<span class="line"><span>→ 输出：效果截图/结果统计，确认技术路线</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第二阶段：最小化产品（2-4 周）</span></span>
<span class="line"><span>→ 只做核心功能，不做优化</span></span>
<span class="line"><span>→ 找 5-10 个内部用户试用</span></span>
<span class="line"><span>→ 输出：用户反馈，确认需求真实性</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第三阶段：生产就绪（4-8 周）</span></span>
<span class="line"><span>→ 加评估体系、监控告警、安全护栏</span></span>
<span class="line"><span>→ 灰度上线 10% 用户</span></span>
<span class="line"><span>→ 输出：稳定运行 2 周，达到质量指标</span></span>
<span class="line"><span></span></span>
<span class="line"><span>第四阶段：规模化</span></span>
<span class="line"><span>→ 全量上线、持续优化</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="快速原型检查清单" tabindex="-1"><a class="header-anchor" href="#快速原型检查清单"><span>快速原型检查清单</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-python"><span class="line"><span style="color:#D19A66;">MVP_CHECKLIST</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">    &quot;核心功能&quot;</span><span style="color:#ABB2BF;">: [</span></span>
<span class="line"><span style="color:#98C379;">        &quot;能完成3个最核心的用例&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;错误时能优雅失败（不崩溃）&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;核心流程有简单日志&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">    ],</span></span>
<span class="line"><span style="color:#98C379;">    &quot;不需要做&quot;</span><span style="color:#ABB2BF;">: [</span></span>
<span class="line"><span style="color:#98C379;">        &quot;性能优化（延迟高一点没关系）&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;完整的错误处理&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;UI 美化&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;权限系统&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;99.9% 可用性&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">    ],</span></span>
<span class="line"><span style="color:#98C379;">    &quot;必须做（安全底线）&quot;</span><span style="color:#ABB2BF;">: [</span></span>
<span class="line"><span style="color:#98C379;">        &quot;不能泄露用户数据&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;不能执行危险操作（删除/发邮件）&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;输入长度限制（防止 token 爆炸）&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">    ],</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-评估指标设计" tabindex="-1"><a class="header-anchor" href="#_4-评估指标设计"><span>4. 评估指标设计</span></a></h2><p>在写代码前先定义&quot;成功条件&quot;，否则永远觉得再优化一下就好了。</p><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-python"><span class="line"><span style="color:#D19A66;">PROJECT_SUCCESS_METRICS</span><span style="color:#56B6C2;"> =</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">    # 客服机器人示例</span></span>
<span class="line"><span style="color:#98C379;">    &quot;客服解决率&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#98C379;">        &quot;定义&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;无需转人工，机器人独立解决的问题占比&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;基准&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0.0</span><span style="color:#ABB2BF;">,      </span><span style="color:#7F848E;font-style:italic;"># 现在全人工</span></span>
<span class="line"><span style="color:#98C379;">        &quot;目标&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0.6</span><span style="color:#ABB2BF;">,      </span><span style="color:#7F848E;font-style:italic;"># 60% 由机器人解决</span></span>
<span class="line"><span style="color:#98C379;">        &quot;测量方法&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;每周统计转人工率&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">    },</span></span>
<span class="line"><span style="color:#98C379;">    &quot;用户满意度&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#98C379;">        &quot;定义&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;用户对机器人回答的好评率&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;基准&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">None</span><span style="color:#ABB2BF;">,     </span><span style="color:#7F848E;font-style:italic;"># 无历史数据</span></span>
<span class="line"><span style="color:#98C379;">        &quot;目标&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0.8</span><span style="color:#ABB2BF;">,      </span><span style="color:#7F848E;font-style:italic;"># 80% 好评</span></span>
<span class="line"><span style="color:#98C379;">        &quot;测量方法&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;对话结束后 0/1 评分&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">    },</span></span>
<span class="line"><span style="color:#98C379;">    &quot;回复延迟&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#98C379;">        &quot;定义&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;P95 响应时间&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;基准&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">1.0</span><span style="color:#ABB2BF;">,      </span><span style="color:#7F848E;font-style:italic;"># 人工平均 1 分钟</span></span>
<span class="line"><span style="color:#98C379;">        &quot;目标&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">5.0</span><span style="color:#ABB2BF;">,      </span><span style="color:#7F848E;font-style:italic;"># 秒（机器人慢一点但24小时）</span></span>
<span class="line"><span style="color:#98C379;">        &quot;测量方法&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;接口监控&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">    },</span></span>
<span class="line"><span style="color:#98C379;">    &quot;幻觉率&quot;</span><span style="color:#ABB2BF;">: {</span></span>
<span class="line"><span style="color:#98C379;">        &quot;定义&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;答案包含明显错误信息的比例&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;基准&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">None</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">        &quot;目标&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0.05</span><span style="color:#ABB2BF;">,     </span><span style="color:#7F848E;font-style:italic;"># 不超过 5%</span></span>
<span class="line"><span style="color:#98C379;">        &quot;测量方法&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;每周人工抽查 50 条&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">    },</span></span>
<span class="line"><span style="color:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-风险管控" tabindex="-1"><a class="header-anchor" href="#_5-风险管控"><span>5. 风险管控</span></a></h2><h3 id="技术风险矩阵" tabindex="-1"><a class="header-anchor" href="#技术风险矩阵"><span>技术风险矩阵</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>                 高影响      低影响</span></span>
<span class="line"><span>高概率    ┌──────────┬──────────┐</span></span>
<span class="line"><span>         │  关键风险 │  需管控  │  </span></span>
<span class="line"><span>低概率    ├──────────┼──────────┤</span></span>
<span class="line"><span>         │  需监控  │  可接受  │</span></span>
<span class="line"><span>         └──────────┴──────────┘</span></span>
<span class="line"><span></span></span>
<span class="line"><span>关键风险（立即制定应对方案）：</span></span>
<span class="line"><span>- 模型效果不达预期（做早期技术验证）</span></span>
<span class="line"><span>- API 服务不可用（做多厂商 fallback）</span></span>
<span class="line"><span>- 成本超预算（做预算控制和告警）</span></span>
<span class="line"><span></span></span>
<span class="line"><span>需管控（制定降级方案）：</span></span>
<span class="line"><span>- 延迟高于预期（提前告知用户，做流式输出）</span></span>
<span class="line"><span>- 第三方 API 价格上涨（定期评估替代方案）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="降级方案" tabindex="-1"><a class="header-anchor" href="#降级方案"><span>降级方案</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-python"><span class="line"><span style="color:#C678DD;">class</span><span style="color:#E5C07B;"> GracefulDegradation</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;&quot;关键功能的降级策略&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    </span></span>
<span class="line"><span style="color:#C678DD;">    async</span><span style="color:#C678DD;"> def</span><span style="color:#61AFEF;"> rag_with_fallback</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;font-style:italic;">self</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;font-style:italic;">question</span><span style="color:#ABB2BF;">: </span><span style="color:#56B6C2;">str</span><span style="color:#ABB2BF;">) -&gt; </span><span style="color:#56B6C2;">dict</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 1. 尝试完整 RAG</span></span>
<span class="line"><span style="color:#C678DD;">        try</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#C678DD;"> await</span><span style="color:#E5C07B;"> self</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">full_rag</span><span style="color:#ABB2BF;">(question)</span></span>
<span class="line"><span style="color:#C678DD;">        except</span><span style="color:#ABB2BF;"> Exception </span><span style="color:#C678DD;">as</span><span style="color:#ABB2BF;"> e:</span></span>
<span class="line"><span style="color:#56B6C2;">            print</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">f</span><span style="color:#98C379;">&quot;RAG 失败，降级到关键词搜索: </span><span style="color:#D19A66;">{</span><span style="color:#ABB2BF;">e</span><span style="color:#D19A66;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 2. 降级到简单关键词搜索</span></span>
<span class="line"><span style="color:#C678DD;">        try</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#C678DD;"> await</span><span style="color:#E5C07B;"> self</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">keyword_search</span><span style="color:#ABB2BF;">(question)</span></span>
<span class="line"><span style="color:#C678DD;">        except</span><span style="color:#ABB2BF;"> Exception </span><span style="color:#C678DD;">as</span><span style="color:#ABB2BF;"> e:</span></span>
<span class="line"><span style="color:#56B6C2;">            print</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">f</span><span style="color:#98C379;">&quot;关键词搜索失败，降级到固定回答: </span><span style="color:#D19A66;">{</span><span style="color:#ABB2BF;">e</span><span style="color:#D19A66;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 3. 最终兜底</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">            &quot;answer&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;抱歉，系统暂时无法回答您的问题，请联系人工客服。&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#98C379;">            &quot;source&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&quot;fallback&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-上线后运营" tabindex="-1"><a class="header-anchor" href="#_6-上线后运营"><span>6. 上线后运营</span></a></h2><h3 id="反馈闭环设计" tabindex="-1"><a class="header-anchor" href="#反馈闭环设计"><span>反馈闭环设计</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>用户使用</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>收集反馈（评分/差评分类/对话日志）</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>每周数据分析（问题聚类）</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>找出 Top 5 失败模式</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>针对性优化（加数据/改Prompt/调参）</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>A/B 测试验证效果</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>上线新版本</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>重复迭代</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常见失败模式分析" tabindex="-1"><a class="header-anchor" href="#常见失败模式分析"><span>常见失败模式分析</span></a></h3><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-python"><span class="line"><span style="color:#C678DD;">class</span><span style="color:#E5C07B;"> FailureAnalyzer</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#C678DD;">    def</span><span style="color:#61AFEF;"> analyze</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;font-style:italic;">self</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;font-style:italic;">low_rating_conversations</span><span style="color:#ABB2BF;">: list[</span><span style="color:#56B6C2;">dict</span><span style="color:#ABB2BF;">]) -&gt; </span><span style="color:#56B6C2;">dict</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        &quot;&quot;&quot;分析低评分对话的失败模式&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        patterns </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">            &quot;no_answer&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">,       </span><span style="color:#7F848E;font-style:italic;"># 知识库无答案</span></span>
<span class="line"><span style="color:#98C379;">            &quot;wrong_answer&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">,    </span><span style="color:#7F848E;font-style:italic;"># 答案错误/幻觉</span></span>
<span class="line"><span style="color:#98C379;">            &quot;incomplete&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">,      </span><span style="color:#7F848E;font-style:italic;"># 答案不完整</span></span>
<span class="line"><span style="color:#98C379;">            &quot;off_topic&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">,       </span><span style="color:#7F848E;font-style:italic;"># 答非所问</span></span>
<span class="line"><span style="color:#98C379;">            &quot;too_long&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">,        </span><span style="color:#7F848E;font-style:italic;"># 废话太多</span></span>
<span class="line"><span style="color:#ABB2BF;">        }</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#ABB2BF;"> conv </span><span style="color:#C678DD;">in</span><span style="color:#ABB2BF;"> low_rating_conversations:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">            # 用 LLM 分析失败原因（快速）</span></span>
<span class="line"><span style="color:#ABB2BF;">            reason </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> classify_failure</span><span style="color:#ABB2BF;">(conv[</span><span style="color:#98C379;">&quot;question&quot;</span><span style="color:#ABB2BF;">], conv[</span><span style="color:#98C379;">&quot;answer&quot;</span><span style="color:#ABB2BF;">])</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> reason </span><span style="color:#C678DD;">in</span><span style="color:#ABB2BF;"> patterns:</span></span>
<span class="line"><span style="color:#ABB2BF;">                patterns[reason] </span><span style="color:#56B6C2;">+=</span><span style="color:#D19A66;"> 1</span></span>
<span class="line"><span style="color:#ABB2BF;">        </span></span>
<span class="line"><span style="color:#ABB2BF;">        total </span><span style="color:#56B6C2;">=</span><span style="color:#56B6C2;"> sum</span><span style="color:#ABB2BF;">(patterns.</span><span style="color:#61AFEF;">values</span><span style="color:#ABB2BF;">())</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> {k: </span><span style="color:#C678DD;">f</span><span style="color:#98C379;">&quot;</span><span style="color:#D19A66;">{</span><span style="color:#ABB2BF;">v</span><span style="color:#56B6C2;">/</span><span style="color:#ABB2BF;">total</span><span style="color:#C678DD;">:.1%</span><span style="color:#D19A66;">}</span><span style="color:#98C379;">&quot;</span><span style="color:#C678DD;"> for</span><span style="color:#ABB2BF;"> k, v </span><span style="color:#C678DD;">in</span><span style="color:#56B6C2;"> sorted</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#ABB2BF;">            patterns.</span><span style="color:#61AFEF;">items</span><span style="color:#ABB2BF;">(), </span><span style="color:#E06C75;font-style:italic;">key</span><span style="color:#56B6C2;">=</span><span style="color:#C678DD;">lambda</span><span style="color:#D19A66;font-style:italic;"> x</span><span style="color:#ABB2BF;">: </span><span style="color:#56B6C2;">-</span><span style="color:#ABB2BF;">x[</span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#ABB2BF;">        )}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例输出：</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># {&#39;no_answer&#39;: &#39;45%&#39;, &#39;wrong_answer&#39;: &#39;25%&#39;, &#39;incomplete&#39;: &#39;15%&#39;, ...}</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># → 45% 是知识库覆盖问题 → 优先补充知识库</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-技术选型决策树" tabindex="-1"><a class="header-anchor" href="#_7-技术选型决策树"><span>7. 技术选型决策树</span></a></h2><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>需要 AI 功能？</span></span>
<span class="line"><span>  ↓</span></span>
<span class="line"><span>能用规则/搜索解决吗？</span></span>
<span class="line"><span>  → 是 → 用规则/搜索（更可靠）</span></span>
<span class="line"><span>  → 否 ↓</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>知识会更新吗？</span></span>
<span class="line"><span>  → 频繁 → RAG + LLM</span></span>
<span class="line"><span>  → 稳定 → 考虑 Fine-tuning 或 RAG</span></span>
<span class="line"><span></span></span>
<span class="line"><span>数据量大吗（&gt;1万文档）？</span></span>
<span class="line"><span>  → 是 → Qdrant / Milvus</span></span>
<span class="line"><span>  → 否 → ChromaDB / PgVector</span></span>
<span class="line"><span></span></span>
<span class="line"><span>需要 Agent 自主决策吗？</span></span>
<span class="line"><span>  → 是 → LangGraph</span></span>
<span class="line"><span>  → 否 → 简单 Chain 即可</span></span>
<span class="line"><span></span></span>
<span class="line"><span>团队有 ML 经验吗？</span></span>
<span class="line"><span>  → 是 → 考虑自研模型</span></span>
<span class="line"><span>  → 否 → API 调用，控制风险</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="验收清单" tabindex="-1"><a class="header-anchor" href="#验收清单"><span>验收清单</span></a></h2><ul class="task-list-container"><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-0" disabled="disabled"><label class="task-list-item-label" for="task-item-0"> 在启动项目前能完成价值评估（预期 ROI 计算）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-1" disabled="disabled"><label class="task-list-item-label" for="task-item-1"> 能设计包含 4-5 个可量化指标的成功标准</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-2" disabled="disabled"><label class="task-list-item-label" for="task-item-2"> 能识别并列出项目的前 3 个关键风险及应对方案</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-3" disabled="disabled"><label class="task-list-item-label" for="task-item-3"> 能为核心功能设计降级方案（3 层 fallback）</label></li><li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-4" disabled="disabled"><label class="task-list-item-label" for="task-item-4"> 建立周度数据分析习惯，持续优化失败模式</label></li></ul>`,31)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};
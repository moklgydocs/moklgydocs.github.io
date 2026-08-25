import{O as e,d as t,p as n}from"./runtime-core.esm-bundler-jC72uHyJ.js";import{t as r}from"./app-fxBgVz1h.js";var i=JSON.parse(`{"path":"/%E4%BB%8E%E9%9B%B6%E6%9E%84%E5%BB%BA%E6%99%BA%E8%83%BD%E4%BD%93/16-%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1.html","title":"第十六章 毕业设计：构建属于你的多智能体应用","lang":"zh-CN","frontmatter":{},"git":{"createdTime":1787385570000,"updatedTime":1787396547000,"contributors":[{"name":"jackie.liu","username":"","email":"moklgy@foxmail.com","commits":2}]},"readingTime":{"minutes":20.69,"words":6208},"filePathRelative":"从零构建智能体/16-毕业设计.md"}`),a={name:`16-毕业设计.md`};function o(r,i,a,o,s,c){return e(),t(`div`,null,[...i[0]||=[n(`<blockquote><p>本文转载自 <a href="https://hello-agents.datawhale.cc/" target="_blank" rel="noopener noreferrer">Datawhale《从零开始构建智能体》(Hello-Agents)</a>,原文:<a href="https://github.com/datawhalechina/hello-agents/blob/main/docs/chapter16/%E7%AC%AC%E5%8D%81%E5%85%AD%E7%AB%A0%20%E6%AF%95%E4%B8%9A%E8%AE%BE%E8%AE%A1.md" target="_blank" rel="noopener noreferrer">https://github.com/datawhalechina/hello-agents/blob/main/docs/chapter16/第十六章 毕业设计.md</a>。著作权归 Datawhale 社区所有,采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a> 许可(署名-非商业性使用-相同方式共享),本站仅供个人学习使用。</p></blockquote><h1 id="第十六章-毕业设计-构建属于你的多智能体应用" tabindex="-1"><a class="header-anchor" href="#第十六章-毕业设计-构建属于你的多智能体应用"><span>第十六章 毕业设计：构建属于你的多智能体应用</span></a></h1><p>恭喜你来到 Hello-Agents 教程的最后一章！在前面的 15 章中，我们从零开始构建了 HelloAgents 框架，学习了智能体的核心概念、多种范式、工具系统、记忆机制、通信协议、强化学习训练和性能评估等知识。在第 13-15 章中，我们还通过三个完整的实战项目（智能旅行助手、自动化深度研究智能体、赛博小镇）展示了如何将所学知识融会贯通。</p><p>现在，是时候让你成为真正的智能体系统构建者了！本章将指导你<strong>构建属于你自己的多智能体应用</strong>，并通过开源协作的方式与社区分享你的成果。</p><h2 id="_16-1-毕业设计的意义" tabindex="-1"><a class="header-anchor" href="#_16-1-毕业设计的意义"><span>16.1 毕业设计的意义</span></a></h2><h3 id="_16-1-1-为什么要做毕业设计" tabindex="-1"><a class="header-anchor" href="#_16-1-1-为什么要做毕业设计"><span>16.1.1 为什么要做毕业设计</span></a></h3><p>学习技术最好的方式不是看教程，而是<strong>动手实践</strong>。通过前面章节的学习，你已经掌握了构建智能体系统的理论知识和技术工具。但是，真正的挑战在于：<strong>如何将这些知识应用到实际问题中？如何设计一个完整的系统？如何处理各种边界情况和异常？</strong></p><p>毕业设计的核心价值在于培养你的综合应用能力，将前面学到的所有知识（智能体范式、工具系统、记忆机制、通信协议等）选择性的整合到一个完整的项目中。</p><p>通过本章的学习和实践，希望你能够独立设计并实现一个完整的智能体应用，熟练使用 HelloAgents 框架的各种功能，掌握 Git 和 GitHub 的基本操作，学会编写清晰的项目文档，参与开源社区的协作开发，最终获得一个可以展示的技术作品。</p><h3 id="_16-1-2-毕业设计的形式" tabindex="-1"><a class="header-anchor" href="#_16-1-2-毕业设计的形式"><span>16.1.2 毕业设计的形式</span></a></h3><p>你的毕业设计将以<strong>开源项目</strong>的形式提交到 Hello-Agents 的共创项目仓库（<code>Co-creation-projects</code>目录）。具体要求如下：</p><ol><li><p><strong>项目命名</strong>：使用<code>{你的GitHub用户名}-{项目名称}</code>的格式，例如<code>jjyaoao-CodeReviewAgent</code></p></li><li><p><strong>项目内容</strong>：</p><ul><li>一个可运行的 Jupyter Notebook（<code>.ipynb</code>文件）或 Python 脚本</li><li>完整的依赖列表（<code>requirements.txt</code>）</li><li>清晰的 README 文档（<code>README.md</code>）</li><li>可选：演示视频、截图、数据集等</li></ul></li><li><p><strong>提交方式</strong>：通过 GitHub 的 Pull Request（PR）提交</p></li><li><p><strong>评审流程</strong>：社区成员会 review 你的代码，提出改进建议，通过后合并到主仓库</p></li></ol><h2 id="_16-2-项目选题指南" tabindex="-1"><a class="header-anchor" href="#_16-2-项目选题指南"><span>16.2 项目选题指南</span></a></h2><h3 id="_16-2-1-选题原则" tabindex="-1"><a class="header-anchor" href="#_16-2-1-选题原则"><span>16.2.1 选题原则</span></a></h3><p>一个好的毕业设计项目应该具有实用性，解决真实的问题而不是为了技术而技术，我们需要追求在有限的时间和资源内可以完成，并且能够清晰地展示你的技术能力。</p><h3 id="_16-2-2-推荐选题方向" tabindex="-1"><a class="header-anchor" href="#_16-2-2-推荐选题方向"><span>16.2.2 推荐选题方向</span></a></h3><p>以下是一些推荐的项目方向，你可以选择其中一个，也可以自己提出新的想法：</p><p><strong>（1）生产力工具类</strong></p><ul><li><strong>智能代码审查助手</strong>：自动分析代码质量、发现潜在 bug、提出优化建议</li><li><strong>智能文档生成器</strong>：根据代码自动生成 API 文档、用户手册</li><li><strong>智能会议助手</strong>：记录会议内容、生成会议纪要、提取行动项</li><li><strong>智能邮件助手</strong>：自动分类邮件、生成回复草稿、提醒重要事项</li></ul><p><strong>（2）学习辅助类</strong></p><ul><li><strong>智能学习伙伴</strong>：根据学习进度推荐学习资源、生成练习题、答疑解惑</li><li><strong>智能论文助手</strong>：帮助查找文献、总结论文、生成引用</li><li><strong>智能编程导师</strong>：提供编程练习、代码 review、学习路径规划</li><li><strong>智能语言学习助手</strong>：提供对话练习、语法纠错、词汇扩展</li></ul><p><strong>（3）创意娱乐类</strong></p><ul><li><strong>智能故事生成器</strong>：根据用户输入生成小说、剧本、诗歌</li><li><strong>智能游戏 NPC</strong>：创建有个性的游戏角色，能够与玩家自然对话</li><li><strong>智能音乐推荐</strong>：根据心情、场景推荐音乐，生成播放列表</li><li><strong>智能菜谱助手</strong>：根据食材、口味推荐菜谱，生成购物清单</li></ul><p><strong>（4）数据分析类</strong></p><ul><li><strong>智能数据分析师</strong>：自动分析数据、生成可视化图表、撰写分析报告</li><li><strong>智能股票分析</strong>：分析股票数据、新闻舆情，提供投资建议</li><li><strong>智能舆情监控</strong>：监控社交媒体、新闻网站，分析舆情趋势</li><li><strong>智能竞品分析</strong>：收集竞品信息、对比分析、生成报告</li></ul><p><strong>（5）生活服务类</strong></p><ul><li><strong>智能健康助手</strong>：记录健康数据、提供健康建议、制定运动计划</li><li><strong>智能理财助手</strong>：记录收支、分析消费习惯、提供理财建议</li><li><strong>智能购物助手</strong>：比价、推荐商品、生成购物清单</li><li><strong>智能家居控制</strong>：通过自然语言控制智能家居设备</li></ul><h3 id="_16-2-3-选题示例" tabindex="-1"><a class="header-anchor" href="#_16-2-3-选题示例"><span>16.2.3 选题示例</span></a></h3><p>让我们通过一个具体的例子来说明如何选题和设计项目。</p><p><strong>项目名称</strong>：智能代码审查助手（CodeReviewAgent）</p><p><strong>问题分析</strong>：代码审查是软件开发中的重要环节，但人工审查耗时且容易遗漏问题。现有的静态分析工具只能发现语法错误，无法理解代码逻辑，因此需要一个能够理解代码语义、提供深度分析的智能助手。</p><p><strong>核心功能</strong>：该项目将实现代码质量分析（检查代码风格、命名规范、注释完整性）、潜在 bug 检测（发现逻辑错误、边界条件问题、资源泄漏）、性能优化建议（识别性能瓶颈、提出优化方案）、安全漏洞扫描（检测 SQL 注入、XSS 等安全问题）以及最佳实践推荐（根据语言特性和设计模式提出改进建议）。</p><p><strong>预期成果</strong>：最终将交付一个可运行的 Jupyter Notebook 展示完整的审查流程，支持 Python、JavaScript 等主流语言，能够生成结构化的 Markdown 格式审查报告，并提供具体的代码示例和改进建议。</p><h2 id="_16-3-开发环境准备" tabindex="-1"><a class="header-anchor" href="#_16-3-开发环境准备"><span>16.3 开发环境准备</span></a></h2><h3 id="_16-3-1-安装必要工具" tabindex="-1"><a class="header-anchor" href="#_16-3-1-安装必要工具"><span>16.3.1 安装必要工具</span></a></h3><p>在开始开发之前，请确保你的开发环境已经安装了以下工具：</p><p><strong>（1）Python 环境</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装HelloAgents</span></span>
<span class="line"><span style="color:#61AFEF;">pip</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> &quot;hello-agents[all]&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>（2）Git 和 GitHub</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 检查Git版本</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#D19A66;"> --version</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置Git用户信息</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> config</span><span style="color:#D19A66;"> --global</span><span style="color:#98C379;"> user.name</span><span style="color:#98C379;"> &quot;你的名字&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> config</span><span style="color:#D19A66;"> --global</span><span style="color:#98C379;"> user.email</span><span style="color:#98C379;"> &quot;你的邮箱&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 配置GitHub SSH密钥（推荐）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 生成SSH密钥</span></span>
<span class="line"><span style="color:#61AFEF;">ssh-keygen</span><span style="color:#D19A66;"> -t</span><span style="color:#98C379;"> ed25519</span><span style="color:#D19A66;"> -C</span><span style="color:#98C379;"> &quot;你的邮箱&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 将公钥添加到GitHub</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 复制 ~/.ssh/id_ed25519.pub 的内容</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 在GitHub Settings &gt; SSH and GPG keys 中添加</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 测试连接</span></span>
<span class="line"><span style="color:#61AFEF;">ssh</span><span style="color:#D19A66;"> -T</span><span style="color:#98C379;"> git@github.com</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>（3）Jupyter Notebook</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 安装Jupyter</span></span>
<span class="line"><span style="color:#61AFEF;">pip</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> jupyter</span><span style="color:#98C379;"> notebook</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者使用JupyterLab（推荐）</span></span>
<span class="line"><span style="color:#61AFEF;">pip</span><span style="color:#98C379;"> install</span><span style="color:#98C379;"> jupyterlab</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 启动Jupyter</span></span>
<span class="line"><span style="color:#61AFEF;">jupyter</span><span style="color:#98C379;"> lab</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-3-2-fork-项目仓库" tabindex="-1"><a class="header-anchor" href="#_16-3-2-fork-项目仓库"><span>16.3.2 Fork 项目仓库</span></a></h3><p><strong>步骤 1：Fork 仓库</strong></p><ol><li>访问 Hello-Agents 仓库：<a href="https://github.com/datawhalechina/hello-agents" target="_blank" rel="noopener noreferrer">https://github.com/datawhalechina/hello-agents</a></li><li>点击右上角的&quot;Fork&quot;按钮，如图 16.1 红色方框位置</li><li>选择你的 GitHub 账号，创建 Fork</li></ol><div align="center"><img src="/hello-agents/images/16-figures/16-1.png" alt="" width="85%"><p>图 16.1 Fork 仓库步骤</p></div><p><strong>步骤 2：克隆到本地</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 如图16.2所示，克隆你Fork的仓库</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> clone</span><span style="color:#98C379;"> git@github.com:你的用户名/hello-agents.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 进入项目目录</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> Hello-Agents</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加上游仓库（用于同步更新）</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> remote</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> upstream</span><span style="color:#98C379;"> https://github.com/datawhalechina/hello-agents.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 查看远程仓库</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> remote</span><span style="color:#D19A66;"> -v</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div align="center"><img src="/hello-agents/images/16-figures/16-2.png" alt="" width="85%"><p>图 16.2 克隆仓库到本地</p></div><p><strong>步骤 3：创建开发分支</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 创建并切换到新分支</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> checkout</span><span style="color:#D19A66;"> -b</span><span style="color:#98C379;"> feature/你的项目名称</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 例如:</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> checkout</span><span style="color:#D19A66;"> -b</span><span style="color:#98C379;"> feature/code-review-agent</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-3-3-项目目录结构" tabindex="-1"><a class="header-anchor" href="#_16-3-3-项目目录结构"><span>16.3.3 项目目录结构</span></a></h3><p>在<code>Co-creation-projects</code>目录下创建你的项目文件夹：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 进入共创项目目录</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> Co-creation-projects</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建项目文件夹（格式:GitHub用户名-项目名称）</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#98C379;"> 你的用户名-项目名称</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 例如:</span></span>
<span class="line"><span style="color:#61AFEF;">mkdir</span><span style="color:#98C379;"> jjyaoao-CodeReviewAgent</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 进入项目目录</span></span>
<span class="line"><span style="color:#56B6C2;">cd</span><span style="color:#98C379;"> jjyaoao-CodeReviewAgent</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>推荐的项目结构：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>jjyaoao-CodeReviewAgent/</span></span>
<span class="line"><span>├── README.md              # 项目说明文档</span></span>
<span class="line"><span>├── requirements.txt       # Python依赖列表</span></span>
<span class="line"><span>├── main.ipynb            # 主要的Jupyter Notebook</span></span>
<span class="line"><span>├── data/                 # 数据文件（可选）</span></span>
<span class="line"><span>│   ├── sample_code.py</span></span>
<span class="line"><span>│   └── test_cases.json</span></span>
<span class="line"><span>├── outputs/              # 输出结果（可选）</span></span>
<span class="line"><span>│   ├── review_report.md</span></span>
<span class="line"><span>│   └── screenshots/</span></span>
<span class="line"><span>├── src/                  # 源代码（可选，如果代码较多）</span></span>
<span class="line"><span>│   ├── agents/</span></span>
<span class="line"><span>│   ├── tools/</span></span>
<span class="line"><span>│   └── utils/</span></span>
<span class="line"><span>└──</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_16-4-项目开发指南" tabindex="-1"><a class="header-anchor" href="#_16-4-项目开发指南"><span>16.4 项目开发指南</span></a></h2><h3 id="_16-4-1-编写-readme-文档" tabindex="-1"><a class="header-anchor" href="#_16-4-1-编写-readme-文档"><span>16.4.1 编写 README 文档</span></a></h3><p>README 是项目的门面，一个好的 README 应该包含以下内容：</p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-markdown"><span class="line"><span style="color:#E06C75;"># 项目名称</span></span>
<span class="line"></span>
<span class="line"><span style="color:#5C6370;">&gt; 一句话描述你的项目</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 📝 项目简介</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">详细介绍你的项目:</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 解决什么问题？</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 有什么特色功能？</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 适用于什么场景？</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## ✨ 核心功能</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 功能1:描述</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 功能2:描述</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 功能3:描述</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🛠️ 技术栈</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> HelloAgents框架</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 使用的智能体范式（如ReAct、Plan-and-Solve等）</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 使用的工具和API</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 其他依赖库</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🚀 快速开始</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 环境要求</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> Python 3.10+</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 其他要求</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 安装依赖</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">pip install -r requirements.txt</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 配置API密钥</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;"># 创建.env文件</span></span>
<span class="line"><span style="color:#ABB2BF;">cp .env.example .env</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;"># 编辑.env文件，填入你的API密钥</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 运行项目</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;"># 启动Jupyter Notebook</span></span>
<span class="line"><span style="color:#ABB2BF;">jupyter lab</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;"># 打开main.ipynb并运行</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 📖 使用示例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">展示如何使用你的项目，最好包含代码示例和运行结果。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🎯 项目亮点</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 亮点1:说明</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 亮点2:说明</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 亮点3:说明</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 📊 性能评估</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">如果有评估结果，展示在这里:</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 准确率:XX%</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 响应时间:XX秒</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 其他指标</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🔮 未来计划</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 待实现的功能1</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 待实现的功能2</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 待优化的部分</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🤝 贡献指南</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">欢迎提出Issue和Pull Request！</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 📄 许可证</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">MIT License</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 👤 作者</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> GitHub: [</span><span style="color:#61AFEF;">@你的用户名</span><span style="color:#ABB2BF;">]</span><span style="color:#E06C75;">(</span><span style="color:#C678DD;text-decoration:underline;">https://github.com/你的用户名</span><span style="color:#E06C75;">)</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> Email: 你的邮箱（可选）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🙏 致谢</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">感谢Datawhale社区和Hello-Agents项目！</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-4-2-编写-requirements-txt" tabindex="-1"><a class="header-anchor" href="#_16-4-2-编写-requirements-txt"><span>16.4.2 编写 requirements.txt</span></a></h3><p>列出项目所需的所有 Python 依赖：</p><div class="language-txt line-numbers-mode" data-highlighter="shiki" data-ext="txt" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-txt"><span class="line"><span># 核心依赖</span></span>
<span class="line"><span>hello-agents[all]&gt;=0.2.7</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 可视化（如果需要）</span></span>
<span class="line"><span>matplotlib&gt;=3.7.0</span></span>
<span class="line"><span>plotly&gt;=5.14.0</span></span>
<span class="line"><span></span></span>
<span class="line"><span># Web框架（如果需要）</span></span>
<span class="line"><span>fastapi&gt;=0.109.0</span></span>
<span class="line"><span>uvicorn&gt;=0.27.0</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-4-3-开发-jupyter-notebook" tabindex="-1"><a class="header-anchor" href="#_16-4-3-开发-jupyter-notebook"><span>16.4.3 开发 Jupyter Notebook</span></a></h3><p><strong>（1）Notebook 结构建议</strong></p><p>一个好的 Jupyter Notebook 应该包含以下部分：</p><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-python"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第1部分:项目介绍</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#98C379;"># 项目名称</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">## 项目简介</span></span>
<span class="line"><span style="color:#98C379;">简要介绍项目的目标和功能</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">## 作者信息</span></span>
<span class="line"><span style="color:#98C379;">- 姓名:</span><span style="color:#C678DD;">XXX</span></span>
<span class="line"><span style="color:#98C379;">- GitHub:@</span><span style="color:#C678DD;">XXX</span></span>
<span class="line"><span style="color:#98C379;">- 日期:2025-XX-XX</span></span>
<span class="line"><span style="color:#98C379;">&quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第2部分:环境配置</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 安装依赖</span></span>
<span class="line"><span style="color:#FFFFFF;">!</span><span style="color:#ABB2BF;">pip install </span><span style="color:#56B6C2;">-</span><span style="color:#ABB2BF;">q hello</span><span style="color:#56B6C2;">-</span><span style="color:#ABB2BF;">agents[</span><span style="color:#56B6C2;">all</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 导入必要的库</span></span>
<span class="line"><span style="color:#C678DD;">from</span><span style="color:#ABB2BF;"> hello_agents </span><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> SimpleAgent, HelloAgentsLLM</span></span>
<span class="line"><span style="color:#C678DD;">from</span><span style="color:#ABB2BF;"> hello_agents.tools </span><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> BaseTool</span></span>
<span class="line"><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> os</span></span>
<span class="line"><span style="color:#C678DD;">from</span><span style="color:#ABB2BF;"> dotenv </span><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> load_dotenv</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 加载环境变量</span></span>
<span class="line"><span style="color:#61AFEF;">load_dotenv</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第3部分:工具定义</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">class</span><span style="color:#E5C07B;"> CustomTool</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">BaseTool</span><span style="color:#ABB2BF;">):</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;&quot;自定义工具类&quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">    name </span><span style="color:#56B6C2;">=</span><span style="color:#98C379;"> &quot;tool_name&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">    description </span><span style="color:#56B6C2;">=</span><span style="color:#98C379;"> &quot;工具描述&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    def</span><span style="color:#61AFEF;"> run</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;font-style:italic;">self</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;font-style:italic;">query</span><span style="color:#ABB2BF;">: </span><span style="color:#56B6C2;">str</span><span style="color:#ABB2BF;">) -&gt; </span><span style="color:#56B6C2;">str</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        &quot;&quot;&quot;工具执行逻辑&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">        # 实现你的工具逻辑</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#98C379;"> &quot;结果&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第4部分:智能体构建</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建LLM</span></span>
<span class="line"><span style="color:#ABB2BF;">llm </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> HelloAgentsLLM</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建智能体</span></span>
<span class="line"><span style="color:#ABB2BF;">agent </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> SimpleAgent</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">    name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;智能体名称&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">    llm</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">llm,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">    system_prompt</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;系统提示词&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 添加工具</span></span>
<span class="line"><span style="color:#ABB2BF;">agent.</span><span style="color:#61AFEF;">add_tool</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">CustomTool</span><span style="color:#ABB2BF;">())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第5部分:功能演示</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例1:基础功能</span></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;=== 示例1:基础功能 ===&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">result </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> agent.</span><span style="color:#61AFEF;">run</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;用户输入&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(result)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 示例2:复杂场景</span></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">=== 示例2:复杂场景 ===&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">result </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> agent.</span><span style="color:#61AFEF;">run</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;复杂的用户输入&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(result)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第6部分:性能评估（可选）</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 评估代码</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ...</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 第7部分:总结与展望</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#98C379;">## 项目总结</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">### 实现的功能</span></span>
<span class="line"><span style="color:#98C379;">- 功能1</span></span>
<span class="line"><span style="color:#98C379;">- 功能2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">### 遇到的挑战</span></span>
<span class="line"><span style="color:#98C379;">- 挑战1及解决方案</span></span>
<span class="line"><span style="color:#98C379;">- 挑战2及解决方案</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">### 未来改进方向</span></span>
<span class="line"><span style="color:#98C379;">- 改进1</span></span>
<span class="line"><span style="color:#98C379;">- 改进2</span></span>
<span class="line"><span style="color:#98C379;">&quot;&quot;&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-4-4-测试你的项目" tabindex="-1"><a class="header-anchor" href="#_16-4-4-测试你的项目"><span>16.4.4 测试你的项目</span></a></h3><p>在提交之前，可以使用测试清单来判断自己的项目是否满足提交要求：</p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-markdown"><span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 代码能够正常运行，没有报错</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] README文档完整，说明清晰</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] requirements.txt包含所有依赖</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 有清晰的使用示例</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 代码有适当的注释</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 输出结果符合预期</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 处理了常见的异常情况</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 项目结构清晰，文件命名规范</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 大文件已妥善处理（见下节）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-4-5-大文件处理指南" tabindex="-1"><a class="header-anchor" href="#_16-4-5-大文件处理指南"><span>16.4.5 大文件处理指南</span></a></h3><p><strong>⚠️ 重要：避免主仓库过大</strong></p><p>为了保持 Hello-Agents 主仓库的轻量化，请遵循以下大文件处理规范：</p><p><strong>（1）文件大小限制</strong></p><ul><li><strong>项目总大小</strong>： 不超过 5MB</li><li><strong>禁止直接提交</strong>： 视频文件、大型数据集、模型文件</li></ul><p><strong>（2）大文件处理方案</strong></p><p>如果你的项目包含大文件（数据集、视频、模型等），请使用以下方案：</p><p><strong>方案 1：使用外部链接（推荐）</strong></p><p>将大文件上传到外部平台，在 README 中提供下载链接：</p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-markdown"><span class="line"><span style="color:#E06C75;">## 数据集</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">本项目使用的数据集较大，请从以下链接下载:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 数据集1: [</span><span style="color:#61AFEF;">百度网盘</span><span style="color:#ABB2BF;">]</span><span style="color:#E06C75;">(</span><span style="color:#C678DD;text-decoration:underline;">链接</span><span style="color:#E06C75;">)</span><span style="color:#ABB2BF;"> 提取码: xxxx</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 数据集2: [</span><span style="color:#61AFEF;">Google Drive</span><span style="color:#ABB2BF;">]</span><span style="color:#E06C75;">(</span><span style="color:#C678DD;text-decoration:underline;">链接</span><span style="color:#E06C75;">)</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 演示视频: [</span><span style="color:#61AFEF;">B站</span><span style="color:#ABB2BF;">]</span><span style="color:#E06C75;">(</span><span style="color:#C678DD;text-decoration:underline;">链接</span><span style="color:#E06C75;">)</span><span style="color:#ABB2BF;"> / [</span><span style="color:#61AFEF;">YouTube</span><span style="color:#ABB2BF;">]</span><span style="color:#E06C75;">(</span><span style="color:#C678DD;text-decoration:underline;">链接</span><span style="color:#E06C75;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>推荐的外部平台：</p><ul><li><strong>数据集</strong>： 百度网盘、Google Drive、Kaggle、HuggingFace Datasets</li><li><strong>视频</strong>： B 站、YouTube、腾讯视频</li><li><strong>模型</strong>： HuggingFace Models、ModelScope</li><li><strong>图片</strong>： GitHub Issues、图床服务</li></ul><p><strong>方案 2：创建独立仓库</strong></p><p>如果项目资源较多，建议创建独立的数据仓库：</p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-markdown"><span class="line"><span style="color:#E06C75;">## 项目资源</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">由于项目包含大量数据和演示资源，已单独创建资源仓库:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 资源仓库: https://github.com/你的用户名/项目名称-resources</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 包含内容: 数据集、演示视频、模型文件、测试数据等</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 使用方法</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">\\\`\\\`\\\`</span><span style="color:#ABB2BF;">bash</span></span>
<span class="line"><span style="color:#E06C75;"># 克隆资源仓库</span></span>
<span class="line"><span style="color:#ABB2BF;">git clone https://github.com/你的用户名/项目名称-resources.git</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;"># 将数据放到项目目录</span></span>
<span class="line"><span style="color:#ABB2BF;">cp -r 项目名称-resources/data ./data</span></span>
<span class="line"><span style="color:#56B6C2;">\\\`\\\`\\\`</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>方案 3：使用示例数据</strong></p><p>在主仓库中只提供小规模的示例数据：</p><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-python"><span class="line"><span style="color:#7F848E;font-style:italic;"># 在README中说明</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;">## 数据说明</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">-</span><span style="color:#FFFFFF;"> \`data</span><span style="color:#56B6C2;">/</span><span style="color:#FFFFFF;">sample</span><span style="color:#ABB2BF;">.</span><span style="color:#FFFFFF;">csv\`</span><span style="color:#ABB2BF;">: 示例数据（</span><span style="color:#FFFFFF;">100条记录</span><span style="color:#ABB2BF;">）</span></span>
<span class="line"><span style="color:#56B6C2;">-</span><span style="color:#ABB2BF;"> 完整数据集（</span><span style="color:#FFFFFF;">10万条记录</span><span style="color:#ABB2BF;">）请从[这里](链接)下载</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>（3）最佳实践示例</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>你的用户名-项目名称/</span></span>
<span class="line"><span>├── README.md              # 包含外部资源链接</span></span>
<span class="line"><span>├── requirements.txt</span></span>
<span class="line"><span>├── main.ipynb</span></span>
<span class="line"><span>├── .gitignore            # 忽略大文件</span></span>
<span class="line"><span>├── data/</span></span>
<span class="line"><span>│   └── sample.csv        # 仅示例数据（&lt;1MB）</span></span>
<span class="line"><span>└── outputs/</span></span>
<span class="line"><span>    └── demo_result.png   # 仅演示结果（&lt;1MB）</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>README 中的说明：</p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-markdown"><span class="line"><span style="color:#E06C75;">## 数据和资源</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 示例数据</span></span>
<span class="line"><span style="color:#ABB2BF;">项目包含小规模示例数据用于快速测试（位于</span><span style="color:#E5C07B;">\`</span><span style="color:#98C379;">data/sample.csv</span><span style="color:#E5C07B;">\`</span><span style="color:#ABB2BF;">）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 完整数据集</span></span>
<span class="line"><span style="color:#ABB2BF;">完整数据集（500MB）请从以下链接下载:</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 百度网盘: [</span><span style="color:#61AFEF;">链接</span><span style="color:#ABB2BF;">] 提取码: xxxx</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 下载后解压到</span><span style="color:#E5C07B;">\`</span><span style="color:#98C379;">data/</span><span style="color:#E5C07B;">\`</span><span style="color:#ABB2BF;">目录</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 演示视频</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> B站: [</span><span style="color:#61AFEF;">项目演示视频</span><span style="color:#ABB2BF;">]</span><span style="color:#E06C75;">(</span><span style="color:#C678DD;text-decoration:underline;">链接</span><span style="color:#E06C75;">)</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> YouTube: [</span><span style="color:#61AFEF;">Demo Video</span><span style="color:#ABB2BF;">]</span><span style="color:#E06C75;">(</span><span style="color:#C678DD;text-decoration:underline;">链接</span><span style="color:#E06C75;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_16-5-提交-pull-request" tabindex="-1"><a class="header-anchor" href="#_16-5-提交-pull-request"><span>16.5 提交 Pull Request</span></a></h2><h3 id="_16-5-1-提交代码到-github" tabindex="-1"><a class="header-anchor" href="#_16-5-1-提交代码到-github"><span>16.5.1 提交代码到 GitHub</span></a></h3><p><strong>步骤 1：检查修改</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 查看修改的文件</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> status</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>步骤 2：添加文件</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 添加所有修改的文件</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> .</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 或者添加特定文件</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> Co-creation-projects/你的用户名-项目名称/</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>步骤 3：提交修改</strong></p><p>提交信息应遵循以下格式：</p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 格式:类型: 简短描述</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> commit</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> &quot;feat: 添加XXX毕业设计项目&quot;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>提交类型规范：</strong></p><ul><li><code>feat</code>： 新增功能或项目（毕业设计项目使用此类型）</li><li><code>fix</code>： 修复 bug</li><li><code>docs</code>： 文档更新</li><li><code>style</code>： 代码格式调整（不影响功能）</li><li><code>refactor</code>： 代码重构</li><li><code>test</code>： 测试相关</li><li><code>chore</code>： 其他修改（如依赖更新）</li></ul><p><strong>步骤 4：推送到 GitHub</strong></p><div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#7F848E;font-style:italic;"># 推送到你的Fork仓库</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> push</span><span style="color:#98C379;"> origin</span><span style="color:#98C379;"> feature/你的项目名称</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_16-5-2-创建-pull-request" tabindex="-1"><a class="header-anchor" href="#_16-5-2-创建-pull-request"><span>16.5.2 创建 Pull Request</span></a></h3><p><strong>步骤 1：访问 GitHub</strong></p><ol><li>访问你 Fork 的仓库：<code>https://github.com/你的用户名/hello-agents</code></li><li>点击&quot;Pull requests&quot;标签，如图 16.3 所示</li><li>点击&quot;New pull request&quot;按钮</li></ol><div align="center"><img src="/hello-agents/images/16-figures/16-3.png" alt="" width="85%"><p>图 16.3 创建 Pull Request</p></div><p><strong>步骤 2：选择分支</strong></p><ul><li>Base repository： <code>datawhalechina/hello-agents</code></li><li>Base branch： <code>main</code></li><li>Head repository： <code>你的用户名/hello-agents</code></li><li>Compare branch： <code>feature/你的项目名称</code></li></ul><p><strong>步骤 3：填写 PR 信息</strong></p><p><strong>⚠️ 重要：PR 标题统一格式</strong></p><p>为了便于管理和检索，所有毕业设计项目的 PR 标题必须遵循以下格式：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>[毕业设计] 项目名称 - 简短描述</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>示例：</p><ul><li><code>[毕业设计] CodeReviewAgent - 智能代码审查助手</code></li><li><code>[毕业设计] StudyBuddy - AI学习伙伴</code></li><li><code>[毕业设计] DataAnalyst - 智能数据分析师</code></li></ul><p><strong>PR 描述模板：</strong></p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-markdown"><span class="line"><span style="color:#E06C75;">## 项目信息</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **项目名称**</span><span style="color:#ABB2BF;">:XXX</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **作者**</span><span style="color:#ABB2BF;">:@你的用户名</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **项目类型**</span><span style="color:#ABB2BF;">:生产力工具/学习辅助/创意娱乐/数据分析/生活服务</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 项目简介</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">简要描述你的项目（2-3句话）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 核心功能</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 功能1</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 功能2</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 功能3</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 技术亮点</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 使用了XXX范式</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 实现了XXX功能</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 优化了XXX性能</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 演示效果</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">（可选）添加截图或GIF展示项目效果</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 自检清单</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 代码能够正常运行</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] README文档完整</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] requirements.txt完整</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 有清晰的使用示例</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> [ ] 代码有适当的注释</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 其他说明</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">（可选）其他需要说明的内容</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>步骤 4：提交 PR</strong></p><p>如图 16.4 所示，点击&quot;Create pull request&quot;按钮提交。</p><div align="center"><img src="/hello-agents/images/16-figures/16-4.png" alt="" width="85%"><p>图 16.4 提交 Pull Request</p></div><h3 id="_16-5-3-响应-review-意见" tabindex="-1"><a class="header-anchor" href="#_16-5-3-响应-review-意见"><span>16.5.3 响应 Review 意见</span></a></h3><p>提交 PR 后，社区成员会 review 你的代码并提出建议。请及时响应：</p><ol><li><strong>查看评论</strong>：在 PR 页面查看 reviewer 的评论</li><li><strong>修改代码</strong>：根据建议修改代码</li><li><strong>提交更新</strong>：<div class="language-bash line-numbers-mode" data-highlighter="shiki" data-ext="bash" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-bash"><span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> add</span><span style="color:#98C379;"> .</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> commit</span><span style="color:#D19A66;"> -m</span><span style="color:#98C379;"> &quot;fix: 根据review意见修改XXX&quot;</span></span>
<span class="line"><span style="color:#61AFEF;">git</span><span style="color:#98C379;"> push</span><span style="color:#98C379;"> origin</span><span style="color:#98C379;"> feature/你的项目名称</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><strong>回复评论</strong>：在 GitHub 上回复 reviewer，说明你的修改</li></ol><h2 id="_16-6-示例项目展示" tabindex="-1"><a class="header-anchor" href="#_16-6-示例项目展示"><span>16.6 示例项目展示</span></a></h2><p>为了帮助你更好地理解毕业设计的要求，这里展示一个完整的示例项目，请别担心，小的创意同样可以被收录，只要是自己动手的作品都是值得珍惜的。</p><p><strong>项目信息</strong></p><ul><li><strong>项目名称</strong>：CodeReviewAgent</li><li><strong>作者</strong>：@jjyaoao</li><li><strong>项目路径</strong>：<code>Co-creation-projects/jjyaoao-CodeReviewAgent/</code></li></ul><p><strong>项目结构</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-"><span class="line"><span>jjyaoao-CodeReviewAgent/</span></span>
<span class="line"><span>├── README.md              # 项目文档</span></span>
<span class="line"><span>├── requirements.txt       # 依赖列表</span></span>
<span class="line"><span>├── main.ipynb            # 主程序(含快速演示和完整功能)</span></span>
<span class="line"><span>├── .env.example          # 环境变量示例</span></span>
<span class="line"><span>├── .gitignore            # Git忽略规则</span></span>
<span class="line"><span>├── data/</span></span>
<span class="line"><span>│   └── sample_code.py    # 示例代码</span></span>
<span class="line"><span>└── outputs/</span></span>
<span class="line"><span>    └── review_report.md  # 示例报告</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>核心代码片段（main.ipynb）</strong></p><div class="language-python line-numbers-mode" data-highlighter="shiki" data-ext="python" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-python"><span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 智能代码审查助手</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">from</span><span style="color:#ABB2BF;"> hello_agents </span><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> SimpleAgent, HelloAgentsLLM, ToolRegistry</span></span>
<span class="line"><span style="color:#C678DD;">from</span><span style="color:#ABB2BF;"> hello_agents.tools </span><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> Tool, ToolParameter</span></span>
<span class="line"><span style="color:#C678DD;">from</span><span style="color:#ABB2BF;"> typing </span><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> Dict, Any, List</span></span>
<span class="line"><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> ast</span></span>
<span class="line"><span style="color:#C678DD;">import</span><span style="color:#ABB2BF;"> os</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 0. 配置LLM参数</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">os.environ[</span><span style="color:#98C379;">&quot;LLM_MODEL_ID&quot;</span><span style="color:#ABB2BF;">] </span><span style="color:#56B6C2;">=</span><span style="color:#98C379;"> &quot;Qwen/Qwen2.5-72B-Instruct&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">os.environ[</span><span style="color:#98C379;">&quot;LLM_API_KEY&quot;</span><span style="color:#ABB2BF;">] </span><span style="color:#56B6C2;">=</span><span style="color:#98C379;"> &quot;your_api_key_here&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">os.environ[</span><span style="color:#98C379;">&quot;LLM_BASE_URL&quot;</span><span style="color:#ABB2BF;">] </span><span style="color:#56B6C2;">=</span><span style="color:#98C379;"> &quot;https://api-inference.modelscope.cn/v1/&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">os.environ[</span><span style="color:#98C379;">&quot;LLM_TIMEOUT&quot;</span><span style="color:#ABB2BF;">] </span><span style="color:#56B6C2;">=</span><span style="color:#98C379;"> &quot;60&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 1. 定义代码分析工具</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">class</span><span style="color:#E5C07B;"> CodeAnalysisTool</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Tool</span><span style="color:#ABB2BF;">):</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;&quot;代码静态分析工具&quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    def</span><span style="color:#56B6C2;"> __init__</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;font-style:italic;">self</span><span style="color:#ABB2BF;">):</span></span>
<span class="line"><span style="color:#56B6C2;">        super</span><span style="color:#ABB2BF;">().</span><span style="color:#56B6C2;">__init__</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">            name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;code_analysis&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">            description</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;分析Python代码的结构、复杂度和潜在问题&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        )</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    def</span><span style="color:#61AFEF;"> run</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;font-style:italic;">self</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;font-style:italic;">parameters</span><span style="color:#ABB2BF;">: Dict[</span><span style="color:#56B6C2;">str</span><span style="color:#ABB2BF;">, Any]) -&gt; </span><span style="color:#56B6C2;">str</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        &quot;&quot;&quot;分析代码并返回结果&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        code </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> parameters.</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;code&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#C678DD;"> not</span><span style="color:#ABB2BF;"> code:</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#98C379;"> &quot;错误:代码不能为空&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        try</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">            tree </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> ast.</span><span style="color:#61AFEF;">parse</span><span style="color:#ABB2BF;">(code)</span></span>
<span class="line"><span style="color:#ABB2BF;">            functions </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> [node </span><span style="color:#C678DD;">for</span><span style="color:#ABB2BF;"> node </span><span style="color:#C678DD;">in</span><span style="color:#ABB2BF;"> ast.</span><span style="color:#61AFEF;">walk</span><span style="color:#ABB2BF;">(tree)</span></span>
<span class="line"><span style="color:#C678DD;">                        if</span><span style="color:#56B6C2;"> isinstance</span><span style="color:#ABB2BF;">(node, ast.FunctionDef)]</span></span>
<span class="line"><span style="color:#ABB2BF;">            classes </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> [node </span><span style="color:#C678DD;">for</span><span style="color:#ABB2BF;"> node </span><span style="color:#C678DD;">in</span><span style="color:#ABB2BF;"> ast.</span><span style="color:#61AFEF;">walk</span><span style="color:#ABB2BF;">(tree)</span></span>
<span class="line"><span style="color:#C678DD;">                      if</span><span style="color:#56B6C2;"> isinstance</span><span style="color:#ABB2BF;">(node, ast.ClassDef)]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">            result </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> {</span></span>
<span class="line"><span style="color:#98C379;">                &quot;函数数量&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#56B6C2;">len</span><span style="color:#ABB2BF;">(functions),</span></span>
<span class="line"><span style="color:#98C379;">                &quot;类数量&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#56B6C2;">len</span><span style="color:#ABB2BF;">(classes),</span></span>
<span class="line"><span style="color:#98C379;">                &quot;代码行数&quot;</span><span style="color:#ABB2BF;">: </span><span style="color:#56B6C2;">len</span><span style="color:#ABB2BF;">(code.</span><span style="color:#61AFEF;">split</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">)),</span></span>
<span class="line"><span style="color:#98C379;">                &quot;函数列表&quot;</span><span style="color:#ABB2BF;">: [f.name </span><span style="color:#C678DD;">for</span><span style="color:#ABB2BF;"> f </span><span style="color:#C678DD;">in</span><span style="color:#ABB2BF;"> functions],</span></span>
<span class="line"><span style="color:#98C379;">                &quot;类列表&quot;</span><span style="color:#ABB2BF;">: [c.name </span><span style="color:#C678DD;">for</span><span style="color:#ABB2BF;"> c </span><span style="color:#C678DD;">in</span><span style="color:#ABB2BF;"> classes]</span></span>
<span class="line"><span style="color:#ABB2BF;">            }</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#56B6C2;"> str</span><span style="color:#ABB2BF;">(result)</span></span>
<span class="line"><span style="color:#C678DD;">        except</span><span style="color:#ABB2BF;"> SyntaxError </span><span style="color:#C678DD;">as</span><span style="color:#ABB2BF;"> e:</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#C678DD;"> f</span><span style="color:#98C379;">&quot;语法错误:</span><span style="color:#D19A66;">{</span><span style="color:#56B6C2;">str</span><span style="color:#ABB2BF;">(e)</span><span style="color:#D19A66;">}</span><span style="color:#98C379;">&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    def</span><span style="color:#61AFEF;"> get_parameters</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;font-style:italic;">self</span><span style="color:#ABB2BF;">) -&gt; List[ToolParameter]:</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> [</span></span>
<span class="line"><span style="color:#61AFEF;">            ToolParameter</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">                name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;code&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">                type</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;string&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">                description</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;要分析的Python代码&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">                required</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">True</span></span>
<span class="line"><span style="color:#ABB2BF;">            )</span></span>
<span class="line"><span style="color:#ABB2BF;">        ]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">class</span><span style="color:#E5C07B;"> StyleCheckTool</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;">Tool</span><span style="color:#ABB2BF;">):</span></span>
<span class="line"><span style="color:#98C379;">    &quot;&quot;&quot;代码风格检查工具&quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    def</span><span style="color:#56B6C2;"> __init__</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;font-style:italic;">self</span><span style="color:#ABB2BF;">):</span></span>
<span class="line"><span style="color:#56B6C2;">        super</span><span style="color:#ABB2BF;">().</span><span style="color:#56B6C2;">__init__</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">            name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;style_check&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">            description</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;检查代码是否符合PEP 8规范&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        )</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    def</span><span style="color:#61AFEF;"> run</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;font-style:italic;">self</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;font-style:italic;">parameters</span><span style="color:#ABB2BF;">: Dict[</span><span style="color:#56B6C2;">str</span><span style="color:#ABB2BF;">, Any]) -&gt; </span><span style="color:#56B6C2;">str</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#98C379;">        &quot;&quot;&quot;检查代码风格&quot;&quot;&quot;</span></span>
<span class="line"><span style="color:#ABB2BF;">        code </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> parameters.</span><span style="color:#61AFEF;">get</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;code&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#C678DD;"> not</span><span style="color:#ABB2BF;"> code:</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#98C379;"> &quot;错误:代码不能为空&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">        issues </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> []</span></span>
<span class="line"><span style="color:#ABB2BF;">        lines </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> code.</span><span style="color:#61AFEF;">split</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">&#39;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">        for</span><span style="color:#ABB2BF;"> i, line </span><span style="color:#C678DD;">in</span><span style="color:#56B6C2;"> enumerate</span><span style="color:#ABB2BF;">(lines, </span><span style="color:#D19A66;">1</span><span style="color:#ABB2BF;">):</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#56B6C2;"> len</span><span style="color:#ABB2BF;">(line) </span><span style="color:#56B6C2;">&gt;</span><span style="color:#D19A66;"> 79</span><span style="color:#ABB2BF;">:</span></span>
<span class="line"><span style="color:#ABB2BF;">                issues.</span><span style="color:#61AFEF;">append</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">f</span><span style="color:#98C379;">&quot;第</span><span style="color:#D19A66;">{</span><span style="color:#ABB2BF;">i</span><span style="color:#D19A66;">}</span><span style="color:#98C379;">行:超过79个字符&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#C678DD;">            if</span><span style="color:#ABB2BF;"> line.</span><span style="color:#61AFEF;">startswith</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39; &#39;</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">and</span><span style="color:#C678DD;"> not</span><span style="color:#ABB2BF;"> line.</span><span style="color:#61AFEF;">startswith</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&#39;    &#39;</span><span style="color:#ABB2BF;">):</span></span>
<span class="line"><span style="color:#C678DD;">                if</span><span style="color:#56B6C2;"> len</span><span style="color:#ABB2BF;">(line) </span><span style="color:#56B6C2;">-</span><span style="color:#56B6C2;"> len</span><span style="color:#ABB2BF;">(line.</span><span style="color:#61AFEF;">lstrip</span><span style="color:#ABB2BF;">()) </span><span style="color:#C678DD;">not</span><span style="color:#C678DD;"> in</span><span style="color:#ABB2BF;"> [</span><span style="color:#D19A66;">0</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">4</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">8</span><span style="color:#ABB2BF;">, </span><span style="color:#D19A66;">12</span><span style="color:#ABB2BF;">]:</span></span>
<span class="line"><span style="color:#ABB2BF;">                    issues.</span><span style="color:#61AFEF;">append</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">f</span><span style="color:#98C379;">&quot;第</span><span style="color:#D19A66;">{</span><span style="color:#ABB2BF;">i</span><span style="color:#D19A66;">}</span><span style="color:#98C379;">行:缩进不规范&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">        if</span><span style="color:#C678DD;"> not</span><span style="color:#ABB2BF;"> issues:</span></span>
<span class="line"><span style="color:#C678DD;">            return</span><span style="color:#98C379;"> &quot;代码风格良好，符合PEP 8规范&quot;</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#98C379;"> &quot;发现以下问题:</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> +</span><span style="color:#98C379;"> &quot;</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">.</span><span style="color:#61AFEF;">join</span><span style="color:#ABB2BF;">(issues)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD;">    def</span><span style="color:#61AFEF;"> get_parameters</span><span style="color:#ABB2BF;">(</span><span style="color:#E5C07B;font-style:italic;">self</span><span style="color:#ABB2BF;">) -&gt; List[ToolParameter]:</span></span>
<span class="line"><span style="color:#C678DD;">        return</span><span style="color:#ABB2BF;"> [</span></span>
<span class="line"><span style="color:#61AFEF;">            ToolParameter</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">                name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;code&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">                type</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;string&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">                description</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;要检查的Python代码&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">                required</span><span style="color:#56B6C2;">=</span><span style="color:#D19A66;">True</span></span>
<span class="line"><span style="color:#ABB2BF;">            )</span></span>
<span class="line"><span style="color:#ABB2BF;">        ]</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 2. 创建工具注册表和智能体</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建工具注册表</span></span>
<span class="line"><span style="color:#ABB2BF;">tool_registry </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> ToolRegistry</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"><span style="color:#ABB2BF;">tool_registry.</span><span style="color:#61AFEF;">register_tool</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">CodeAnalysisTool</span><span style="color:#ABB2BF;">())</span></span>
<span class="line"><span style="color:#ABB2BF;">tool_registry.</span><span style="color:#61AFEF;">register_tool</span><span style="color:#ABB2BF;">(</span><span style="color:#61AFEF;">StyleCheckTool</span><span style="color:#ABB2BF;">())</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 初始化LLM</span></span>
<span class="line"><span style="color:#ABB2BF;">llm </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> HelloAgentsLLM</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 定义系统提示词</span></span>
<span class="line"><span style="color:#ABB2BF;">system_prompt </span><span style="color:#56B6C2;">=</span><span style="color:#98C379;"> &quot;&quot;&quot;你是一位经验丰富的代码审查专家。你的任务是:</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">1. 使用code_analysis工具分析代码结构</span></span>
<span class="line"><span style="color:#98C379;">2. 使用style_check工具检查代码风格</span></span>
<span class="line"><span style="color:#98C379;">3. 基于分析结果，提供详细的审查报告</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">审查报告应包括:</span></span>
<span class="line"><span style="color:#98C379;">- 代码结构分析</span></span>
<span class="line"><span style="color:#98C379;">- 风格问题</span></span>
<span class="line"><span style="color:#98C379;">- 潜在bug</span></span>
<span class="line"><span style="color:#98C379;">- 性能优化建议</span></span>
<span class="line"><span style="color:#98C379;">- 最佳实践建议</span></span>
<span class="line"></span>
<span class="line"><span style="color:#98C379;">请以Markdown格式输出报告。&quot;&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 创建智能体</span></span>
<span class="line"><span style="color:#ABB2BF;">agent </span><span style="color:#56B6C2;">=</span><span style="color:#61AFEF;"> SimpleAgent</span><span style="color:#ABB2BF;">(</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">    name</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;代码审查助手&quot;</span><span style="color:#ABB2BF;">,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">    llm</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">llm,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">    system_prompt</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">system_prompt,</span></span>
<span class="line"><span style="color:#E06C75;font-style:italic;">    tool_registry</span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;">tool_registry</span></span>
<span class="line"><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 3. 运行示例</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># ========================================</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 读取示例代码</span></span>
<span class="line"><span style="color:#C678DD;">with</span><span style="color:#56B6C2;"> open</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;data/sample_code.py&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;r&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;font-style:italic;">encoding</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;utf-8&quot;</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">as</span><span style="color:#ABB2BF;"> f:</span></span>
<span class="line"><span style="color:#ABB2BF;">    sample_code </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> f.</span><span style="color:#61AFEF;">read</span><span style="color:#ABB2BF;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;=== 待审查的代码 ===&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(sample_code)</span></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;"> +</span><span style="color:#98C379;"> &quot;=&quot;</span><span style="color:#56B6C2;">*</span><span style="color:#D19A66;">50</span><span style="color:#56B6C2;"> +</span><span style="color:#98C379;"> &quot;</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 执行代码审查</span></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;=== 开始代码审查 ===&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"><span style="color:#ABB2BF;">review_result </span><span style="color:#56B6C2;">=</span><span style="color:#ABB2BF;"> agent.</span><span style="color:#61AFEF;">run</span><span style="color:#ABB2BF;">(</span><span style="color:#C678DD;">f</span><span style="color:#98C379;">&quot;请审查以下Python代码:</span><span style="color:#56B6C2;">\\n\\n</span><span style="color:#98C379;">\`\`\`python</span><span style="color:#56B6C2;">\\n</span><span style="color:#D19A66;">{</span><span style="color:#ABB2BF;">sample_code</span><span style="color:#D19A66;">}</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">\`\`\`&quot;</span><span style="color:#ABB2BF;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(review_result)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#7F848E;font-style:italic;"># 保存审查报告</span></span>
<span class="line"><span style="color:#C678DD;">with</span><span style="color:#56B6C2;"> open</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;outputs/review_report.md&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&quot;w&quot;</span><span style="color:#ABB2BF;">, </span><span style="color:#E06C75;font-style:italic;">encoding</span><span style="color:#56B6C2;">=</span><span style="color:#98C379;">&quot;utf-8&quot;</span><span style="color:#ABB2BF;">) </span><span style="color:#C678DD;">as</span><span style="color:#ABB2BF;"> f:</span></span>
<span class="line"><span style="color:#ABB2BF;">    f.</span><span style="color:#61AFEF;">write</span><span style="color:#ABB2BF;">(review_result)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">print</span><span style="color:#ABB2BF;">(</span><span style="color:#98C379;">&quot;</span><span style="color:#56B6C2;">\\n</span><span style="color:#98C379;">审查报告已保存到 outputs/review_report.md&quot;</span><span style="color:#ABB2BF;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><a href="http://README.md" target="_blank" rel="noopener noreferrer">README.md</a> 示例</strong></p><div class="language-markdown line-numbers-mode" data-highlighter="shiki" data-ext="markdown" style="background-color:#282c34;color:#abb2bf;"><pre class="shiki one-dark-pro vp-code"><code class="language-markdown"><span class="line"><span style="color:#E06C75;"># CodeReviewAgent - 智能代码审查助手</span></span>
<span class="line"></span>
<span class="line"><span style="color:#5C6370;">&gt; 基于HelloAgents框架的智能代码审查工具</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 📝 项目简介</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">CodeReviewAgent是一个智能代码审查助手，能够自动分析Python代码的质量、发现潜在问题并提供优化建议。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 核心功能</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> ✅ 代码结构分析:统计函数、类、代码行数等</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> ✅ 风格检查:检查是否符合PEP 8规范</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> ✅ 智能建议:基于LLM提供深度分析和优化建议</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> ✅ 报告生成:生成Markdown格式的审查报告</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🛠️ 技术栈</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> HelloAgents框架（SimpleAgent + ToolRegistry）</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> Python AST模块（代码解析）</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> ModelScope API（Qwen2.5-72B模型）</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🚀 快速开始</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 安装依赖</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">\\\`\\\`\\\`</span><span style="color:#ABB2BF;">bash</span></span>
<span class="line"><span style="color:#ABB2BF;">pip install -r requirements.txt</span></span>
<span class="line"><span style="color:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 配置LLM参数</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66;">**方式1: 使用.env文件**</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">\\\`\\\`\\\`</span><span style="color:#ABB2BF;">bash</span></span>
<span class="line"><span style="color:#ABB2BF;">cp .env.example .env</span></span>
<span class="line"><span style="color:#E06C75;"># 编辑.env文件,填入你的API密钥</span></span>
<span class="line"><span style="color:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66;">**方式2: 直接在Notebook中设置**</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">项目已预配置ModelScope API,可直接运行。如需修改,编辑main.ipynb第1部分的配置代码。</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">### 运行项目</span></span>
<span class="line"></span>
<span class="line"><span style="color:#56B6C2;">\\\`\\\`\\\`</span><span style="color:#ABB2BF;">bash</span></span>
<span class="line"><span style="color:#ABB2BF;">jupyter lab</span></span>
<span class="line"><span style="color:#E06C75;"># 打开main.ipynb并运行所有单元格</span></span>
<span class="line"><span style="color:#56B6C2;">\\\`\\\`\\\`</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 📖 使用示例</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">1.</span><span style="color:#ABB2BF;"> 将待审查的代码放入</span><span style="color:#E5C07B;">\`</span><span style="color:#98C379;">data/sample_code.py</span><span style="color:#E5C07B;">\`</span></span>
<span class="line"><span style="color:#E5C07B;">2.</span><span style="color:#ABB2BF;"> 运行</span><span style="color:#E5C07B;">\`</span><span style="color:#98C379;">main.ipynb</span><span style="color:#E5C07B;">\`</span></span>
<span class="line"><span style="color:#E5C07B;">3.</span><span style="color:#ABB2BF;"> 查看生成的审查报告</span><span style="color:#E5C07B;">\`</span><span style="color:#98C379;">outputs/review_report.md</span><span style="color:#E5C07B;">\`</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🎯 项目亮点</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **自动化**</span><span style="color:#ABB2BF;">:无需人工逐行检查，自动发现问题</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **智能化**</span><span style="color:#ABB2BF;">:利用LLM理解代码语义，提供深度建议</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#D19A66;"> **可扩展**</span><span style="color:#ABB2BF;">:易于添加新的检查规则和工具</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 👤 作者</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> GitHub: [</span><span style="color:#61AFEF;">@jjyaoao</span><span style="color:#ABB2BF;">]</span><span style="color:#E06C75;">(</span><span style="color:#C678DD;text-decoration:underline;">https://github.com/jjyaoao</span><span style="color:#E06C75;">)</span></span>
<span class="line"><span style="color:#E5C07B;">-</span><span style="color:#ABB2BF;"> 项目链接:[</span><span style="color:#61AFEF;">CodeReviewAgent</span><span style="color:#ABB2BF;">]</span><span style="color:#E06C75;">(</span><span style="color:#C678DD;text-decoration:underline;">https://github.com/datawhalechina/hello-agents/tree/main/Co-creation-projects/jjyaoao-CodeReviewAgent</span><span style="color:#E06C75;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75;">## 🙏 致谢</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF;">感谢Datawhale社区和Hello-Agents项目！</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_16-7-总结与展望" tabindex="-1"><a class="header-anchor" href="#_16-7-总结与展望"><span>16.7 总结与展望</span></a></h2><p>通过完成毕业设计，你应该已经掌握了智能体系统设计的完整流程。从需求出发设计系统架构，熟练使用 HelloAgents 框架的各种功能和组件，开发自定义工具扩展智能体能力，完成从需求分析到代码实现的完整项目开发，学会使用 Git 和 GitHub 进行开源协作，以及编写清晰的技术文档。</p><p>在本项目中，我们从零开始构建了 HelloAgents 框架，并用它实现了多个实用的应用。完成毕业设计只是开始，你可以继续深入学习更多智能体范式和算法、提示工程和上下文工程、多智能体协作机制等理论知识；也可以扩展技术栈，学习 Web 开发构建完整的应用、学习数据库实现数据持久化、学习部署将应用上线；还可以持续优化你的项目，添加更多功能、优化性能和用户体验、完善测试和文档；更重要的是，积极参与社区贡献，帮助其他学习者、参与 Hello-Agents 框架开发、分享你的经验和心得。</p><p>从第一章的简单智能体，到现在能够独立构建完整的多智能体应用，你已经走过了一段精彩的学习旅程。但这不是终点，而是新的起点。</p><p>AI 技术日新月异，智能体领域更是充满无限可能。希望你能够保持好奇心持续学习新技术，勇于用 AI 技术解决实际问题创造价值，乐于将你的经验和成果分享给社区，不断打磨你的作品追求卓越。</p><p>最后，感谢你完整阅读了本项目。希望你在学习的过程中有所收获，也希望你能够将所学应用到实际项目中，创造出令人惊叹的智能体应用。AI 的未来充满无限可能，让我们一起探索和创造!</p><p><strong>记住：最好的学习方式就是动手实践！</strong></p><p>现在，开始构建属于你的智能体应用吧！我们期待在 Co-creation-projects 目录中看到你的精彩作品！</p><p>如果你觉得 Hello-Agents 项目对你有帮助，请给我们一个⭐Star！</p><hr><div align="center"><strong>🎓 恭喜你完成了 Hello-Agents 教程的学习！🎉</strong></div>`,146)]])}var s=r(a,[[`render`,o]]);export{i as _pageData,s as default};
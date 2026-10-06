CSS 拆分说明
================

使用原则：每个页面先加载 common.css，再加载该页面自己的 CSS。
不要再同时加载原来的 style.css，否则会出现重复规则。

推荐对应关系：
- 首页：common.css + home.css
- 人员页面：common.css + people.css
- 研究方向/Projects：common.css + research.css
- 研究进展：common.css + research-progress.css
- 论文/成果：common.css + publications.css
- 活动页面：common.css + activities.css
- 联系我们：common.css + contact.css

HTML 示例（首页）：
<link rel="stylesheet" href="css/common.css">
<link rel="stylesheet" href="css/home.css">

HTML 示例（人员页面）：
<link rel="stylesheet" href="css/common.css">
<link rel="stylesheet" href="css/people.css">

注意：
1. common.css 必须放在页面 CSS 前面。
2. contact.css 当前基本为空，因为原 style.css 没有独立的 contact 页面样式块；contact-link 仍保留在 common.css。
3. activities.css 末尾保留了原文件中的手机端覆盖规则，以避免拆分后加载顺序改变移动端效果。
4. 原始 style.css 未修改，可继续作为备份。

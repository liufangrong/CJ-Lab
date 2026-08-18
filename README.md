# 中英双语实验室网站项目（按栏目拆分版）

这个版本是在原始静态站点基础上整理的可维护版本，主要改动只有两类：

1. 不再把所有内容写在 `js/content.js`。
2. `People` 页面改为支持头像、姓名点击跳转、负责人单独布局。

## 目录结构

- `index.html` / `people.html` / `projects.html` / `publications.html` / `activities.html`
- `css/style.css`
- `js/site-config.js`：导航与 hero 图片路径
- `js/app.js`：页面渲染逻辑
- `data/zh/site.js`：中文站点公共信息与右侧栏
- `data/en/site.js`：英文站点公共信息与右侧栏
- `data/zh/home.js` / `data/en/home.js`
- `data/zh/people.js` / `data/en/people.js`
- `data/zh/projects.js` / `data/en/projects.js`
- `data/zh/publications.js` / `data/en/publications.js`
- `data/zh/activities.js` / `data/en/activities.js`
- `assets/people/`：人员头像

## 你以后怎么改

### 1）改中文和英文内容
直接修改对应栏目文件：

- 主页：`data/zh/home.js`、`data/en/home.js`
- 人员：`data/zh/people.js`、`data/en/people.js`
- 研究方向：`data/zh/projects.js`、`data/en/projects.js`
- 科研动态：`data/zh/publications.js`、`data/en/publications.js`
- 实验室活动：`data/zh/activities.js`、`data/en/activities.js`

### 2）People 页面怎么加头像
把图片放进 `assets/people/`，然后在 `people.js` 里改：

```js
image: 'assets/people/你的照片.jpg'
```

### 3）姓名怎么跳转到链接
在 `people.js` 里给每个人设置：

```js
profileUrl: 'https://your-link.com/profile'
```

如果你暂时不想跳转，可以写成 `'#'`。

### 4）负责人区域怎么改
负责人信息在：

- `data/zh/people.js`
- `data/en/people.js`

字段包括：
- `name`
- `title`
- `room`
- `phone`
- `email`
- `image`
- `profileUrl`
- `experiences`
- `interests`

## 运行方式

直接双击 `index.html` 即可打开。

## 注意

这版是基于你原来的项目包改的，其他栏目样式和页面框架尽量保持不动，只把内容拆分方式和 `People` 页的展示方式改成更方便维护的版本。
update1

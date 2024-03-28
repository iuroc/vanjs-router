# vanjs-router

> 基于 Van.js 的前端路由管理系统

- [Video Tutorial](https://www.bilibili.com/video/BV13K411474d/)

[English](./README.md) | [简体中文](./README_zh.md)

### 安装

安装 van.js 和 vanjs-router：

```bash
npm install vanjs-core vanjs-router
```

```html
<script src="https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.7.nomodule.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/iuroc/vanjs-router/js/vanjs-router-1.2.3.js"></script>
```

### 导入和使用

```typescript
import van from 'vanjs-core'
import { Route, routeTo } from 'vanjs-router'

const { button, div } = van.tags

const App = () => {
    return div(
        Route({ name: 'home' },
            'Page Home. ',
            button({ onclick: () => routeTo('about') }, 'Go To About'),
            ' ',
            button({ onclick: () => routeTo('list', ['hot', '15']) }, 'Go To Hot List'),
        ),
        Route({ name: 'about' },
            button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
            'Page About.',
        ),
        () => {
            const listType = van.state('')
            const listId = van.state('')
            const welcome = van.state('')
            return Route({
                name: 'list',
                onFirst() {
                    welcome.val = 'Welcome!'
                },
                onLoad(route) {
                    let [type, id] = route.args
                    listType.val = type
                    listId.val = id
                }
            },
                button({ onclick: () => routeTo('home') }, 'Back To Home'), ' ',
                welcome,
                div('List Type: ', listType),
                div('List Id: ', listId),
            )
        }
    )
}

van.add(document.body, App())
```

### 切换路由

```typescript
routeTo('home')               // location.hash = ''
routeTo('about')              // location.hash = '#/about'
routeTo('list', ['hot', 15])  // location.hash = '#/list/hot/15'
```

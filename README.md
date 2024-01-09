# vanjs-router

> Frontend routing control system based on Van.js

- [Video Tutorial](https://www.bilibili.com/video/BV13K411474d/)

<!-- [English](./README.md) | [简体中文](./README_zh.md) -->

### Installation

Install van.js and vanjs-router.

```bash
npm install vanjs-core vanjs-router
```

```html
<script src="https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.2.7.nomodule.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/iuroc/vanjs-router/js/vanjs-router-1.1.9.nomodule.js"></script>
```

### Import and Usage

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

### Switch Routes

```typescript
routeTo('home')               // location.hash = ''
routeTo('about')              // location.hash = '#/about'
routeTo('list', ['hot', 15])  // location.hash = '#/list/hot/15'
```

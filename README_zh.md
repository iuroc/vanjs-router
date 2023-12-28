# vanjs-router

> 基于 Van.js 的前端路由控制系统

[English](./README.md) | [简体中文](./README_zh.md)

## 安装

安装 `van.js` 和 `vanjs-router`。

```
npm install vanjs-core vanjs-router
```

## 导入使用

```typescript
import van from 'vanjs-core'
import { router, Route } from 'vanjs-router'

const { div } = van.tags

const App = () => {
    return div(
        Route(0, div('这是 ID 为 0 的页面')),
        Route(1, div('这是 ID 为 1 的页面')),
        Route(2, div('这是 ID 为 2 的页面')),
    )
}

const routeId = router()
```

## 设置路由事件

```typescript
const routeId = router(add => {
    add(0, () => {
        console.log('当前位于 ID 为 0 的页面')
    })
    add(0, () => {
        console.log('事件叠加')
    })
    add(1, () => {
        console.log('当前位于 ID 为 1 的页面')
    })
})
```

## 切换路由

```typescript
Route(0,
    button({
        onclick() { routeId.val = 1 }
    }, '跳转到 ID 为 1 的页面')
),
Route(1, '这里是 1')
```

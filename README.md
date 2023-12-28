
# vanjs-router

> Frontend routing control system based on Van.js

[English](./README.md) | [简体中文](./README_zh.md)

### Installation

Install van.js and vanjs-router.

```bash
npm install vanjs-core vanjs-router
```

### Import and Usage

```typescript
import van from 'vanjs-core'
import { router, Route } from 'vanjs-router'

const { div } = van.tags

const App = () => {
    return div(
        Route(0, div('This is the page with ID 0')),
        Route(1, div('This is the page with ID 1')),
        Route(2, div('This is the page with ID 2')),
    )
}

// You can place this line of code anywhere without needing to consider the order.
const routeId = router()
```

### Set Route Events

```typescript
const routeId = router(add => {
    add(0, () => {
        console.log('Currently on the page with ID 0')
    })
    add(0, () => {
        console.log('Event overlay')
    })
    add(1, () => {
        console.log('Currently on the page with ID 1')
    })
})
```

### Switch Routes

```typescript
Route(0,
    button({
        onclick() { routeId.val = 1 }
    }, 'Go to the page with ID 1')
),
Route(1, 'This is page 1')
```

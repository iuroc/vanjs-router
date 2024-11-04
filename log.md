## Vanjs Router 的异常情况（2024 年 11 月 4 日）

Vanjs Router 的基本原理是创建一个 `now` 状态，通过监听 Window 的 `hashchange` 事件来更新 `now` 的值。每个路由内部通过 `van.derive(() => now.val)` 来监听路由的改变，而不是直接使用 `hashchange`。此外，`onLoad` 和 `onFirst` 也是在 `van.derive` 内部被执行的。接下来我们看下面的代码：

```ts
const count = van.state(0)

// 可以监听到 count 值的变化
van.derive(() => {
    return count.val * 2
})

// 可以监听到 count 值的变化
van.derive(() => {
    count.val

    setTimeout(() => {
        count.val * 2
    }, 1000)
})

// 可以监听到 count 值的变化
van.derive(async () => {
    count.val // 此处在同步上下文中保留了一个引用

    await new Promise((resolve) => setTimeout(resolve, 1000))
    return count.val * 2 // 该处不属于同步上下文，所以是无效引用，但由于有上面的引用，这个 derive 可以监听
})

// 无法监听到 count 值的变化
van.derive(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return count.val * 2 // 该处不属于同步上下文，且同步上下文中不存在状态值的引用，因此无法监听。
})

const func = async () => {
    return count.val * 2
}

van.derive(async () => {
    return await func() // 可以监听到，因为 func 的同步上下文也是 derive 回调函数的同步上下文，因此可以被监听。
})
```

可以看到，为了能监听到 `derive` 回调函数中的状态值变化，就必须让状态值位于回调函数的同步上下文中。

如果 `onLoad` 和 `onFirst` 的同步上下文中存在某些状态值的引用，当这些值被异步更新时，就会导致与 `onLoad` 和 `onFirst` 处于同一同步上下文的 `now` 值监听函数被触发，进而导致 `onLoad` 和 `onFirst` 被重复触发的 Bug。

因为函数的同步上下文会继承外部的同步上下文，而在继承上下文中的多个作用域中的状态值，都会被 `derive` 监听到。我们要解决的是确保 `onLoad` 和 `onFirst` 的同步上下文中存在的状态值引用不会触发外部的 `derive`，从而导致 `onLoad` 和 `onFirst` 被重复触发。

我们监听 `now` 的目的是实现对 `hashchange` 监听器的动态更新。只需创建一个全局的 `hashchange` 监听器，各个路由通过 `derive` 来共享 `hashchange` 的动态更新通知。期望 `derive` 的监听效果比 `hashchange` 更好，操作也更加便捷，且具备更好的可拓展性，比如可以将 `derive` 的返回值作为新的状态用于其他开发场景。

然而，我们要注意的是，写这样的 `derive` 来监听 `now` 的主要目的实际上就是监听 `hashchange`。创建多个 `hashchange` 监听器并不会对性能产生明显影响。如果确实需要用到 `Van State` 来监听路由变化，其实我们已经有 `now`，并且它被全局的 `hashchange` 自动更新。这个 `now` 本身就可以作为拓展性的接口状态值按需使用，而各个路由需要监听路由变化时，最好使用正常的独立 `hashchange` 监听器。这样可以实现最纯粹的路由变化监听，而无需担心 `derive` 在监听 `now` 的同时带来的数据和事件异常情况。

import { Route, now } from '../../src/router'
import van from 'vanjs-core'

const { div } = van.tags

const num = van.state(0)

const Home = () => {

    return Route({
        rule: 'task',
        Loader() {
            return div(now)
        },
        async onFirst() {
            num.val
            setTimeout(() => {
                num.val++
            }, 1000)
        },
        onLoad() {
            console.log(123)
        },
    })
}

van.add(document.body, Home())
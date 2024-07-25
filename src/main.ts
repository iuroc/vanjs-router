import van from 'vanjs-core'
import { Route, goto } from './router'

const { div } = van.tags

const Home = () => Route({
    rule: 'home',
    Loader() {
        return div({
            onclick() {
                goto('about', 1, 2, 3, 4, 5)
            }
        }, 'Hello World')
    },
    async onFirst() {

    },
    async onLoad() {
    }
})

const About = () => Route({
    rule: 'about',
    Loader() {
        return div({ style: 'color: skyblue;' }, 'Hello About')
    },
    onLoad() {
    },
})

const App = () => {

    return div(
        Home(),
        About(),
    )
}

van.add(document.body, App())
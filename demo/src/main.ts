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
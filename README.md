# vanjs-router

Simple Frontend Routing Component Based on Van.js.

This is version 2. For version 1 documentation, please [click here](https://github.com/iuroc/vanjs-router/tree/79b190f56846bef9906de886ddf29f6c62b892db).

## Features

- Supports both string and regex matching.
- Supports setting page display delay.
- Supports configuring events for the first route match (`onFirst`) and subsequent route matches (`onLoad`).
- Implemented using TypeScript.
- Simple API.

## Quick Start

```html
<script src="https://cdn.jsdelivr.net/npm/vanjs-router/dist/vanjs-router.min.js"></script>
<script>
  const { Route, goto } = router;
  const { div, button } = van.tags;

  const Home = () =>
    Route({
      rule: "home",
      Loader() {
        return div(
          "This Is Home Page.",
          button({ onclick: () => goto("about") }, "Go To About")
        );
      },
    });

  const About = () =>
    Route({
      rule: "about",
      Loader() {
        return div(
          "This Is About Page.",
          button({ onclick: () => goto("home") }, "Go To Home")
        );
      },
    });

  van.add(document.body, Home(), About());
</script>
```

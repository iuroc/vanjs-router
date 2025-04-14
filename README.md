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

```shell
npm install vanjs-router
```

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/vanjs-org/van/public/van-1.5.2.nomodule.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vanjs-router@v2.1.2/dist/vanjs-router.iife.js"></script>
<script>
  const { Route, goto } = router;
  const { a, p, div, button } = van.tags;

  const Home = () =>
    Route({
      rule: "home",
      Loader() {
        return div(
          "This Is Home Page.",
          button({ onclick: () => goto("about") }, "Go To About")
        );
      },
      async onFirst() {
        console.log("home onfirst");
      },
      async onLoad() {
        console.log("home onload");
      },
    });

  const About = () =>
    Route({
      rule: "about",
      delayed: true,
      Loader() {
        return div(
          "This Is About Page.",
          button({ onclick: () => goto("home") }, "Go To Home")
        );
      },
      async onLoad() {
        this.show();
      },
    });

  van.add(document.body, Home(), About());
</script>
```

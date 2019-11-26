# webapi
api endpoint to any website's querySelector
used as a netlify function.

example:
```js
  fetch("/webapi/", {
  body: JSON.stringify({url: "https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States", query: "big > a"}),
  method: "POST",
  }
  ).then(res => res.json()).then(response => {
    console.log(response);
  });
```

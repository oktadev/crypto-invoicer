# crypto-invoicer

crypto-invoicer is a personal web portal for invoicing clients with Bitcoin.

It allows you to:

- Generate email invoices for your clients
- Ask the client to pay you using USD, BTC, or their local currency
- Transfers the money to you in Bitcoin
- View, sort, and list invoices

It's a simple application meant to showcase the power of Node.js,
[Coinbase](https://www.coinbase.com), and [Okta](https://developer.okta.com/).

![website image][]
![website image2][]


## Technical Details

This application is built with [Express.js][], plain old HTML and [Bootstrap][]
for CSS.  I'm also using a Bootstrap theme called [Sketchy][] which makes
things look like a mockup. I really love this theme.

The invoicing API is powered by Coinbase, and uses the officially supported
[coinbase-node][] developer library.

I'm also using:

- [sorttable][], a simple JavaScript library that lets you make your tables
  sortable. This is what powers the sortable tables for listing client invoices.
- [asyncjs][], a popular JavaScript library for managing asynchronous flow.
- [pug.js][], a popular HTML templating language.
- [oidc-middleware][], a popular OpenID Connect authentication middleware created
  by Okta.

  [Express.js]: http://expressjs.com/ "Express.js"
  [Bootstrap]: http://getbootstrap.com/ "Twitter Bootstrap"
  [Sketchy]: https://bootswatch.com/sketchy/ "Sketchy Bootstrap Theme"
  [coinbase-node]: https://github.com/coinbase/coinbase-node "Coinbase Node Library on Github"
  [sorttable]: https://kryogenix.org/code/browser/sorttable/ "sorttable"
  [asyncjs]: https://github.com/caolan/async "async.js on Github"
  [pug.js]: https://pugjs.org/api/getting-started.html "Pug.js"
  [oidc-middleware]: https://github.com/okta/okta-oidc-js/tree/master/packages/oidc-middleware "oidc-middleware by Okta on Github"
  [website image]: /static/images/screenshot.png "Screenshot"
  [website image2]: /static/images/screenshot2.png "Screenshot"

# ConseilJS HTML Example

A simple HTML page using ConseilJS to query a Conseil node and fetch Tezos data.

Before launching `index.html`, fill in the `serverInfo` located in `index.js` with the details of your running instance of Conseil.

```javascript
const serverInfo = {
    url: 'https://myconseilnode.com',
    apiKey: 'someapikey'
};
```

If you want to access our dev servers instead of running your own Conseil, please join our [developers channel](https://riot.im/app/#/room/#cryptonomic-developers:cryptonomic.tech) in Riot and ask for an API key.

[Detailed documentation](https://cryptonomic.github.io/ConseilJS/) is available in the ConseilJS repo.

# iq

> Info/Query, or IQ, is a "request-response" mechanism, similar in some ways to the Hypertext Transfer Protocol [HTTP]. The semantics of IQ enable an entity to make a request of, and receive a response from, another entity.

[XMPP Core: IQ Semantics](https://xmpp.org/rfcs/rfc6120.html#stanzas-semantics-iq)

Included in `@xmpp/client` and `@xmpp/component`.

## Caller

Implements the caller side of iq semantics.

```js
const {client} = require('@xmpp/client') // or component

const xmpp = client(...)
const {iqCaller} = xmpp
```

### request

Sends an iq and returns a promise.

- Resolves with the response when it is received.
- Rejects with a `StanzaError` when an error is received
- Rejects with a `TimouetError` if a reply wasn't received within the specified or default timeout
- Rejects with an `Error` if a network error occurs

* The request `id` attribute is optional and will be added if omitted.
* The request `to` attribute is optional and will default to the server.

```js
const response = await iqCaller.request(
  xml('iq', {type: 'get'}, xml('foo', 'foo:bar')),
  30 * 1000 // 30 seconds timeout - default
)
const foo = response.getChild('foo', 'foo:bar')
console.log(foo)
```

## Callee

Implements the callee side of iq semantics.

You can think of this as http routing except there are only 2 methods; `get` and `set` and you would pass a namespace and a tag name instead of an url. The return value of the handler will be the child element of the response sent to the caller.

```js
const {client} = require('@xmpp/client') // or component

const xmpp = client(...)
const {iqCallee} = xmpp
```

## get

Add a `get` handler.

```js
iqCallee.get('foo:bar', 'foo', ctx => {
  return xml('foo', {xmlns: 'foo:bar'})
})
```

## set

Add a `set` handler.

```js
iqCallee.set('foo:bar', 'foo', ctx => {
  return xml('foo', {xmlns: 'foo:bar'})
})
```

## References

[RFC 6120 IQ Semantics](https://xmpp.org/rfcs/rfc6120.html#stanzas-semantics-iq)
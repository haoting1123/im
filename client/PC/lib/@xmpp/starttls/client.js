'use strict'

const xml = require('@xmpp/xml')
const tls = require('tls')

/*
 * References
 * https://xmpp.org/rfcs/rfc6120.html#tls
 */

const NS = 'urn:ietf:params:xml:ns:xmpp-tls'

function proceed(entity, options = {}) {
  const {
    port,
    path,
    rejectUnauthorized,
    NPNProtocols,
    ALPNProtocols,
    checkServerIdentity,
    servername,
    session,
    minDHSize,
    secureContext,
    lookup
  } = options;
  let param = {
    socket: entity._detachSocket(),
    host: entity.options.domain,
    port: port,
    path: path,
    rejectUnauthorized: rejectUnauthorized,
    NPNProtocols: NPNProtocols,
    ALPNProtocols: ALPNProtocols,
    checkServerIdentity: checkServerIdentity,
    servername: servername,
    session: session,
    minDHSize: minDHSize,
    secureContext: secureContext,
    lookup: lookup
  }
  return new Promise((resolve, reject) => {
    const tlsSocket = tls.connect(
      param,
      err => {
        if (err) return reject(err)
        entity._attachSocket(tlsSocket)
        resolve()
      }
    )
  })
}

async function starttls(entity) {
  const element = await entity.sendReceive(xml('starttls', {
    xmlns: NS
  }))
  if (element.is('proceed', NS)) {
    return element
  }

  throw new Error('STARTTLS_FAILURE')
}

module.exports = function ({
  streamFeatures
}) {
  return streamFeatures.use('starttls', NS, async ({
    entity
  }) => {
    await starttls(entity)
    await proceed(entity)
    await entity.restart()
  })
}

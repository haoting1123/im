import globalStatus from './global'
const {client, xml} = require('@xmpp/client')

export const createXmppClient = (credentials, stanzaHandler) => {
  const { service, username, password } = credentials
  const xmppClient = client({
    service: service,
    resource: 'SyntoIM-PC',
    username: username,
    password: password
  })

  // 登录失败
  xmppClient.on('error', err => {
    console.error('❌', err.toString())
    globalStatus['iq:result:bind']('error')
  })

  xmppClient.on('offline', () => {
    console.log('⏹', 'offline')
  })

  xmppClient.on('stanza', async stanza => {
    console.log('stanza::', stanza)
    stanzaHandler(stanza)
  })

  // 登录成功
  xmppClient.on('online', async address => {
    console.log('▶', 'online as', address.toString())
    console.log('上线啦')
    globalStatus['iq:result:bind']('success')

    // Makes itself available
    await xmppClient.send(xml('presence'))
  })

  // Debug
  xmppClient.on('status', status => {
    console.log('Debug🛈', 'status', status)
  })
  xmppClient.on('input', input => {
    console.log('Debug⮈', input)
    // 异常登录 => 被挤下线
    if (input.toString() === '<stream:error xmlns:stream="http://etherx.jabber.org/streams"><conflict xmlns="urn:ietf:params:xml:ns:xmpp-streams"/></stream:error>') {
      xmppClient.stop()
      globalStatus['abnormal:login:offline']()
    }
  })
  xmppClient.on('output', output => {
    console.log('Debug⮊', output)
  })

  xmppClient.start().catch(console.error)
  return xmppClient
}

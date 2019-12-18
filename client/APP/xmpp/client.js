import globalStatus from './global'
const {client, xml} = require('@xmpp/client')

export const createXmppClient = (credentials, stanzaHandler) => {
  const { service, username, password } = credentials
	// console.log(JSON.stringify(credentials))
  const xmppClient = client({
    service: service,
    resource: 'SyntoIM-APP',
    username: username,
    password: password
  })
	let debug = false

  // 登录失败
  xmppClient.on('error', err => {
		if(debug){
			console.log('❌' + JSON.stringify(err))
		}
    globalStatus['iq:result:bind']('error')
  })

  xmppClient.on('offline', () => {
		if(debug){
			console.log('⏹', 'offline')
		}
  })

  xmppClient.on('stanza', async stanza => {
		if(debug){
			console.log('stanza::' + JSON.stringify(stanza))
		}
    stanzaHandler(stanza)
  })

  // 登录成功
  xmppClient.on('online', async address => {
		if(debug){
			console.log('▶', 'online as', address.toString())
		}
    globalStatus['iq:result:bind']('success')

    // Makes itself available
    await xmppClient.send(xml('presence'))
  })

  // Debug
  xmppClient.on('status', status => {
		if(debug){
			console.log('Debug🛈' + JSON.stringify(status))
		}
  })
  xmppClient.on('input', input => {
		if(debug){
			console.log('Debug⮈' + JSON.stringify(input))
		}
    // 异常登录 => 被挤下线
    if (input.toString() === '<stream:error xmlns:stream="http://etherx.jabber.org/streams"><conflict xmlns="urn:ietf:params:xml:ns:xmpp-streams"/></stream:error>') {
      xmppClient.stop()
      globalStatus['abnormal:login:offline']()
    }
  })
  xmppClient.on('output', output => {
		if(debug){
			console.log('Debug⮊' + output)
		}
  })

  xmppClient.start().catch(console.error)
  return xmppClient
}

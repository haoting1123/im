/**
 * The events for the connection.
 */

/**
 * Indicates that the connection has been disconnected. The event provides
 * the following parameters to its listeners:
 *
 * @param msg {string} a message associated with the disconnect such as the
 * last (known) error message
 */
// 连接断开
export const CONNECTION_DISCONNECTED = 'connection.connectionDisconnected';

/**
 * Indicates that the connection has been established. The event provides
 * the following parameters to its listeners:
 *
 * @param id {string} the ID of the local endpoint/participant/peer (within
 * the context of the established connection)
 */
// 已建立连接
export const CONNECTION_ESTABLISHED = 'connection.connectionEstablished';

/**
 * Indicates that the connection has been failed for some reason. The event
 * provides the following parameters to its listeners:
 *
 * @param errType {JitsiConnectionErrors} the type of error associated with
 * the failure
 * @param errReason {string} the error (message) associated with the failure
 * @param credentials {object} the credentials used to connect (if any)
 * @param errReasonDetails {object} an optional object with details about
 * the error, like shard moving, suspending. Used for analytics purposes.
 */
// 连接失败
export const CONNECTION_FAILED = 'connection.connectionFailed';

/**
 * Indicates that the performed action cannot be executed because the
 * connection is not in the correct state(connected, disconnected, etc.)
 */
// 错误的状态
export const WRONG_STATE = 'connection.wrongState';

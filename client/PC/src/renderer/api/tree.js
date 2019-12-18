import request from '../utils/request'

// 获取树结构
export function getTreeDataRequest (id) {
  return request({
    // url: `/group/get/${id}`,
    url: `/syntoim/rest/visible/grouptree/${id}`,
    method: 'get'
  })
}

// 获取子节点成员
export function getNodeMemberRequest (id) {
  return request({
    url: `/syntoim/rest/group/select/${id}`,
    method: 'get'
  })
}

export function searchTreeMemberRequest (data) {
  return request({
    url: '/syntoim/rest/user/search',
    method: 'get',
    params: data
  })
}

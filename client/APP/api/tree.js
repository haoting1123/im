import request from '../utils/request'

// 获取树结构
export function getTreeDataRequest(id) {
	return request.get(`/syntoim/rest/visible/grouptree/${id}`)
}

// 获取子节点成员
export function getNodeMemberRequest(id) {
	return request.get(`/syntoim/rest/group/select/${id}`)
}
//根据名字模糊查询
export function searchTreeMemberRequest(data) {
	return request.get(`/syntoim/rest/user/search`,data)
}

//根据code获取机构信息
export function getGroupInfo(groupCode) {
	return request.get(`/syntoim/rest/group/message/` + groupCode)
}
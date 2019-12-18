import request from '@/utils/request'

export const miniList = (groupCode) => {
	return request.get("/syntoim/rest/miniprogram/gcode/"+groupCode)
}

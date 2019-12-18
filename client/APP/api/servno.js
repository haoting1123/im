import request from '@/utils/request'

export const articleList= (servnoCode)=> {
	return request.get('/syntoim/rest/serviceno/scode/'+servnoCode)
}

export const servnoList = (groupCode, username) => {
	return request.get('/syntoim/rest/serviceno/gcode/'+groupCode+'/'+username)
}


package com.synto.core.rs;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.beanutils.BeanUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class RequestUtil {

    public static String query2Json(String str) throws UnsupportedEncodingException {
        str = URLDecoder.decode(str, "UTF-8");
//        {page:0,size:22,name:tom,pass:pwd}

        str = str.replace("=", "\":\"");
        str = str.replace("&", "\",\"");
        str = String.format("{\"%s\"}", str);
// {"name":"tom","mobile":"123123","data":"{"fm":"my"}"}
        str = str.replace("\"{", "{");
        str = str.replace("}\"", "}");

        return str;
    }

    /**
     * TODO 目前不能处理多值
     *
     * @param request http request
     * @return map
     */
    public static Map<String, String> query2Map(HttpServletRequest request) {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.rs.RequestUtil: query2Map方法");
        Map<String, String> map = new HashMap();
        Enumeration<String> names = request.getParameterNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            String[] vs = request.getParameterValues(name);
            if (vs != null && vs.length > 0) {
                map.put(name, vs[0]);
            }
        }

        //jersey submodel    /rest/entity/{id}/submodel
        // 将 {id}传给 map做为查询条件。
        // submodel: projectId=1
        Enumeration<String> params = request.getAttributeNames();
        while (params.hasMoreElements()) {
            String name = params.nextElement();
            Object v = request.getAttribute(name);
            if (v != null)
                map.put(name, String.valueOf(v));

        }

        return map;
    }

    /**
     * 将 query 中的参数转换为 sample 查询对象。
     * @param request  http requst
     * @param entCls   entity class
     * @param <T>      T
     * @return     T
     * @throws IllegalAccessException  illegal access
     * @throws InstantiationException instance
     * @throws InvocationTargetException invocation
     */
    public static <T> T rquest2Entity(HttpServletRequest request, Class<T> entCls) throws IllegalAccessException, InstantiationException, InvocationTargetException {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.rs.RequestUtil: rquest2Entity方法");

        Map<String, String> query = query2Map(request);

        T ent = entCls.newInstance();
        BeanUtils.populate(ent, query);
        return ent;
    }

}

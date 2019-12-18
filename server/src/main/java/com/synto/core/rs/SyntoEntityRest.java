package com.synto.core.rs;

import com.synto.core.context.SyntoContext;
import com.synto.core.jpa.QueryUtil;
import com.synto.core.jpa.SyntoEntity;
import com.synto.core.jpa.SyntoRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Optional;


@Slf4j
@Produces(MediaType.APPLICATION_JSON)
abstract public class SyntoEntityRest<T extends SyntoEntity> {
    @Autowired
    private SyntoContext ctx;

    public abstract SyntoRepository<T> getRepo();

    Class<T> entityClass;
    Field[] entityFields;

    @PostConstruct
    void getEntityClass() {

        Type t = this.getClass().getGenericSuperclass();
        if (t instanceof ParameterizedType) {
            Type[] p = ((ParameterizedType) t).getActualTypeArguments();
            entityClass = (Class<T>) p[0];
            //所有声明的字段，即包括public、private和proteced，但是不包括父类的申明字段
            entityFields = entityClass.getDeclaredFields();
        }
    }


    /**
     * 获取所有客户端设置信息
     * @param request
     * @return
     */
    @GET
    @Path("/listall")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public List<T> listAll(@Context HttpServletRequest request) {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.rs.SyntoEntityRest: listAll方法");
        try {
            ctx.isValid();
            T ent = RequestUtil.rquest2Entity(request, entityClass);
            return QueryUtil.listAll(ent, getRepo());
        } catch (Exception e) {
            log.error("listall",e);
            throw new ResourceNotFoundException(request.getRequestURI(), e.getMessage(), e.getCause());
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public Page<T> list(@DefaultValue("0") @QueryParam("page") int page,
                        @DefaultValue("10") @QueryParam("size") int size,
                        @Context HttpServletRequest request) throws Exception {
        try {
            ctx.isValid();
            T ent = RequestUtil.rquest2Entity(request, entityClass);
            Page<T> p = QueryUtil.list(ent, page, size, getRepo());
            return p;
        } catch (Exception e) {
            log.error("list",e);
            throw new ResourceNotFoundException(request.getRequestURI(), e.getMessage(), e.getCause());
        }
    }


    /**
     * 修改客户端设置信息
     * @param id
     * @return
     */
    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public T getEntity(@PathParam("id") Long id) {
        ctx.isValid();
        Optional<T> ent = getRepo().findById(id);
        if (ent.isPresent())
            return ent.get();
        throw new ResourceNotFoundException(entityClass + " " + id, "Can not find resource " + entityClass + " by id " + id);
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public T add(T entity) {
        try {
            ctx.isValid();
            return getRepo().save(entity);
        } catch (Exception e) {
            log.error("add " + entity, e);
            throw new ResourceNotFoundException(entityClass.getName(), e.getMessage(), e.getCause());
        }
    }

    /**
     * 修改客户端设置信息
     * @param id
     * @param entity
     * @return
     */
    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public T update(@PathParam("id") Long id, T entity) {
        try {
            ctx.isValid();
            entity.setId(id);
            return getRepo().save(entity);
        } catch (Exception e) {
            log.error("update",e);
            throw new ResourceNotFoundException(entityClass.getName(), e.getMessage(), e.getCause());
        }
    }


    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    public boolean delete(@PathParam("id") Long id) {
        try {
            ctx.isValid();
            getRepo().deleteById(id);
            return true;
        } catch (Exception e) {
            log.error("delete",e);
            throw new ResourceNotFoundException(entityClass + " " + id, e.getMessage(), e.getCause());
        }
    }


}

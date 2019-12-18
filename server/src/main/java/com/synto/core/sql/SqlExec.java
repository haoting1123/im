package com.synto.core.sql;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

@Slf4j
@Component
public class SqlExec {
    @Autowired
    EntityManager em;

    public List<Object[]> exec(String sql, Object... params) {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.sql.SqlExec：exec方法");
        Query query = em.createNativeQuery(sql);
        for (int i=0;i< params.length;i++) {
            query.setParameter(i+1,params[i]);
        }
        return query.getResultList();
    }
}

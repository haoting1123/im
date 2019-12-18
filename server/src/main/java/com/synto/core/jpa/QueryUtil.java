package com.synto.core.jpa;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.List;
import java.util.Map;

@Slf4j
public class QueryUtil {


    /**
     * 获得数据
     * @param entity
     * @param repo
     * @param <T>
     * @return
     */
    public static <T extends SyntoEntity> List<T> listAll(T entity, SyntoRepository<T> repo) {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.jpa.QueryUtil: listAll方法");
        Example<T> example = queryExample(entity);
        return repo.findAll(example);
    }

    public static <T extends SyntoEntity> Page<T> list(T entity, int page, int size, SyntoRepository<T> repo) throws Exception {

        Sort sort = new Sort(Sort.Direction.DESC, "id");

        Pageable pageable = PageRequest.of(page, size, sort);
        Example<T> example = queryExample(entity);
        return repo.findAll(example, pageable);

    }

    public static <T> Example<T> queryExample(T entity) {
        log.info("（＾∀＾●）ﾉｼ com.synto.core.jpa.QueryUtil: queryExample方法");
        ExampleMatcher matcher = ExampleMatcher.matching() //构建对象
                .withIgnoreNullValues()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING)
                .withIgnorePaths("id");
        Example<T> exp = Example.of(entity, matcher);
        return exp;
    }

    public static <T> Specification<T> querySpec(Map<String, Object> params) {
        return new Specification<T>() {

            @Nullable
            @Override
            public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
//                javax.persistence.criteria.Path<Object> namePath = root.get("name");
//                query.where(builder.like(namePath, "%李%"));
                return null;
            }
        };
    }
}

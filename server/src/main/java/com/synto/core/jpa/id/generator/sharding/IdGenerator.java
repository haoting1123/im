package com.synto.core.jpa.id.generator.sharding;

/**
 * Id 生成接口.
 *
 * @author gaohongtao
 */
public interface IdGenerator {

    /**
     * 生成Id.
     *
     * @return 返回生成的Id,返回值应为@{@link Number}对象或者为@{@link String}对象
     */
    Number generateId();
}

package com.synto.im.miniprogram.rs;

import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.im.miniprogram.model.MiniProgram;
import com.synto.im.miniprogram.repository.MiniProgramRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Slf4j
@Component
@Path("/miniprogram")
public class MiniProgramResource extends SyntoEntityRest<MiniProgram> {

    @Autowired
    MiniProgramRepository repository;

    @Override
    public SyntoRepository<MiniProgram> getRepo() {
        return repository;
    }


    /**
     * 获取该组织机构下的小程序列表
     * @param groupRootCode
     * @return
     */
    @GET
    @Path("/gcode/{gcode}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<MiniProgram> getByGcode(@PathParam("gcode") String groupRootCode) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.rs.MiniProgramResource：getByGcode方法");
        return repository.findByGroupCode(groupRootCode);
    }

    /**
     * 添加小程序
     * @param smallProgram
     * @return
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    @Override
    public MiniProgram add(MiniProgram smallProgram) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.rs.MiniProgramResource：add方法");
        MiniProgram sp = repository.findFirstByCode(smallProgram.getCode());
        if(sp != null){
            return null;
        }
        return repository.save(smallProgram);
    }

}

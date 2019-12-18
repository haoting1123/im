package com.synto.im.license.rs;

import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.im.license.model.ImLicense;
import com.synto.im.license.repository.ImLicenseRepository;
import com.synto.im.license.service.ImLicenseService;
import com.synto.util.DateUtils;
import com.synto.util.PropertyFileUtil;
import lombok.extern.slf4j.Slf4j;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Slf4j
@Component
@Path("/im/license")
public class ImLicenseResource  extends SyntoEntityRest<ImLicense> {

    @Autowired
    ImLicenseRepository repo;

    @Autowired
    ImLicenseService service;

    @Override
    public SyntoRepository<ImLicense> getRepo() {
        return repo;
    }

    /**
     * 分配license 文件 生成授权文件
     * @param license
     * @return
     */
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON, MediaType.MULTIPART_FORM_DATA, MediaType.APPLICATION_FORM_URLENCODED})
    @Path("/add")
    public ImLicense addLicense(ImLicense license) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.rs.ImLicenseResource：addLicense方法  用户数" + license.getUserCount());
        ImLicense lc = service.createImLicense(license);
        return lc;
    }

    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Path("/download/{licenseId}")
    public Response download(@PathParam("licenseId") String licenseId)   {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.rs.ImLicenseResource：download方法");
        try {
            SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
            String fileName = String.format("license-%s.txt",df.format(new Date()));
            ByteArrayOutputStream res = service.genLicenseFile(licenseId);
            return Response
                    .ok(res.toByteArray(),MediaType.APPLICATION_OCTET_STREAM)
                    .encoding("utf-8")
                    .header("Content-disposition","attachment;filename=" +fileName)
                    .header("Cache-Control", "no-cache")
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response
                    .serverError()
                    .header("Content-disposition", "msg=" + e.getMessage())
                    .header("Cache-Control", "no-cache").build();
        }
    }

    /**
     * 上传文件 导入授权文件 激活组织机构授权
     * @param fis
     * @param fd
     * @param path
     * @return
     */
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/upload")
    public ImLicense upload(@FormDataParam("file") InputStream fis,
                            @FormDataParam("file") FormDataContentDisposition fd,
                            @FormDataParam("path") String path)  {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.rs.ImLicenseResource：upload方法");
        ImLicense imlicense = new ImLicense();
        try {
            PropertyFileUtil.loadProperties(imlicense, fis, PropertyFileUtil.UTF8);
            //保存授权文件信息  修改授权信息(导入时间，是否启用)
            imlicense = service.importLicense(imlicense);
            return imlicense;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/grouplist/{groupCode}")
    public List groupLicenses(@PathParam("groupCode") String groupCode){
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.rs.ImLicenseResource：groupLicenses方法");
        return service.groupLicense(groupCode);
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/group/{groupCode}/count")
    public int groupLicenseCount(@PathParam("groupCode") String groupCode){
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.rs.ImLicenseResource：groupLicenseCount方法");
        return service.numberUserLicense(groupCode);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/group/{groupCode}")
    public ImLicense getgroupLicense(@PathParam("groupCode") String groupCode){
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.rs.ImLicenseResource：getgroupLicense方法");
        ImLicense imLicense = repo.getImLicense(groupCode);
        if(imLicense == null ){
            imLicense = new ImLicense();
            imLicense.setUserCount(0L);
            return imLicense;
        }
        if( DateUtils.after(imLicense.getExpiredDate())){
            imLicense.setUserCount(0L);
        }
        return imLicense;
    }

}

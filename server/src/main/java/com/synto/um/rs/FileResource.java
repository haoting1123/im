package com.synto.um.rs;

import com.synto.um.model.Upload;
import com.synto.um.model.User;
import com.synto.um.service.FileService;
import com.synto.um.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;


/**
 * 上传下载文件管理
 */
@Slf4j
@Component
@Path("/file")
public class FileResource {

    @Autowired
    FileService fs;
    @Autowired
    UserService userService;
    @GET
    public String info() {
        return "file upload api post /file/upload  ";
    }

    /**
     * 上传文件
     * @param file
     * @return
     * @throws IOException
     */
    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Upload upload(FormDataMultiPart file) throws IOException {
        // 判断是否为普通用户
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            //获取文件流
            FormDataBodyPart filePart = file.getField("file");
            InputStream fis = filePart.getValueAs(InputStream.class);
            FormDataContentDisposition fd = filePart.getFormDataContentDisposition();
            String fileName = iso8859toUtf8(fd.getFileName());

            FormDataBodyPart targetFileNamePart = file.getField("targetFileName");
            if(targetFileNamePart != null && StringUtils.isNotBlank(targetFileNamePart.getValue())){
                fileName = targetFileNamePart.getValue();
            }

            // 获取密级
            FormDataBodyPart gradePart = file.getField("grade");
            String grade = gradePart == null ? "" : gradePart.getValue();

            // 文件加上密级后缀
            if(filePart.getMediaType().getType().indexOf("image") == -1 && StringUtils.isNotBlank(grade)){
                StringBuilder sb = new StringBuilder(fileName);
                int indexOf = sb.lastIndexOf(".");
                sb.replace(indexOf, indexOf + 1, "【" + grade + "】.");
                fileName = sb.toString();
            }

            return fs.save(fileName, fis);
        }
        return null;
    }

    /**
     * 上传头像
     * @param file
     * @return
     * @throws IOException
     */
    @POST
    @Path("/uploadphoto")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Upload uploadPhoto(FormDataMultiPart file) throws IOException {
        // 判断是否为普通用户
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            FormDataBodyPart filePart = file.getField("file");
            InputStream fis = filePart.getValueAs(InputStream.class);
            FormDataContentDisposition fd = filePart.getFormDataContentDisposition();
            String fileName = iso8859toUtf8(fd.getFileName());

            if(filePart.getMediaType().getType().indexOf("image") == -1){
                return null;
            }

            StringBuilder sb = new StringBuilder(fileName);
            int indexOf = sb.lastIndexOf(".");
            sb.replace(0, indexOf, "p");  // 头像名统一叫p
            fileName = sb.toString();

            return fs.savePhoto(fileName, fis);
        }
        return null;
    }

    String iso8859toUtf8(String fileName) {
        try {
            return new String(fileName.getBytes("iso8859-1"),"utf-8");
        } catch (UnsupportedEncodingException e) {
            return fileName;
        }
    }

    static String getFileName(String fileId) {
        //./softdec/file/prj/1.jpg
        int i = fileId.lastIndexOf("/");
        String fileName = fileId;
        if (i > 0) {
            fileName = fileId.substring(i + 1);
        }
        return fileName;
    }

    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Path("/download/{id}")
    public Response download(@PathParam("id") String id) throws IOException {
        String fileId = URLDecoder.decode(id, "utf-8");
        String fileName = getFileName(fileId);
        fileName = URLEncoder.encode(fileName, "UTF-8");
        ByteArrayOutputStream res = fs.load(id);
        return Response
                .ok(res, MediaType.APPLICATION_OCTET_STREAM)
                .header("Content-disposition", "attachment;filename=" + fileName)
                .header("Cache-Control", "no-cache").build();
    }

    @GET
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @Path("/download")
    public Response download2(@QueryParam("id") String id) throws IOException {
        String fileId = URLDecoder.decode(id, "utf-8");
        String fileName = getFileName(fileId);
        fileName = URLEncoder.encode(fileName, "UTF-8");
//        byte[] res = fs.load(id);
        ByteArrayOutputStream res = fs.load(id);
        String type = "imag/jpg";
        return Response
                .ok(res.toByteArray(), MediaType.APPLICATION_OCTET_STREAM)
                //.ok(res,type)
                .header("Content-disposition", "attachment;filename=" + fileName)
                .header("Cache-Control", "no-cache").build();
    }

}

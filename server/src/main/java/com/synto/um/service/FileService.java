package com.synto.um.service;

import com.synto.um.model.Upload;
import com.synto.um.model.User;
import com.synto.util.ByteUtil;
import com.synto.util.DateUtils;
import net.coobird.thumbnailator.Thumbnails;
import org.apache.shiro.SecurityUtils;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.UUID;

@Component
@ConfigurationProperties(prefix = "file")
public class FileService {
    final static Logger logger = LoggerFactory.getLogger(FileService.class);

    String root;
    String downloadUrl;
    String photo;
    String photoUrl;

    @Autowired
    UserConfigService userConfigService;

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public String getRoot() {
        return root;
    }

    public void setRoot(String root) {
        this.root = root;
    }

    public Upload save(String fileName, InputStream fis) throws IOException {
        Upload upload = saveFile(fileName, fis, root, downloadUrl, false);
        String username = (String) SecurityUtils.getSubject().getPrincipal();

        userConfigService.updateFileUpSize(username, ByteUtil.fileSizeMB(upload.getSize()));

        return upload;
    }

    public Upload savePhoto(String fileName, InputStream fis) throws IOException {
        return saveFile(fileName, fis, photo, photoUrl, true);
    }

    private Upload saveFile(String fileName, InputStream fis, String dirPath, String url, boolean thumbnails) throws IOException {
        String path = DateUtils.dateFormat("yyyyMMdd") + "/" + UUID.randomUUID().toString().replaceAll("-", "");

        String dir = dirPath + "/" + path;
        File f = new File(dir);
        f.mkdirs();
        String file = dir + "/" + fileName;
        FileOutputStream out = new FileOutputStream(file);

        if(thumbnails){
            // fis获取不到图片大小 没法调整压缩比例
            // 图片大小不变 质量压缩至20%
            float quality = 0.2f;
            Thumbnails.of(fis).scale(1).outputQuality(quality).toOutputStream(out);
        }else{
            IOUtils.copy(fis, out);
        }
        out.close();
        File fil=new File(file);
        Upload upload=new Upload();
        upload.setSize(fil.length());
        upload.setUrl(url + "/" + path + "/" + fileName);
        return upload;
    }

    public ByteArrayOutputStream load(String file) throws IOException {
        FileInputStream in = new FileInputStream(root + "/" +file);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        IOUtils.copy(in, baos);
//        byte[] res = baos.toByteArray();
//        return res;
        return baos;
    }
}

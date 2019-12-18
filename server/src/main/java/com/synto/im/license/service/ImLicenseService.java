package com.synto.im.license.service;
import com.synto.crypto.util.HashUtil;
import com.synto.im.license.model.ImLicense;
import com.synto.im.license.model.InvalidLicenseException;
import com.synto.im.license.repository.ImLicenseRepository;
import com.synto.util.DateUtils;
import com.synto.util.FreemakerTemplate;
import freemarker.template.utility.DateUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@Transactional
public class ImLicenseService {

    @Autowired
    ImLicenseRepository repo;

    public static final String LICENSE_FILE="templates/license.ftl";
    final static String FILE_CODE="UTF-8";

    public void findAll(){
        repo.findAll();
    }

    /**
     * 分配license 文件  创建授权文件
     * @return
     */
    public ImLicense createImLicense(ImLicense license){
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.service.ImLicenseService：createImLicense方法");

        //判断是否已经存在授权文件，将旧的并且未激活的授权文件删除
        List<ImLicense> ent = repo.findByGroupCodeAndUsedIsAndImportedDateIsNull(license.getGroupCode(),false);
        if(ent.size() > 0){
            //代表有未激活的旧文件  删除授权文件
            repo.deleteByGroupCodeAndUsedIs(license.getGroupCode(), false);
        }
        //拼接授权文件id
        SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
        String licenseId = "im-"+license.getGroupCode()+"-"+ df.format(new Date());
        license.setLicenseId(licenseId);

        //判断过期时间
        if(license.getExpiredDate() == null) {
            Date expiredDate = DateUtils.yearsLater(license.getPeriod());
            license.setExpiredDate(DateUtils.day2String(expiredDate));
        }

        //授权文件创建时间
        license.setReleaseDate(DateUtils.date2String(new Date()));

        //使用hash方法生成key
        String hash = HashUtil.hash(license.info());

        license.setKey(hash);

        repo.save(license);
        return license;
    }

    /**
     * 导入授权文件， 检查是否是已经申请的，并且未导入过, 设置导入时间 启用授权信息
     * @param license
     */
    @Transactional
    public ImLicense importLicense( ImLicense license) {
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.service.ImLicenseService：importLicense方法");
        // 判断hash值是否相等
        license.valid();
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.service.ImLicenseService：importLicense方法 用户数" + license.getUserCount());
        // 查询未激活的授权信息  判断是否是重新导入
        Optional<ImLicense> ent = repo.findByLicenseIdAndUsedIsAndImportedDateIsNull(license.getLicenseId(),false);
        // 判断集合中是否有值
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.service.ImLicenseService：" + ent.isPresent());
        if(!ent.isPresent())
            throw new InvalidLicenseException("授权文件已经导入，不能重复使用");

        //判断是否存在旧的 并且已激活的授权信息
        List<ImLicense> list = repo.findByGroupCodeAndUsedIs(license.getGroupCode(),true);
        if(list.size() > 0){
            //代表有已激活的旧文件  删除授权文件
            repo.deleteByGroupCodeAndUsedIs(license.getGroupCode(), true);
        }

        license.setImportedDate(DateUtils.date2String(new Date()));
        license.setUsed(true);
        license.setId(ent.get().getId());

        // 根据id修改相应授权信息
        repo.save(license);
        return license;
    }

    public int numberUserLicense(String groupCode){
        Integer sum = repo.sumUserValidByGroup( groupCode,DateUtils.today() );
        return sum == null ? 0 : sum;
    }


    /**
     * 机构授权文件
     * @param groupCode
     * @return
     */
    public List<ImLicense> groupLicense(String groupCode){
        return repo.findByGroupCodeOrderByIdDesc(groupCode);
    }

    /**
     * 机构有效的授权文件
     * @param groupCode
     * @return
     */
    public List<ImLicense> groupImportedLicense(String groupCode){
        return repo.findByGroupCodeAndImportedDateIsNotNullOrderByIdDesc(groupCode);
    }

    /**
     * 下载授权文件
     * @param licenseId
     * @return
     * @throws Exception
     */
    public ByteArrayOutputStream genLicenseFile(String licenseId) throws Exception {
        Optional<ImLicense> opt = repo.findByLicenseId(licenseId);
        if(!opt.isPresent())
            throw new Exception("找不到 授权文件 " + licenseId);

        ByteArrayOutputStream res= new ByteArrayOutputStream() ;
        final OutputStreamWriter out = new OutputStreamWriter(res);

        opt.ifPresent( lc->{
            FreemakerTemplate.generate(lc, out, LICENSE_FILE);
        });
        return res;
    }

    /**
     * 删除组织机构授权文件
     * @param code
     * @return
     */
    public void deleteByGroupCode(String code){
        log.info("（＾∀＾●）ﾉｼ com.synto.im.license.service.ImLicenseService：deleteByGroupCode方法");
        repo.deleteByGroupCodeAndUsedIs(code, false);
    }
}

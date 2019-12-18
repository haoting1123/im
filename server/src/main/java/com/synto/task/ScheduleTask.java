package com.synto.task;

import org.jivesoftware.util.JiveGlobals;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Component
@Configuration
@EnableScheduling
public class ScheduleTask {
    private static final Logger logger = LoggerFactory.getLogger(JiveGlobals.class);

    @Value("${file.root}")
    private String root;
    @Value("${task.delete-file.day}")
    private String delDay;

    public String getDelDay() {
        return delDay;
    }

    public void setDelDay(String delDay) {
        this.delDay = delDay;
    }

    public String getRoot() {
        return root;
    }

    public void setRoot(String root) {
        this.root = root;
    }

    // 每晚1点执行
    @Scheduled(cron = "${task.delete-file.cron}")
    private void configureTasks() {
        File file = new File(root);
        if(!file.exists()){
            return ;
        }

        File [] files = file.listFiles();
        for(File f : files){
            if(!f.isDirectory()){
                continue;
            }
            String dateDir = f.getPath().substring(f.getPath().length() - 8, f.getPath().length());
            long day = LocalDate.of(Integer.parseInt(dateDir.substring(0, 4)), Integer.parseInt(dateDir.substring(4, 6)), Integer.parseInt(dateDir.substring(6, 8))).until(LocalDate.now(), ChronoUnit.DAYS);
            // 大于7天 删除
            if (day > Long.parseLong(delDay)){
                logger.debug("delete dir: " + f.getPath());
                deleteDirectory(f);
            }
        }
    }

    /**
     * 请谨慎调用 会删除传入路径的所有文件和文件夹
     * @param file
     */
    private static void deleteDirectory(File file){
        if(!file.exists()){
            return ;
        }
        File [] files = file.listFiles();
        for (File f: files) {
            if(f.isDirectory()){
                deleteDirectory(f);
            } else {
                f.delete();
            }
        }
        file.delete();
    }

    /**
     * 请谨慎调用 会删除传入路径的所有文件和文件夹
     * @param filePath
     */
    private static void deleteDirectory(String filePath){
        deleteDirectory(new File(filePath));
    }

}

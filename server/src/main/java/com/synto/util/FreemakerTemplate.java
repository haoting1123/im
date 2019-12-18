package com.synto.util;

import freemarker.cache.ClassTemplateLoader;
import freemarker.cache.NullCacheStorage;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateExceptionHandler;
import lombok.Cleanup;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;


public class FreemakerTemplate {
    public static final String ENCODING="UTF-8";
    public static final String  BASE_PATH="/";


    public static void generate(Object data,  String outfile, String templateFile)  {

        try {
            @Cleanup
            FileWriter f = new FileWriter(outfile);
            generate(data,f,templateFile);
        } catch (IOException e) {
            throw new RuntimeException(" templateFile " +templateFile+" , data " + data, e);
        }
    }

    public static void generate(Object data,  Writer out, String templateFile)  {
        try {
            Template freemarker = getTemplate(templateFile);
            freemarker.process(data, out);
        } catch (Exception e) {
            throw new RuntimeException(" templateFile " +templateFile+" , data " + data, e);
        }
    }

    static Template  getTemplate(String templateFile) throws Exception{
        Configuration templateConfig = new Configuration(Configuration.VERSION_2_3_23);
        ClassLoader  cl = Thread.currentThread().getContextClassLoader();
        templateConfig.setTemplateLoader(new ClassTemplateLoader(cl, BASE_PATH));
        templateConfig.setDefaultEncoding("UTF-8");
        templateConfig.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);
        templateConfig.setCacheStorage(NullCacheStorage.INSTANCE);

        return  templateConfig.getTemplate(templateFile, ENCODING);
    }


}

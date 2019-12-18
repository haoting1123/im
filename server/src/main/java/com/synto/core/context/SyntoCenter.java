package com.synto.core.context;

import com.synto.core.content.util.HardwareUtil;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Date;
import java.util.Random;

final class SyntoCenter {
    //2021-01-01
    private static final long EXP_DT = 1609430400000L;
//    private final static long EXP_DT = 430400000L;
    private transient boolean valid = true;
    private transient boolean done;
    public static boolean valid(){
        return isExpired();
    }
    public boolean isValid(){
        if(valid){
            return true;
        }
        try {
            Thread.sleep(random()*120);
        } catch (InterruptedException e) {}
        return false;
    }
    static final private long diff(){
        return  EXP_DT - new Date().getTime();
    }

//  获取随机数
    final private int random(){
        int n = (int) (Math.random() * 1000);
        return n;
    }

   static  final private boolean isExpired(){
        return diff()<0;
    }
    final private void cleanup(){
        try {
            Class<?> c = Class.forName("com.synto.core.context.CleanUp");
            Object o = c.newInstance();
            c.getMethod("cleanup").invoke(o,"");
        } catch (Exception e) {
            StringWriter str= new StringWriter();
            PrintWriter out = new PrintWriter(str);
            e.printStackTrace(out);
        }
    }
    final private void info(){
        try {
            String str = HardwareUtil.info().toString();
            System.out.println(str);
        } catch(Exception e) { }
    }

    final void check(){
        if(isExpired()) {
            valid=false;
        } else {
            valid = true;
        }

    }

    void start(){
        info();
        new Thread() {
            @Override
            public void run() {
                do {
                    try {
                        if (! isExpired() ) {
                            Thread.sleep(1000 * 60 * 60 *24);
                        }
                        check();
                        long n = random() * 60;
                         Thread.sleep(n);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                } while (true);
            }
        }.start();
    }
}

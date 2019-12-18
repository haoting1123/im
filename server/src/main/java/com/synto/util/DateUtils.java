package com.synto.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

public class DateUtils {
    public static final SimpleDateFormat TIME_FORMATE = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    public static final SimpleDateFormat DAY_FORMATE = new SimpleDateFormat("yyyy-MM-dd");

    public static String today() {
        return DAY_FORMATE.format(new Date());
    }

    public static String dateFormat(String format) {
        return new SimpleDateFormat(format).format(new Date());
    }

    public static String dateString() {
        return TIME_FORMATE.format(new Date());
    }

    public static String date2String(Date d) {
        return TIME_FORMATE.format(d);
    }

    public static Integer[] string2Date(String date) {
        // 2018/1/1
        String[] arr = date.split("/");
        Integer[] d = new Integer[3];
        d[0] = Integer.valueOf(arr[0]);
        d[1] = Integer.valueOf(arr[1]);
        d[2] = Integer.valueOf(arr[2]);
        return d;
    }

    public static String timeString() {
        Date d = new Date();
        return TIME_FORMATE.format(d);
    }

    public static String time2String(Date d) {
        return TIME_FORMATE.format(d);
    }

    public static String day2String(Date d) {
        return DAY_FORMATE.format(d);
    }

    public static boolean after(String day){
        return today().compareTo(day)>0;
    }

    //
    public static Date yearsLater(int period) {
        GregorianCalendar calendar = new GregorianCalendar();
        calendar.add(Calendar.YEAR, period);
        return calendar.getTime();
    }
    public static void main(String[] args) {
        String day = "2018-03-01";
        String day2 = "2018-09-21";

        System.out.println(today() +" after "+day +"  " +(after(day)));
        System.out.println(today() +" after "+day2 +"  " +(after(day2)));
        System.out.println(time2String(yearsLater(20) ));
    }
}


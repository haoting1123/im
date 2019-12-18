package com.synto.core.rs.jersey;

import com.synto.util.StringUtil;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.ext.ParamConverter;
import javax.ws.rs.ext.ParamConverterProvider;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateConverterProvider implements ParamConverterProvider{

    public class DateParameterConverter implements ParamConverter<Date> {

        public static final String format = "yyyy-MM-dd"; // set the format to whatever you need

        @Override
        public Date fromString(String string) {
            if(StringUtil.isNull(string))
                return null;

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
            try {
                return simpleDateFormat.parse(string);
            } catch (ParseException ex) {
                throw new WebApplicationException(ex);
            }
        }

        @Override
        public String toString(Date t) {
            return new SimpleDateFormat(format).format(t);
        }

    }
    @Override
    public <T> ParamConverter<T> getConverter(Class<T> rawType, Type genericType, Annotation[] annotations) {
        if (Date.class.equals(rawType)) {
            return (ParamConverter<T>) new DateParameterConverter();
        }
        return null;
    }

}

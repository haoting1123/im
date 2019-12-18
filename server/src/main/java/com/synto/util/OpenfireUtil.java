package com.synto.util;

import com.synto.um.model.User;
import org.apache.commons.lang3.StringUtils;
import org.jivesoftware.openfire.auth.AuthFactory;
import org.jivesoftware.openfire.auth.ScramUtils;
import org.jivesoftware.util.JiveGlobals;

import javax.security.sasl.SaslException;
import javax.xml.bind.DatatypeConverter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class OpenfireUtil {

    public static String encryptedPassword(String password){
        if(StringUtils.isBlank(password)){
            return null;
        }
        return AuthFactory.encryptPassword(password);
    }

    public static void handlePassword(User user){
        String password = user.getPlainPassword();

        byte[] saltShaker = new byte[24];
        SecureRandom random = new SecureRandom();
        random.nextBytes(saltShaker);

        String salt = DatatypeConverter.printBase64Binary(saltShaker);
        int iterations = JiveGlobals.getIntProperty("sasl.scram-sha-1.iteration-count", ScramUtils.DEFAULT_ITERATION_COUNT);
        byte[] saltedPassword = null, clientKey = null, storedKey = null, serverKey = null;
        try {
            saltedPassword = ScramUtils.createSaltedPassword(saltShaker, password, iterations);
            clientKey = ScramUtils.computeHmac(saltedPassword, "Client Key");
            storedKey = MessageDigest.getInstance("SHA-1").digest(clientKey);
            serverKey = ScramUtils.computeHmac(saltedPassword, "Server Key");
        } catch (SaslException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        String encryptedPassword = encryptedPassword(password);

        user.setEncryptedPassword(encryptedPassword);
        user.setStoredKey(DatatypeConverter.printBase64Binary(storedKey));
        user.setServerKey(DatatypeConverter.printBase64Binary(serverKey));
        user.setSalt(salt);
        user.setIterations(iterations);
    }
}

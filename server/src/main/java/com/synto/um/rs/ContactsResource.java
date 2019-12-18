package com.synto.um.rs;

import com.synto.core.jpa.SyntoRepository;
import com.synto.core.rs.SyntoEntityRest;
import com.synto.um.model.Contacts;
import com.synto.um.model.User;
import com.synto.um.repository.ContactsRepository;
import com.synto.um.service.ContactsService;
import com.synto.um.service.FileService;
import com.synto.um.service.UserService;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.List;

/**
 * 用户联系人信息管理
 */
@Component
@Path("/contact")
public class ContactsResource extends SyntoEntityRest<Contacts> {

    @Autowired
    ContactsService contactsService;

    @Autowired
    ContactsRepository contactsRepository;

    @Override
    public SyntoRepository<Contacts> getRepo() {
        return contactsRepository;
    }

    @Autowired
    UserService userService;

    @GET
    @Path("/select/{username}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<Contacts> getContacts(@PathParam("username")String username){
        List<Contacts> contacts = contactsRepository.findByUserName(username);
        return contacts;
    }

    @GET
    @Path("/like/{username}/{key}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public List<Contacts> vagueContacts(@PathParam("username")String username,@PathParam("key")String key){
        List<Contacts> contacts = contactsService.fuzzyQuery(username,key);
        return contacts;
    }

    /**
     * 删除好友
     * @param contacts
     */
    @DELETE
    @Path("/delete")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public void deleteContacts(Contacts contacts){
        //判断是否为普通用户
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            contactsRepository.delete(contacts);
        }
    }

    @DELETE
    @Path("/delete/{username}/{friendjid}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public int deleteByUserNameAndFriendName(@PathParam("username") String userName, @PathParam("friendjid") String friendjid){
        int num = 0;
        //判断是否为普通用户
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            return contactsRepository.deleteByUserNameAndFriendJid(userName, friendjid);
        }
        return num;
    }

    /**
     * 添加好友
     * @param contacts
     * @return
     */
    @POST
    @Path("/add")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes({MediaType.APPLICATION_JSON,MediaType.MULTIPART_FORM_DATA,MediaType.APPLICATION_FORM_URLENCODED})
    public Contacts addContacts(Contacts contacts){
        //contactsRepository.deleteById(contacts.getId());
        //判断是否为普通用户
        User currentUser = userService.getCurrentUser();
        if(currentUser!=null){
            Contacts contact=contactsRepository.save(contacts);
            return contact;
        }
        return null;
    }
}

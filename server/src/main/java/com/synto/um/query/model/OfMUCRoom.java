package com.synto.um.query.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OfMUCRoom {

    Long serviceID;

    Long roomID;

    String creationDate;

    String modificationDate;

    String name;

    String naturalName;

    String description;

    String lockedDate;

    String emptyDate;

    Integer canChangeSubject;

    Integer maxUsers;

    Integer publicRoom;

    Integer moderated;

    Integer membersOnly;

    Integer canInvite;

    String roomPassword;

    Integer canDiscoverJID;

    Integer logEnabled;

    String subject;

    Integer rolesToBroadcast;

    Integer useReservedNick;

    Integer canChangeNick;

    Integer canRegister;

    Integer allowpm;

    String roomJid;

}

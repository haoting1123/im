COMMIT;

DROP TABLE IF EXISTS SYSDBA.ofUser  CASCADE;

CREATE TABLE SYSDBA.ofUser (
	username VARCHAR2 (64) NOT NULL,
	storedKey VARCHAR (32),
	serverKey VARCHAR (32),
	salt VARCHAR (32),
	iterations INT,
	plainPassword VARCHAR2 (32),
	encryptedPassword VARCHAR2 (255),
	NAME VARCHAR2 (100),
	email VARCHAR2 (100),
	creationDate CHAR (15) NOT NULL,
	modificationDate CHAR (15) NOT NULL,
	CONSTRAINT ofUser_pk PRIMARY KEY (username)
);

CREATE INDEX ofUser_cDate_idx ON SYSDBA.ofUser (creationDate ASC);

DROP TABLE IF EXISTS SYSDBA.ofUserProp  CASCADE;

CREATE TABLE SYSDBA.ofUserProp (
	username VARCHAR2 (64) NOT NULL,
	NAME VARCHAR2 (100) NOT NULL,
	propValue VARCHAR2 (1024) NOT NULL,
	CONSTRAINT ofUserProp_pk PRIMARY KEY (username, NAME)
);

DROP TABLE IF EXISTS SYSDBA.ofUserFlag  CASCADE;

CREATE TABLE SYSDBA.ofUserFlag (
	username VARCHAR2 (64) NOT NULL,
	NAME VARCHAR2 (100) NOT NULL,
	startTime CHAR (15),
	endTime CHAR (15),
	CONSTRAINT ofUserFlag_pk PRIMARY KEY (username, NAME)
);

CREATE INDEX ofUserFlag_sTime_idx ON SYSDBA.ofUserFlag (startTime ASC);

CREATE INDEX ofUserFlag_eTime_idx ON SYSDBA.ofUserFlag (endTime ASC);

DROP TABLE IF EXISTS SYSDBA.ofOffline  CASCADE;

CREATE TABLE SYSDBA.ofOffline (
	username VARCHAR2 (64) NOT NULL,
	messageID INT NOT NULL,
	creationDate CHAR (15) NOT NULL,
	messageSize INT NOT NULL,
	stanza TEXT NOT NULL,
	CONSTRAINT ofOffline_pk PRIMARY KEY (username, messageID)
);

DROP TABLE IF EXISTS SYSDBA.ofPresence  CASCADE;

CREATE TABLE SYSDBA.ofPresence (
	username VARCHAR2 (64) NOT NULL,
	offlinePresence TEXT,
	offlineDate CHAR (15) NOT NULL,
	CONSTRAINT ofPresence_pk PRIMARY KEY (username)
);

DROP TABLE IF EXISTS SYSDBA.ofRoster CASCADE;

CREATE TABLE SYSDBA.ofRoster (
	rosterID INT NOT NULL,
	username VARCHAR2 (64) NOT NULL,
	jid VARCHAR2 (1024) NOT NULL,
	sub INT NOT NULL,
	ask INT NOT NULL,
	recv INT NOT NULL,
	nick VARCHAR2 (255),
	CONSTRAINT ofRoster_pk PRIMARY KEY (rosterID)
);

CREATE INDEX ofRoster_username_idx ON SYSDBA.ofRoster (username ASC);

CREATE INDEX ofRoster_jid_idx ON SYSDBA.ofRoster (jid ASC);

DROP TABLE IF EXISTS SYSDBA.ofRosterGroups  CASCADE;

CREATE TABLE SYSDBA.ofRosterGroups (
	rosterID INT NOT NULL,
	rank INT NOT NULL,
	groupName VARCHAR2 (255) NOT NULL,
	CONSTRAINT ofRosterGroups_pk PRIMARY KEY (rosterID, rank)
);

CREATE INDEX ofRosterGroup_rosterid_idx ON SYSDBA.ofRosterGroups (rosterID ASC);

ALTER TABLE ofRosterGroups ADD CONSTRAINT ofRosterGroups_rosterID_fk FOREIGN KEY (rosterID) REFERENCES ofRoster INITIALLY DEFERRED DEFERRABLE;

DROP TABLE IF EXISTS SYSDBA.ofVCard  CASCADE;

CREATE TABLE SYSDBA.ofVCard (
	username VARCHAR2 (64) NOT NULL,
	vcard TEXT NOT NULL,
	CONSTRAINT ofVCard_pk PRIMARY KEY (username)
);

DROP TABLE IF EXISTS SYSDBA.ofGroup  CASCADE;

CREATE TABLE SYSDBA.ofGroup (
	groupName VARCHAR2 (50) NOT NULL,
	description VARCHAR2 (255),
	CONSTRAINT ofGroup_pk PRIMARY KEY (groupName)
);

DROP TABLE IF EXISTS SYSDBA.ofGroupProp CASCADE;

CREATE TABLE SYSDBA.ofGroupProp (
	groupName VARCHAR (50) NOT NULL,
	NAME VARCHAR2 (100) NOT NULL,
	propValue VARCHAR2 (4000) NOT NULL,
	CONSTRAINT ofGroupProp_pk PRIMARY KEY (groupName, NAME)
);

DROP TABLE IF EXISTS SYSDBA.ofGroupUser CASCADE;

CREATE TABLE SYSDBA.ofGroupUser (
	groupName VARCHAR (50) NOT NULL,
	username VARCHAR2 (100) NOT NULL,
	administrator INT NOT NULL,
	CONSTRAINT ofGroupUser_pk PRIMARY KEY (
		groupName,
		username,
		administrator
	)
);

DROP TABLE IF EXISTS SYSDBA.ofID CASCADE;

CREATE TABLE SYSDBA.ofID (
	idType INT NOT NULL,
	id INT NOT NULL,
	CONSTRAINT ofID_pk PRIMARY KEY (idType)
);

DROP TABLE IF EXISTS SYSDBA.ofProperty CASCADE;

CREATE TABLE SYSDBA.ofProperty (
	NAME VARCHAR2 (100) NOT NULL,
	propValue VARCHAR2 (4000) NOT NULL,
	encrypted INT,
	iv CHAR (24),
	CONSTRAINT ofProperty_pk PRIMARY KEY (NAME)
);

DROP TABLE IF EXISTS SYSDBA.ofVersion CASCADE;

CREATE TABLE SYSDBA.ofVersion (
	NAME VARCHAR2 (50) NOT NULL,
	version INT NOT NULL,
	CONSTRAINT ofVersion_pk PRIMARY KEY (NAME)
);

DROP TABLE IF EXISTS SYSDBA.ofExtComponentConf CASCADE;

CREATE TABLE SYSDBA.ofExtComponentConf (
	subdomain VARCHAR2 (255) NOT NULL,
	wildcard INT NOT NULL,
	secret VARCHAR2 (255),
	permission VARCHAR2 (10) NOT NULL,
	CONSTRAINT ofExtComponentConf_pk PRIMARY KEY (subdomain)
);

DROP TABLE IF EXISTS SYSDBA.ofRemoteServerConf CASCADE;

CREATE TABLE SYSDBA.ofRemoteServerConf (
	xmppDomain VARCHAR2 (255) NOT NULL,
	remotePort INT,
	permission VARCHAR2 (10) NOT NULL,
	CONSTRAINT ofRemoteServerConf_pk PRIMARY KEY (xmppDomain)
);

DROP TABLE IF EXISTS SYSDBA.ofPrivacyList CASCADE;

CREATE TABLE SYSDBA.ofPrivacyList (
	username VARCHAR2 (64) NOT NULL,
	NAME VARCHAR2 (100) NOT NULL,
	isDefault INT NOT NULL,
	list text  NOT NULL,
	CONSTRAINT ofPrivacyList_pk PRIMARY KEY (username, NAME)
);

CREATE INDEX ofPrivacyList_default_idx ON SYSDBA.ofPrivacyList (username, isDefault);

DROP TABLE IF EXISTS SYSDBA.ofSASLAuthorized CASCADE;

CREATE TABLE SYSDBA.ofSASLAuthorized (
	username VARCHAR (64) NOT NULL,
	principal VARCHAR (4000) NOT NULL,
	CONSTRAINT ofSASLAuthorized_pk PRIMARY KEY (username, principal)
);

DROP TABLE IF EXISTS SYSDBA.ofSecurityAuditLog CASCADE;

CREATE TABLE SYSDBA.ofSecurityAuditLog (
	msgID INT NOT NULL,
	username VARCHAR2 (64) NOT NULL,
	entryStamp INT NOT NULL,
	summary VARCHAR2 (255) NOT NULL,
	node VARCHAR2 (255) NOT NULL,
	details VARCHAR2 (4000),
	CONSTRAINT ofSecurityAuditLog_pk PRIMARY KEY (msgID)
);

CREATE INDEX ofSecurityAuditLog_tstamp_idx ON SYSDBA.ofSecurityAuditLog (entryStamp);

CREATE INDEX ofSecurityAuditLog_uname_idx ON SYSDBA.ofSecurityAuditLog (username);

-- MUC Tables
DROP TABLE IF EXISTS SYSDBA.ofMucService CASCADE;

CREATE TABLE SYSDBA.ofMucService (
	serviceID INT NOT NULL,
	subdomain VARCHAR2 (255) NOT NULL,
	description VARCHAR2 (255),
	isHidden INT NOT NULL,
	CONSTRAINT ofMucService_pk PRIMARY KEY (subdomain)
);

CREATE INDEX ofMucService_serviceid_idx ON SYSDBA.ofMucService (serviceID);

DROP TABLE IF EXISTS SYSDBA.ofMucServiceProp CASCADE;

CREATE TABLE SYSDBA.ofMucServiceProp (
	serviceID INT NOT NULL,
	NAME VARCHAR2 (100) NOT NULL,
	propValue VARCHAR2 (1024) NOT NULL,
	CONSTRAINT ofMucServiceProp_pk PRIMARY KEY (serviceID, NAME)
);

DROP TABLE IF EXISTS SYSDBA.ofMucRoom CASCADE;

CREATE TABLE SYSDBA.ofMucRoom (
	serviceID INT NOT NULL,
	roomID INT NOT NULL,
	creationDate CHAR (15) NOT NULL,
	modificationDate CHAR (15) NOT NULL,
	NAME VARCHAR2 (50) NOT NULL,
	naturalName VARCHAR2 (255) NOT NULL,
	description VARCHAR2 (255),
	lockedDate CHAR (15) NOT NULL,
	emptyDate CHAR (15) NULL,
	canChangeSubject INT NOT NULL,
	maxUsers INT NOT NULL,
	publicRoom INT NOT NULL,
	moderated INT NOT NULL,
	membersOnly INT NOT NULL,
	canInvite INT NOT NULL,
	roomPassword VARCHAR2 (50) NULL,
	canDiscoverJID INT NOT NULL,
	logEnabled INT NOT NULL,
	SUBJECT VARCHAR2 (100) NULL,
	rolesToBroadcast INT NOT NULL,
	useReservedNick INT NOT NULL,
	canChangeNick INT NOT NULL,
	canRegister INT NOT NULL,
	allowpm INT NULL,
	CONSTRAINT ofMucRoom_pk PRIMARY KEY (serviceID, NAME)
);

CREATE INDEX ofMucRoom_roomid_idx ON SYSDBA.ofMucRoom (roomID);

CREATE INDEX ofMucRoom_serviceid_idx ON SYSDBA.ofMucRoom (serviceID);

DROP TABLE IF EXISTS SYSDBA.ofMucRoomProp CASCADE;

CREATE TABLE SYSDBA.ofMucRoomProp (
	roomID INT NOT NULL,
	NAME VARCHAR2 (100) NOT NULL,
	propValue VARCHAR2 (1024) NOT NULL,
	CONSTRAINT ofMucRoomProp_pk PRIMARY KEY (roomID, NAME)
);

DROP TABLE IF EXISTS SYSDBA.ofMucAffiliation CASCADE;

CREATE TABLE SYSDBA.ofMucAffiliation (
	roomID INT NOT NULL,
	jid VARCHAR2 (1024) NOT NULL,
	affiliation INT NOT NULL,
	CONSTRAINT ofMucAffiliation_pk PRIMARY KEY (roomID, jid)
);

DROP TABLE IF EXISTS SYSDBA.ofMucMember CASCADE;

CREATE TABLE SYSDBA.ofMucMember (
	roomID INT NOT NULL,
	jid VARCHAR2 (1024) NOT NULL,
	nickname VARCHAR2 (255) NULL,
	firstName VARCHAR2 (100) NULL,
	lastName VARCHAR2 (100) NULL,
	url VARCHAR2 (100) NULL,
	email VARCHAR2 (100) NULL,
	faqentry VARCHAR2 (100) NULL,
	CONSTRAINT ofMucMember_pk PRIMARY KEY (roomID, jid)
);

DROP TABLE IF EXISTS SYSDBA.ofMucConversationLog CASCADE;

CREATE TABLE SYSDBA.ofMucConversationLog (
	roomID INT NOT NULL,
	messageID INT NOT NULL,
	sender VARCHAR2 (1024) NOT NULL,
	nickname VARCHAR2 (255) NULL,
	logTime CHAR (15) NOT NULL,
	SUBJECT VARCHAR2 (255) NULL,
	body VARCHAR2 (4000) NULL,
	stanza VARCHAR2 (4000) NULL
);

CREATE INDEX ofMucConversationLog_time_idx ON SYSDBA.ofMucConversationLog (logTime);

CREATE INDEX ofMucConversationLog_msg_id ON ofMucConversationLog (messageID);

-- PubSub Tables
DROP TABLE IF EXISTS SYSDBA.ofPubsubNode CASCADE;

CREATE TABLE SYSDBA.ofPubsubNode (
	serviceID VARCHAR2 (100) NOT NULL,
	nodeID VARCHAR2 (100) NOT NULL,
	leaf INT NOT NULL,
	creationDate CHAR (15) NOT NULL,
	modificationDate CHAR (15) NOT NULL,
	parent VARCHAR2 (100) NULL,
	deliverPayloads INT NOT NULL,
	maxPayloadSize INT NULL,
	persistItems INT NULL,
	maxItems INT NULL,
	notifyConfigChanges INT NOT NULL,
	notifyDelete INT NOT NULL,
	notifyRetract INT NOT NULL,
	presenceBased INT NOT NULL,
	sendItemSubscribe INT NOT NULL,
	publisherModel VARCHAR2 (15) NOT NULL,
	subscriptionEnabled INT NOT NULL,
	configSubscription INT NOT NULL,
	accessModel VARCHAR2 (10) NOT NULL,
	payloadType VARCHAR2 (100) NULL,
	bodyXSLT VARCHAR2 (100) NULL,
	dataformXSLT VARCHAR2 (100) NULL,
	creator VARCHAR2 (1024) NOT NULL,
	description VARCHAR2 (255) NULL,
	LANGUAGE VARCHAR2 (255) NULL,
	NAME VARCHAR2 (50) NULL,
	replyPolicy VARCHAR2 (15) NULL,
	associationPolicy VARCHAR2 (15) NULL,
	maxLeafNodes INT NULL,
	CONSTRAINT ofPubsubNode_pk PRIMARY KEY (serviceID, nodeID)
);

DROP TABLE IF EXISTS SYSDBA.ofPubsubNodeJIDs CASCADE;

CREATE TABLE SYSDBA.ofPubsubNodeJIDs (
	serviceID VARCHAR2 (100) NOT NULL,
	nodeID VARCHAR2 (100) NOT NULL,
	jid VARCHAR2 (1024) NOT NULL,
	associationType VARCHAR2 (20) NOT NULL,
	CONSTRAINT ofPubsubNodeJIDs_pk PRIMARY KEY (serviceID, nodeID, jid)
);

DROP TABLE IF EXISTS SYSDBA.ofPubsubNodeGroups CASCADE;

CREATE TABLE SYSDBA.ofPubsubNodeGroups (
	serviceID VARCHAR2 (100) NOT NULL,
	nodeID VARCHAR2 (100) NOT NULL,
	rosterGroup VARCHAR2 (100) NOT NULL
);

CREATE INDEX ofPubsubNodeGroups_idx ON SYSDBA.ofPubsubNodeGroups (serviceID, nodeID);

DROP TABLE IF EXISTS SYSDBA.ofPubsubAffiliation CASCADE;

CREATE TABLE SYSDBA.ofPubsubAffiliation (
	serviceID VARCHAR2 (100) NOT NULL,
	nodeID VARCHAR2 (100) NOT NULL,
	jid VARCHAR2 (1024) NOT NULL,
	affiliation VARCHAR2 (10) NOT NULL,
	CONSTRAINT ofPubsubAffiliation_pk PRIMARY KEY (serviceID, nodeID, jid)
);

DROP TABLE IF EXISTS SYSDBA.ofPubsubItem CASCADE;

CREATE TABLE SYSDBA.ofPubsubItem (
	serviceID VARCHAR2 (100) NOT NULL,
	nodeID VARCHAR2 (100) NOT NULL,
	id VARCHAR2 (100) NOT NULL,
	jid VARCHAR2 (1024) NOT NULL,
	creationDate CHAR (15) NOT NULL,
	payload VARCHAR (4000) NULL,
	CONSTRAINT ofPubsubItem_pk PRIMARY KEY (serviceID, nodeID, id)
);

DROP TABLE IF EXISTS SYSDBA.ofPubsubSubscription CASCADE;

CREATE TABLE SYSDBA.ofPubsubSubscription (
	serviceID VARCHAR2 (100) NOT NULL,
	nodeID VARCHAR2 (100) NOT NULL,
	id VARCHAR2 (100) NOT NULL,
	jid VARCHAR2 (1024) NOT NULL,
	OWNER VARCHAR2 (1024) NOT NULL,
	state VARCHAR (15) NOT NULL,
	deliver INT NOT NULL,
	digest INT NOT NULL,
	digest_frequency INT NOT NULL,
	expire CHAR (15) NULL,
	includeBody INT NOT NULL,
	showValues VARCHAR (30) NOT NULL,
	subscriptionType VARCHAR (10) NOT NULL,
	subscriptionDepth INT NOT NULL,
	keyword VARCHAR2 (200) NULL,
	CONSTRAINT ofPubsubSubscription_pk PRIMARY KEY (serviceID, nodeID, id)
);

DROP TABLE IF EXISTS SYSDBA.ofPubsubDefaultConf CASCADE;

CREATE TABLE SYSDBA.ofPubsubDefaultConf (
	serviceID VARCHAR2 (100) NOT NULL,
	leaf INT NOT NULL,
	deliverPayloads INT NOT NULL,
	maxPayloadSize INT NOT NULL,
	persistItems INT NOT NULL,
	maxItems INT NOT NULL,
	notifyConfigChanges INT NOT NULL,
	notifyDelete INT NOT NULL,
	notifyRetract INT NOT NULL,
	presenceBased INT NOT NULL,
	sendItemSubscribe INT NOT NULL,
	publisherModel VARCHAR2 (15) NOT NULL,
	subscriptionEnabled INT NOT NULL,
	accessModel VARCHAR2 (10) NOT NULL,
	LANGUAGE VARCHAR2 (255) NULL,
	replyPolicy VARCHAR2 (15) NULL,
	associationPolicy VARCHAR2 (15) NOT NULL,
	maxLeafNodes INT NOT NULL,
	CONSTRAINT ofPubsubDefaultConf_pk PRIMARY KEY (serviceID, leaf)
);

-- Finally, insert default table values.
INSERT INTO SYSDBA.ofID (idType, id) VALUES (18, 1);

INSERT INTO SYSDBA.ofID (idType, id) VALUES (19, 1);

INSERT INTO SYSDBA.ofID (idType, id) VALUES (23, 1);

INSERT INTO SYSDBA.ofID (idType, id) VALUES (26, 2);

INSERT INTO SYSDBA.ofVersion (NAME, version) VALUES ('openfire', 29);

-- Entry for admin user
INSERT INTO SYSDBA.ofUser (username, plainPassword, name, email, creationDate, modificationDate)
    VALUES ('admin', 'admin', 'Administrator', 'admin@example.com', '0', '0');

-- Entry for default conference service
INSERT INTO SYSDBA.ofMucService (serviceID, subdomain, isHidden) VALUES (1, 'conference', 0);

COMMIT;


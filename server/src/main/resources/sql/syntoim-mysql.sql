/*
Navicat MySQL Data Transfer

Source Server         : im-110
Source Server Version : 50725
Source Host           : 192.168.1.110:3306
Source Database       : syntoim

Target Server Type    : MYSQL
Target Server Version : 50725
File Encoding         : 65001

Date: 2019-04-17 14:40:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for im_license
-- ----------------------------
DROP TABLE IF EXISTS `im_license`;
CREATE TABLE `im_license` (
  `ID` bigint(20) NOT NULL,
  `EXPIRED_DATE` varchar(32) DEFAULT NULL,
  `GROUP_CODE` varchar(32) DEFAULT NULL,
  `GROUP_NAME` varchar(32) DEFAULT NULL,
  `IMPORTED_DATE` timestamp NULL DEFAULT NULL,
  `HASH_KEY` varchar(64) DEFAULT NULL,
  `LICENSE_ID` varchar(64) DEFAULT NULL,
  `RELEASE_DATE` varchar(32) DEFAULT NULL,
  `USED` tinyint(1) NOT NULL,
  `USER_COUNT` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `UKAOIXV7O5RWWX7RAPHS6L1SEML` (`LICENSE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of im_license
-- ----------------------------
INSERT INTO `im_license` VALUES ('158809013212800', '2020-04-17', 'synto', '星图海辉', '2019-04-17 11:51:32', '35C9D4752D220D9A2E6F92E1F75A4FD41C536BA5', 'im-synto-20190417115103', '2019-04-17 11:51:03', '1', '100');

-- ----------------------------
-- Table structure for ofextcomponentconf
-- ----------------------------
DROP TABLE IF EXISTS `ofextcomponentconf`;
CREATE TABLE `ofextcomponentconf` (
  `SUBDOMAIN` varchar(255) NOT NULL,
  `WILDCARD` int(11) NOT NULL,
  `SECRET` varchar(255) DEFAULT NULL,
  `PERMISSION` varchar(10) NOT NULL,
  PRIMARY KEY (`SUBDOMAIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofextcomponentconf
-- ----------------------------

-- ----------------------------
-- Table structure for ofgroup
-- ----------------------------
DROP TABLE IF EXISTS `ofgroup`;
CREATE TABLE `ofgroup` (
  `GROUPNAME` varchar(50) NOT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`GROUPNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofgroup
-- ----------------------------

-- ----------------------------
-- Table structure for ofgroupprop
-- ----------------------------
DROP TABLE IF EXISTS `ofgroupprop`;
CREATE TABLE `ofgroupprop` (
  `GROUPNAME` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `PROPVALUE` varchar(4000) NOT NULL,
  PRIMARY KEY (`GROUPNAME`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofgroupprop
-- ----------------------------

-- ----------------------------
-- Table structure for ofgroupuser
-- ----------------------------
DROP TABLE IF EXISTS `ofgroupuser`;
CREATE TABLE `ofgroupuser` (
  `GROUPNAME` varchar(50) NOT NULL,
  `USERNAME` varchar(100) NOT NULL,
  `ADMINISTRATOR` int(11) NOT NULL,
  PRIMARY KEY (`GROUPNAME`,`USERNAME`,`ADMINISTRATOR`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofgroupuser
-- ----------------------------

-- ----------------------------
-- Table structure for ofid
-- ----------------------------
DROP TABLE IF EXISTS `ofid`;
CREATE TABLE `ofid` (
  `IDTYPE` int(11) NOT NULL,
  `ID` int(11) NOT NULL,
  PRIMARY KEY (`IDTYPE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofid
-- ----------------------------
INSERT INTO `ofid` VALUES ('18', '1');
INSERT INTO `ofid` VALUES ('19', '1');
INSERT INTO `ofid` VALUES ('23', '6');
INSERT INTO `ofid` VALUES ('25', '11');
INSERT INTO `ofid` VALUES ('26', '2');
INSERT INTO `ofid` VALUES ('510', '8');

-- ----------------------------
-- Table structure for ofmucaffiliation
-- ----------------------------
DROP TABLE IF EXISTS `ofmucaffiliation`;
CREATE TABLE `ofmucaffiliation` (
  `ROOMID` int(11) NOT NULL,
  `JID` varchar(1024) NOT NULL,
  `AFFILIATION` int(11) NOT NULL,
  PRIMARY KEY (`ROOMID`,`JID`(70))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofmucaffiliation
-- ----------------------------
INSERT INTO `ofmucaffiliation` VALUES ('1', 'test1@cfnmcp.cn', '10');

-- ----------------------------
-- Table structure for ofmucconversationlog
-- ----------------------------
DROP TABLE IF EXISTS `ofmucconversationlog`;
CREATE TABLE `ofmucconversationlog` (
  `ROOMID` int(11) NOT NULL,
  `MESSAGEID` int(11) NOT NULL,
  `SENDER` varchar(1024) NOT NULL,
  `NICKNAME` varchar(255) DEFAULT NULL,
  `LOGTIME` char(15) NOT NULL,
  `SUBJECT` varchar(255) DEFAULT NULL,
  `BODY` varchar(4000) DEFAULT NULL,
  `STANZA` varchar(4000) DEFAULT NULL,
  KEY `OFMUCCONVERSATIONLOG_MSG_ID` (`MESSAGEID`),
  KEY `OFMUCCONVERSATIONLOG_TIME_IDX` (`LOGTIME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofmucconversationlog
-- ----------------------------
INSERT INTO `ofmucconversationlog` VALUES ('1', '0', 'test1@cfnmcp.cn/SyntoIM-PC', 'test1', '1555480710730', null, '群成员更新啦!', '\n<message to=\"test1@cfnmcp.cn/SyntoIM-PC\" type=\"groupchat\" from=\"201904171358325410@conference.cfnmcp.cn/test1\">\n  <body messageType=\"newMember\">群成员更新啦!</body>\n  <stanza-id xmlns=\"urn:xmpp:sid:0\" id=\"0d000467-b4f1-45dc-a9a6-4ed2f6826982\" by=\"201904171358325410@conference.cfnmcp.cn\"/>\n  <synto>\n    <timestamp>1555480710730</timestamp>\n  </synto>\n</message>');
INSERT INTO `ofmucconversationlog` VALUES ('1', '1', 'test1@cfnmcp.cn/SyntoIM-PC', 'test1', '1555480723410', null, '方法', '\n<message to=\"test1@cfnmcp.cn/SyntoIM-PC\" type=\"groupchat\" from=\"201904171358325410@conference.cfnmcp.cn/test1\">\n  <body>方法</body>\n  <stanza-id xmlns=\"urn:xmpp:sid:0\" id=\"1e9ddea1-4e61-4334-ba26-9318cd6cdb38\" by=\"201904171358325410@conference.cfnmcp.cn\"/>\n  <synto>\n    <timestamp>1555480723410</timestamp>\n  </synto>\n</message>');
INSERT INTO `ofmucconversationlog` VALUES ('1', '2', 'test1@cfnmcp.cn/SyntoIM-PC', 'test1', '1555480980151', null, '6666666', '\n<message to=\"test1@cfnmcp.cn/SyntoIM-PC\" type=\"groupchat\" from=\"201904171358325410@conference.cfnmcp.cn/test1\">\n  <body>6666666</body>\n  <stanza-id xmlns=\"urn:xmpp:sid:0\" id=\"b3073dac-57ae-452c-b108-d0fe4b8fc3f6\" by=\"201904171358325410@conference.cfnmcp.cn\"/>\n  <synto>\n    <timestamp>1555480980151</timestamp>\n  </synto>\n</message>');
INSERT INTO `ofmucconversationlog` VALUES ('1', '3', 'test1@cfnmcp.cn/SyntoIM-PC', 'test1', '1555481035013', null, '888888', '\n<message to=\"test1@cfnmcp.cn/SyntoIM-PC\" type=\"groupchat\" from=\"201904171358325410@conference.cfnmcp.cn/test1\">\n  <body>888888</body>\n  <stanza-id xmlns=\"urn:xmpp:sid:0\" id=\"4da06d89-7507-485e-86c8-0f1305e06369\" by=\"201904171358325410@conference.cfnmcp.cn\"/>\n  <synto>\n    <timestamp>1555481035013</timestamp>\n  </synto>\n</message>');
INSERT INTO `ofmucconversationlog` VALUES ('1', '4', 'test1@cfnmcp.cn/SyntoIM-PC', 'test1', '1555481043465', null, '-------------', '\n<message to=\"test1@cfnmcp.cn/SyntoIM-PC\" type=\"groupchat\" from=\"201904171358325410@conference.cfnmcp.cn/test1\">\n  <body>-------------</body>\n  <stanza-id xmlns=\"urn:xmpp:sid:0\" id=\"14e7d4d1-fccb-4025-be94-90014bbfae8a\" by=\"201904171358325410@conference.cfnmcp.cn\"/>\n  <synto>\n    <timestamp>1555481043465</timestamp>\n  </synto>\n</message>');

-- ----------------------------
-- Table structure for ofmucmember
-- ----------------------------
DROP TABLE IF EXISTS `ofmucmember`;
CREATE TABLE `ofmucmember` (
  `ROOMID` int(11) NOT NULL,
  `JID` varchar(1024) NOT NULL,
  `NICKNAME` varchar(255) DEFAULT NULL,
  `FIRSTNAME` varchar(100) DEFAULT NULL,
  `LASTNAME` varchar(100) DEFAULT NULL,
  `URL` varchar(100) DEFAULT NULL,
  `EMAIL` varchar(100) DEFAULT NULL,
  `FAQENTRY` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ROOMID`,`JID`(70))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofmucmember
-- ----------------------------
INSERT INTO `ofmucmember` VALUES ('1', 'test2@cfnmcp.cn', null, null, null, null, null, null);

-- ----------------------------
-- Table structure for ofmucroom
-- ----------------------------
DROP TABLE IF EXISTS `ofmucroom`;
CREATE TABLE `ofmucroom` (
  `SERVICEID` int(11) NOT NULL,
  `ROOMID` int(11) NOT NULL,
  `CREATIONDATE` char(15) NOT NULL,
  `MODIFICATIONDATE` char(15) NOT NULL,
  `name` varchar(50) NOT NULL,
  `NATURALNAME` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `LOCKEDDATE` char(15) NOT NULL,
  `EMPTYDATE` char(15) DEFAULT NULL,
  `CANCHANGESUBJECT` int(11) NOT NULL,
  `MAXUSERS` int(11) NOT NULL,
  `PUBLICROOM` int(11) NOT NULL,
  `MODERATED` int(11) NOT NULL,
  `MEMBERSONLY` int(11) NOT NULL,
  `CANINVITE` int(11) NOT NULL,
  `ROOMPASSWORD` varchar(50) DEFAULT NULL,
  `CANDISCOVERJID` int(11) NOT NULL,
  `LOGENABLED` int(11) NOT NULL,
  `SUBJECT` varchar(100) DEFAULT NULL,
  `ROLESTOBROADCAST` int(11) NOT NULL,
  `USERESERVEDNICK` int(11) NOT NULL,
  `CANCHANGENICK` int(11) NOT NULL,
  `CANREGISTER` int(11) NOT NULL,
  `ALLOWPM` int(11) DEFAULT NULL,
  PRIMARY KEY (`SERVICEID`,`name`),
  KEY `OFMUCROOM_ROOMID_IDX` (`ROOMID`),
  KEY `OFMUCROOM_SERVICEID_IDX` (`SERVICEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofmucroom
-- ----------------------------
INSERT INTO `ofmucroom` VALUES ('1', '1', '001555480710555', '001555480710598', '201904171358325410', '测试群', '', '000000000000000', '001555482390618', '1', '0', '0', '1', '1', '1', null, '1', '1', '', '7', '0', '1', '1', '0');

-- ----------------------------
-- Table structure for ofmucroomprop
-- ----------------------------
DROP TABLE IF EXISTS `ofmucroomprop`;
CREATE TABLE `ofmucroomprop` (
  `ROOMID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `PROPVALUE` varchar(1024) NOT NULL,
  PRIMARY KEY (`ROOMID`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofmucroomprop
-- ----------------------------

-- ----------------------------
-- Table structure for ofmucservice
-- ----------------------------
DROP TABLE IF EXISTS `ofmucservice`;
CREATE TABLE `ofmucservice` (
  `SERVICEID` int(11) NOT NULL,
  `SUBDOMAIN` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `ISHIDDEN` int(11) NOT NULL,
  PRIMARY KEY (`SUBDOMAIN`),
  KEY `OFMUCSERVICE_SERVICEID_IDX` (`SERVICEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofmucservice
-- ----------------------------
INSERT INTO `ofmucservice` VALUES ('1', 'conference', null, '0');

-- ----------------------------
-- Table structure for ofmucserviceprop
-- ----------------------------
DROP TABLE IF EXISTS `ofmucserviceprop`;
CREATE TABLE `ofmucserviceprop` (
  `SERVICEID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `PROPVALUE` varchar(1024) NOT NULL,
  PRIMARY KEY (`SERVICEID`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofmucserviceprop
-- ----------------------------
INSERT INTO `ofmucserviceprop` VALUES ('1', 'history.type', 'none');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.canAnyoneDiscoverJID', 'true');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.canChangeNickname', 'true');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.canOccupantsChangeSubject', 'true');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.canOccupantsInvite', 'true');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.logEnabled', 'true');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.loginRestrictedToNickname', 'false');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.maxUsers', '0');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.membersOnly', 'true');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.moderated', 'true');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.persistent', 'true');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.publicRoom', 'true');
INSERT INTO `ofmucserviceprop` VALUES ('1', 'room.registrationEnabled', 'true');

-- ----------------------------
-- Table structure for ofoffline
-- ----------------------------
DROP TABLE IF EXISTS `ofoffline`;
CREATE TABLE `ofoffline` (
  `USERNAME` varchar(64) NOT NULL,
  `MESSAGEID` int(11) NOT NULL,
  `CREATIONDATE` char(15) NOT NULL,
  `MESSAGESIZE` int(11) NOT NULL,
  `STANZA` text NOT NULL,
  PRIMARY KEY (`USERNAME`,`MESSAGEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofoffline
-- ----------------------------

-- ----------------------------
-- Table structure for ofpresence
-- ----------------------------
DROP TABLE IF EXISTS `ofpresence`;
CREATE TABLE `ofpresence` (
  `USERNAME` varchar(64) NOT NULL,
  `OFFLINEPRESENCE` text,
  `OFFLINEDATE` char(15) NOT NULL,
  PRIMARY KEY (`USERNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofpresence
-- ----------------------------
INSERT INTO `ofpresence` VALUES ('test1', null, '001555482390623');
INSERT INTO `ofpresence` VALUES ('test2', null, '001555482388049');

-- ----------------------------
-- Table structure for ofprivacylist
-- ----------------------------
DROP TABLE IF EXISTS `ofprivacylist`;
CREATE TABLE `ofprivacylist` (
  `USERNAME` varchar(64) NOT NULL,
  `name` varchar(100) NOT NULL,
  `ISDEFAULT` int(11) NOT NULL,
  `LIST` text NOT NULL,
  PRIMARY KEY (`USERNAME`,`name`),
  KEY `OFPRIVACYLIST_DEFAULT_IDX` (`USERNAME`,`ISDEFAULT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofprivacylist
-- ----------------------------

-- ----------------------------
-- Table structure for ofproperty
-- ----------------------------
DROP TABLE IF EXISTS `ofproperty`;
CREATE TABLE `ofproperty` (
  `NAME` varchar(100) NOT NULL,
  `PROPVALUE` varchar(4000) NOT NULL,
  `ENCRYPTED` int(11) DEFAULT NULL,
  `IV` char(24) DEFAULT NULL,
  PRIMARY KEY (`NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofproperty
-- ----------------------------
INSERT INTO `ofproperty` VALUES ('admin.authorizedJIDs', 'admin@cfnmcp.cn', '0', null);
INSERT INTO `ofproperty` VALUES ('passwordKey', 'FOEAzMK9lIHNTH7', '0', null);
INSERT INTO `ofproperty` VALUES ('plugin.presence.public', 'true', '0', null);
INSERT INTO `ofproperty` VALUES ('plugin.presence.unavailable.status', 'Unavailable', '0', null);
INSERT INTO `ofproperty` VALUES ('plugin.restapi.allowedIPs', '', '0', null);
INSERT INTO `ofproperty` VALUES ('plugin.restapi.enabled', 'true', '0', null);
INSERT INTO `ofproperty` VALUES ('plugin.restapi.httpAuth', 'secret', '0', null);
INSERT INTO `ofproperty` VALUES ('plugin.restapi.secret', 'fUzh1mfo4yVFjhct', '0', null);
INSERT INTO `ofproperty` VALUES ('plugin.restapi.serviceLoggingEnabled', 'false', '0', null);
INSERT INTO `ofproperty` VALUES ('provider.admin.className', 'org.jivesoftware.openfire.admin.DefaultAdminProvider', '0', null);
INSERT INTO `ofproperty` VALUES ('provider.auth.className', 'org.jivesoftware.openfire.auth.DefaultAuthProvider', '0', null);
INSERT INTO `ofproperty` VALUES ('provider.group.className', 'org.jivesoftware.openfire.group.DefaultGroupProvider', '0', null);
INSERT INTO `ofproperty` VALUES ('provider.lockout.className', 'org.jivesoftware.openfire.lockout.DefaultLockOutProvider', '0', null);
INSERT INTO `ofproperty` VALUES ('provider.securityAudit.className', 'org.jivesoftware.openfire.security.DefaultSecurityAuditProvider', '0', null);
INSERT INTO `ofproperty` VALUES ('provider.user.className', 'org.jivesoftware.openfire.user.DefaultUserProvider', '0', null);
INSERT INTO `ofproperty` VALUES ('provider.vcard.className', 'org.igniterealtime.openfire.plugin.avatarresizer.DelegateVCardProvider', '0', null);
INSERT INTO `ofproperty` VALUES ('route.all-resources', 'true', '0', null);
INSERT INTO `ofproperty` VALUES ('sasl.scram-sha-1.iteration-count', '4096', '0', null);
INSERT INTO `ofproperty` VALUES ('update.lastCheck', '1555469881845', '0', null);
INSERT INTO `ofproperty` VALUES ('update.notify-admins', 'false', '0', null);
INSERT INTO `ofproperty` VALUES ('update.proxy.port', '-1', '0', null);
INSERT INTO `ofproperty` VALUES ('update.service-enabled', 'false', '0', null);
INSERT INTO `ofproperty` VALUES ('user-status.historyDays', '7', '0', null);
INSERT INTO `ofproperty` VALUES ('xmpp.auth.anonymous', 'false', '0', null);
INSERT INTO `ofproperty` VALUES ('xmpp.domain', 'cfnmcp.cn', '0', null);
INSERT INTO `ofproperty` VALUES ('xmpp.session.conflict-limit', '0', '0', null);
INSERT INTO `ofproperty` VALUES ('xmpp.socket.ssl.active', 'true', '0', null);

-- ----------------------------
-- Table structure for ofpubsubaffiliation
-- ----------------------------
DROP TABLE IF EXISTS `ofpubsubaffiliation`;
CREATE TABLE `ofpubsubaffiliation` (
  `SERVICEID` varchar(100) NOT NULL,
  `NODEID` varchar(100) NOT NULL,
  `JID` varchar(1024) NOT NULL,
  `AFFILIATION` varchar(10) NOT NULL,
  PRIMARY KEY (`SERVICEID`,`NODEID`,`JID`(70))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofpubsubaffiliation
-- ----------------------------
INSERT INTO `ofpubsubaffiliation` VALUES ('pubsub', '', 'cfnmcp.cn', 'owner');

-- ----------------------------
-- Table structure for ofpubsubdefaultconf
-- ----------------------------
DROP TABLE IF EXISTS `ofpubsubdefaultconf`;
CREATE TABLE `ofpubsubdefaultconf` (
  `SERVICEID` varchar(100) NOT NULL,
  `LEAF` int(11) NOT NULL,
  `DELIVERPAYLOADS` int(11) NOT NULL,
  `MAXPAYLOADSIZE` int(11) NOT NULL,
  `PERSISTITEMS` int(11) NOT NULL,
  `MAXITEMS` int(11) NOT NULL,
  `NOTIFYCONFIGCHANGES` int(11) NOT NULL,
  `NOTIFYDELETE` int(11) NOT NULL,
  `NOTIFYRETRACT` int(11) NOT NULL,
  `PRESENCEBASED` int(11) NOT NULL,
  `SENDITEMSUBSCRIBE` int(11) NOT NULL,
  `PUBLISHERMODEL` varchar(15) NOT NULL,
  `SUBSCRIPTIONENABLED` int(11) NOT NULL,
  `ACCESSMODEL` varchar(10) NOT NULL,
  `LANGUAGE` varchar(255) DEFAULT NULL,
  `REPLYPOLICY` varchar(15) DEFAULT NULL,
  `ASSOCIATIONPOLICY` varchar(15) NOT NULL,
  `MAXLEAFNODES` int(11) NOT NULL,
  PRIMARY KEY (`SERVICEID`,`LEAF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofpubsubdefaultconf
-- ----------------------------
INSERT INTO `ofpubsubdefaultconf` VALUES ('pubsub', '0', '0', '0', '0', '0', '1', '1', '1', '0', '0', 'publishers', '1', 'open', 'English', null, 'all', '-1');
INSERT INTO `ofpubsubdefaultconf` VALUES ('pubsub', '1', '1', '5120', '0', '1', '1', '1', '1', '0', '1', 'publishers', '1', 'open', 'English', null, 'all', '-1');

-- ----------------------------
-- Table structure for ofpubsubitem
-- ----------------------------
DROP TABLE IF EXISTS `ofpubsubitem`;
CREATE TABLE `ofpubsubitem` (
  `SERVICEID` varchar(100) NOT NULL,
  `NODEID` varchar(100) NOT NULL,
  `ID` varchar(100) NOT NULL,
  `JID` varchar(1024) NOT NULL,
  `CREATIONDATE` char(15) NOT NULL,
  `PAYLOAD` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`SERVICEID`,`NODEID`,`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofpubsubitem
-- ----------------------------

-- ----------------------------
-- Table structure for ofpubsubnode
-- ----------------------------
DROP TABLE IF EXISTS `ofpubsubnode`;
CREATE TABLE `ofpubsubnode` (
  `SERVICEID` varchar(100) NOT NULL,
  `NODEID` varchar(100) NOT NULL,
  `LEAF` int(11) NOT NULL,
  `CREATIONDATE` char(15) NOT NULL,
  `MODIFICATIONDATE` char(15) NOT NULL,
  `PARENT` varchar(100) DEFAULT NULL,
  `DELIVERPAYLOADS` int(11) NOT NULL,
  `MAXPAYLOADSIZE` int(11) DEFAULT NULL,
  `PERSISTITEMS` int(11) DEFAULT NULL,
  `MAXITEMS` int(11) DEFAULT NULL,
  `NOTIFYCONFIGCHANGES` int(11) NOT NULL,
  `NOTIFYDELETE` int(11) NOT NULL,
  `NOTIFYRETRACT` int(11) NOT NULL,
  `PRESENCEBASED` int(11) NOT NULL,
  `SENDITEMSUBSCRIBE` int(11) NOT NULL,
  `PUBLISHERMODEL` varchar(15) NOT NULL,
  `SUBSCRIPTIONENABLED` int(11) NOT NULL,
  `CONFIGSUBSCRIPTION` int(11) NOT NULL,
  `ACCESSMODEL` varchar(10) NOT NULL,
  `PAYLOADTYPE` varchar(100) DEFAULT NULL,
  `BODYXSLT` varchar(100) DEFAULT NULL,
  `DATAFORMXSLT` varchar(100) DEFAULT NULL,
  `CREATOR` varchar(1024) NOT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `LANGUAGE` varchar(255) DEFAULT NULL,
  `NAME` varchar(50) DEFAULT NULL,
  `REPLYPOLICY` varchar(15) DEFAULT NULL,
  `ASSOCIATIONPOLICY` varchar(15) DEFAULT NULL,
  `MAXLEAFNODES` int(11) DEFAULT NULL,
  PRIMARY KEY (`SERVICEID`,`NODEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofpubsubnode
-- ----------------------------
INSERT INTO `ofpubsubnode` VALUES ('pubsub', '', '0', '001554965573793', '001554965573793', null, '0', '0', '0', '0', '1', '1', '1', '0', '0', 'publishers', '1', '0', 'open', '', '', '', 'cfnmcp.cn', '', 'English', '', null, 'all', '-1');

-- ----------------------------
-- Table structure for ofpubsubnodegroups
-- ----------------------------
DROP TABLE IF EXISTS `ofpubsubnodegroups`;
CREATE TABLE `ofpubsubnodegroups` (
  `SERVICEID` varchar(100) NOT NULL,
  `NODEID` varchar(100) NOT NULL,
  `ROSTERGROUP` varchar(100) NOT NULL,
  KEY `OFPUBSUBNODEGROUPS_IDX` (`SERVICEID`,`NODEID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofpubsubnodegroups
-- ----------------------------

-- ----------------------------
-- Table structure for ofpubsubnodejids
-- ----------------------------
DROP TABLE IF EXISTS `ofpubsubnodejids`;
CREATE TABLE `ofpubsubnodejids` (
  `SERVICEID` varchar(100) NOT NULL,
  `NODEID` varchar(100) NOT NULL,
  `JID` varchar(1024) NOT NULL,
  `ASSOCIATIONTYPE` varchar(20) NOT NULL,
  PRIMARY KEY (`SERVICEID`,`NODEID`,`JID`(70))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofpubsubnodejids
-- ----------------------------

-- ----------------------------
-- Table structure for ofpubsubsubscription
-- ----------------------------
DROP TABLE IF EXISTS `ofpubsubsubscription`;
CREATE TABLE `ofpubsubsubscription` (
  `SERVICEID` varchar(100) NOT NULL,
  `NODEID` varchar(100) NOT NULL,
  `ID` varchar(100) NOT NULL,
  `JID` varchar(1024) NOT NULL,
  `OWNER` varchar(1024) NOT NULL,
  `STATE` varchar(15) NOT NULL,
  `DELIVER` int(11) NOT NULL,
  `DIGEST` int(11) NOT NULL,
  `DIGEST_FREQUENCY` int(11) NOT NULL,
  `EXPIRE` char(15) DEFAULT NULL,
  `INCLUDEBODY` int(11) NOT NULL,
  `SHOWVALUES` varchar(30) NOT NULL,
  `SUBSCRIPTIONTYPE` varchar(10) NOT NULL,
  `SUBSCRIPTIONDEPTH` int(11) NOT NULL,
  `KEYWORD` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`SERVICEID`,`NODEID`,`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofpubsubsubscription
-- ----------------------------

-- ----------------------------
-- Table structure for ofremoteserverconf
-- ----------------------------
DROP TABLE IF EXISTS `ofremoteserverconf`;
CREATE TABLE `ofremoteserverconf` (
  `XMPPDOMAIN` varchar(255) NOT NULL,
  `REMOTEPORT` int(11) DEFAULT NULL,
  `PERMISSION` varchar(10) NOT NULL,
  PRIMARY KEY (`XMPPDOMAIN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofremoteserverconf
-- ----------------------------

-- ----------------------------
-- Table structure for ofroster
-- ----------------------------
DROP TABLE IF EXISTS `ofroster`;
CREATE TABLE `ofroster` (
  `ROSTERID` int(11) NOT NULL,
  `USERNAME` varchar(64) NOT NULL,
  `JID` varchar(1024) NOT NULL,
  `SUB` int(11) NOT NULL,
  `ASK` int(11) NOT NULL,
  `RECV` int(11) NOT NULL,
  `NICK` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ROSTERID`),
  KEY `OFROSTER_JID_IDX` (`JID`(70)),
  KEY `OFROSTER_USERNAME_IDX` (`USERNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofroster
-- ----------------------------

-- ----------------------------
-- Table structure for ofrostergroups
-- ----------------------------
DROP TABLE IF EXISTS `ofrostergroups`;
CREATE TABLE `ofrostergroups` (
  `ROSTERID` int(11) NOT NULL,
  `RANK` int(11) NOT NULL,
  `GROUPNAME` varchar(255) NOT NULL,
  PRIMARY KEY (`ROSTERID`,`RANK`),
  KEY `ofRosterGroup_rosterid_idx` (`ROSTERID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofrostergroups
-- ----------------------------

-- ----------------------------
-- Table structure for ofsaslauthorized
-- ----------------------------
DROP TABLE IF EXISTS `ofsaslauthorized`;
CREATE TABLE `ofsaslauthorized` (
  `USERNAME` varchar(64) NOT NULL,
  `PRINCIPAL` varchar(4000) NOT NULL,
  PRIMARY KEY (`USERNAME`,`PRINCIPAL`(200))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofsaslauthorized
-- ----------------------------

-- ----------------------------
-- Table structure for ofsecurityauditlog
-- ----------------------------
DROP TABLE IF EXISTS `ofsecurityauditlog`;
CREATE TABLE `ofsecurityauditlog` (
  `MSGID` int(11) NOT NULL,
  `USERNAME` varchar(64) NOT NULL,
  `ENTRYSTAMP` int(11) NOT NULL,
  `SUMMARY` varchar(255) NOT NULL,
  `NODE` varchar(255) NOT NULL,
  `DETAILS` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`MSGID`),
  KEY `OFSECURITYAUDITLOG_TSTAMP_IDX` (`ENTRYSTAMP`),
  KEY `OFSECURITYAUDITLOG_UNAME_IDX` (`USERNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofsecurityauditlog
-- ----------------------------

-- ----------------------------
-- Table structure for ofuser
-- ----------------------------
DROP TABLE IF EXISTS `ofuser`;
CREATE TABLE `ofuser` (
  `USERNAME` varchar(64) NOT NULL,
  `STOREDKEY` varchar(32) DEFAULT NULL,
  `SERVERKEY` varchar(32) DEFAULT NULL,
  `SALT` varchar(32) DEFAULT NULL,
  `ITERATIONS` int(11) DEFAULT NULL,
  `PLAINPASSWORD` varchar(64) DEFAULT NULL,
  `ENCRYPTEDPASSWORD` varchar(255) DEFAULT NULL,
  `NAME` varchar(100) DEFAULT NULL,
  `EMAIL` varchar(100) DEFAULT NULL,
  `CREATIONDATE` varchar(15) NOT NULL,
  `MODIFICATIONDATE` varchar(15) NOT NULL,
  `ID` bigint(20) NOT NULL,
  `GROUP_CODE` varchar(256) DEFAULT NULL,
  `IDENTITY` varchar(64) DEFAULT NULL,
  `SEX` varchar(4) DEFAULT NULL,
  `STATUS` varchar(8) DEFAULT NULL,
  `TELEPHONE` varchar(32) DEFAULT NULL,
  `USER_CARD` varchar(18) DEFAULT NULL,
  `GROUP_ROOT_CODE` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `OFUSER_CDATE_IDX` (`CREATIONDATE`),
  KEY `UKBT1F0072O9H9A62989H06PV8Q` (`USERNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofuser
-- ----------------------------
INSERT INTO `ofuser` VALUES ('admin', null, null, null, null, 'admin', null, 'Administrator', 'admin@example.com', '0', '0', '1', null, null, null, null, null, null, null);
INSERT INTO `ofuser` VALUES ('zyk', '3CDc+VlPXAo/EaXoL+thBeWQGNQ=', 'w1vRa6uzWGCxTPj+3rLDnV19LYA=', 'aOUuoq6ptZZZUSEvBJxV51okjMx7fJ3G', '4096', '7C4A8D09CA3762AF61E59520943DC26494F8941B', 'b6784234c2d5327433194b614ce1c9fe14a9223543f121b5', '张亚康', '', '1555473123187', '1555473123188', '158809135502976', '00001', '1', '男', null, '', '', 'synto');
INSERT INTO `ofuser` VALUES ('gsb', 'CfCzeSkGWQNLPdNMe5UxBRcvB00=', 'TSiFJ4VJiUG+z7f9Fo5nPZPTkQI=', 'dmBTloi3vNr1AmRQ7LpTg/3WKhQqxGzs', '4096', '7C4A8D09CA3762AF61E59520943DC26494F8941B', '521ca4e0a0575115ecc6814047e149ae04c09d13984c9535', '耿少斌', '', '1555473156755', '1555473156755', '158809204242048', '00001', '1', '男', null, '', '', 'synto');
INSERT INTO `ofuser` VALUES ('tjw', 'xlcvdiv4Ot3g5tzxIuwgyQcpptA=', '0Y1Cs2XMgATEowNQV2ma6p070R8=', '4b0Fi02FMWWN1FkBfvsY7U/aiVrRU827', '4096', '7C4A8D09CA3762AF61E59520943DC26494F8941B', 'c3606ca4343d9ab8c7d6dd305bb9a1b8ad54baddf2f47871', '田建伟', '', '1555473173971', '1555473173971', '158809239498368', '00001', '1', '男', null, '', '', 'synto');
INSERT INTO `ofuser` VALUES ('jsr', 'hEPp8aCaegAfY3wNx7OTOgHI5KE=', 'RXX1k5vp5WzBkMjHybr+WS/cQlQ=', 'q8DkYgzS0qeVlyglaI33ifW3IYCHFPSB', '4096', '7C4A8D09CA3762AF61E59520943DC26494F8941B', '962bcc855543b1f3ccc8abc39b58bf2f08610effd93240ab', '贾曙瑞', '', '1555473196374', '1555473196374', '158809285379712', '00001', '1', '男', null, '', '', 'synto');
INSERT INTO `ofuser` VALUES ('wxy', '+e3OaMuDUFFSq1QPNzl0oiokn0s=', 'nUFpm+Q8UHV6p727wD08eLAtBUM=', 'QwXDYuWD4hcJZxwRNtPocVA+nYtuCfUx', '4096', '7C4A8D09CA3762AF61E59520943DC26494F8941B', 'a2c5e542133e6f12fb26379f97fc1a15e69242b9314ae9d0', '王学英', '', '1555473212325', '1555473212326', '158809318053504', '00001', '1', '男', null, '', '', 'synto');
INSERT INTO `ofuser` VALUES ('test', 'nRt5u7joc0nLHcvon34WRWJxHp0=', 'hSFR6hJrtVe3lgdjhYjb8BvRVRw=', 'D5Ig7WskDySJbSDKXjyAM8lBOQCYI/1F', '4096', '7C4A8D09CA3762AF61E59520943DC26494F8941B', 'f17df4abfd6cfda6620fdbcb494133d96576f7b2b54573e1', '测试', '', '1555473234262', '1555473234262', '158809362976384', '00002', '1', '男', null, '', '', 'synto');
INSERT INTO `ofuser` VALUES ('test1', 'IouKSDAua4hoL9ca+meKixS5EVk=', '46lo00C8+S5eky4Aia3tNj+L854=', 'RAd3nfdgl2Y4hIxiHr+31QhVH++Ma17n', '4096', '7C4A8D09CA3762AF61E59520943DC26494F8941B', '5e6c0828fd154215fdbc8ec12493abd9ca895eaf1fd3fd9c', '测试1', '', '1555473254825', '1555473254825', '158809405097600', '00002', '1', '男', null, '', '', 'synto');
INSERT INTO `ofuser` VALUES ('test2', 'yjr+KJ+JQWMGnAkwi4zSOgZVRj8=', 'QzcXyDrXhJSL9ejPj0yJ+Efb8JA=', 'CPAKqvT6uvbqHZ4eu87d++QAMCkIWAby', '4096', '7C4A8D09CA3762AF61E59520943DC26494F8941B', '97d1b255433ad04bf84f4fdce9e5afc2bb5cc8857869f585', '测试2', '', '1555473272715', '1555473272715', '158809441730176', '00002', '1', '男', null, '', '', 'synto');

-- ----------------------------
-- Table structure for ofuserflag
-- ----------------------------
DROP TABLE IF EXISTS `ofuserflag`;
CREATE TABLE `ofuserflag` (
  `USERNAME` varchar(64) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `STARTTIME` char(15) DEFAULT NULL,
  `ENDTIME` char(15) DEFAULT NULL,
  PRIMARY KEY (`USERNAME`,`NAME`),
  KEY `OFUSERFLAG_ETIME_IDX` (`ENDTIME`),
  KEY `OFUSERFLAG_STIME_IDX` (`STARTTIME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofuserflag
-- ----------------------------

-- ----------------------------
-- Table structure for ofuserprop
-- ----------------------------
DROP TABLE IF EXISTS `ofuserprop`;
CREATE TABLE `ofuserprop` (
  `USERNAME` varchar(64) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `PROPVALUE` varchar(1024) NOT NULL,
  PRIMARY KEY (`USERNAME`,`NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofuserprop
-- ----------------------------
INSERT INTO `ofuserprop` VALUES ('admin', 'console.rows_per_page', '/session-summary.jsp=25');

-- ----------------------------
-- Table structure for ofuser_log
-- ----------------------------
DROP TABLE IF EXISTS `ofuser_log`;
CREATE TABLE `ofuser_log` (
  `ID` bigint(20) NOT NULL,
  `GROUP_CODE` varchar(255) DEFAULT NULL,
  `GROUP_NAME` varchar(128) DEFAULT NULL,
  `IP_ADDRESS` varchar(255) DEFAULT NULL,
  `MAC_ADDRESS` varchar(255) DEFAULT NULL,
  `OPERATION` varchar(255) DEFAULT NULL,
  `STATUS` varchar(64) DEFAULT NULL,
  `TERMINAL` varchar(128) DEFAULT NULL,
  `CREATE_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `USER_ID` bigint(20) DEFAULT NULL,
  `USERNAME` varchar(128) DEFAULT NULL,
  `group_root_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofuser_log
-- ----------------------------
INSERT INTO `ofuser_log` VALUES ('158823701466752', '00002', '测试部', '127.0.0.1', null, '用户登录！', '上线！', 'SyntoIM-PC', '2019-04-17 13:50:35', '158809441730176', 'test2', 'synto');
INSERT INTO `ofuser_log` VALUES ('158823752654464', '00002', '测试部', '127.0.0.1', null, '用户退出！', '下线！', 'SyntoIM-PC', '2019-04-17 13:51:00', '158809441730176', 'test2', 'synto');
INSERT INTO `ofuser_log` VALUES ('158823765880448', '00002', '测试部', '127.0.0.1', null, '用户登录！', '上线！', 'SyntoIM-PC', '2019-04-17 13:51:07', '158809405097600', 'test1', 'synto');
INSERT INTO `ofuser_log` VALUES ('158829784917632', '00001', '研发部', '127.0.0.1', null, '用户登录！', '上线！', null, '2019-04-17 14:40:06', '158809239498368', 'tjw', 'synto');

-- ----------------------------
-- Table structure for ofvcard
-- ----------------------------
DROP TABLE IF EXISTS `ofvcard`;
CREATE TABLE `ofvcard` (
  `USERNAME` varchar(64) NOT NULL,
  `VCARD` mediumtext NOT NULL,
  PRIMARY KEY (`USERNAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofvcard
-- ----------------------------
INSERT INTO `ofvcard` VALUES ('gsb', '<vCard xmlns=\"vcard-temp\"><name>耿少斌</name><sex>男</sex><photo></photo></vCard>');
INSERT INTO `ofvcard` VALUES ('jsr', '<vCard xmlns=\"vcard-temp\"><name>贾曙瑞</name><sex>男</sex><photo></photo></vCard>');
INSERT INTO `ofvcard` VALUES ('test', '<vCard xmlns=\"vcard-temp\"><name>测试</name><sex>男</sex><photo></photo></vCard>');
INSERT INTO `ofvcard` VALUES ('test1', '<vCard xmlns=\"vcard-temp\"><name>测试1</name><sex>男</sex><photo></photo></vCard>');
INSERT INTO `ofvcard` VALUES ('test2', '<vCard xmlns=\"vcard-temp\"><name>测试2</name><sex>男</sex><photo></photo></vCard>');
INSERT INTO `ofvcard` VALUES ('tjw', '<vCard xmlns=\"vcard-temp\"><name>田建伟</name><sex>男</sex><photo></photo></vCard>');
INSERT INTO `ofvcard` VALUES ('wxy', '<vCard xmlns=\"vcard-temp\"><name>王学英</name><sex>男</sex><photo></photo></vCard>');
INSERT INTO `ofvcard` VALUES ('zyk', '<vCard xmlns=\"vcard-temp\"><name>张亚康</name><sex>男</sex><photo></photo></vCard>');

-- ----------------------------
-- Table structure for ofversion
-- ----------------------------
DROP TABLE IF EXISTS `ofversion`;
CREATE TABLE `ofversion` (
  `NAME` varchar(50) NOT NULL,
  `VERSION` int(11) NOT NULL,
  PRIMARY KEY (`NAME`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ofversion
-- ----------------------------
INSERT INTO `ofversion` VALUES ('openfire', '29');
INSERT INTO `ofversion` VALUES ('user-status', '0');

-- ----------------------------
-- Table structure for of_message_history
-- ----------------------------
DROP TABLE IF EXISTS `of_message_history`;
CREATE TABLE `of_message_history` (
  `ID` bigint(20) NOT NULL,
  `MESSAGE` mediumtext,
  `RECEIVER` varchar(128) DEFAULT NULL,
  `SENDER` varchar(128) DEFAULT NULL,
  `CREATED_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of of_message_history
-- ----------------------------

-- ----------------------------
-- Table structure for syntoim_ofmucoffline
-- ----------------------------
DROP TABLE IF EXISTS `syntoim_ofmucoffline`;
CREATE TABLE `syntoim_ofmucoffline` (
  `id` bigint(20) NOT NULL,
  `first` bigint(20) DEFAULT NULL,
  `last` bigint(20) DEFAULT NULL,
  `room` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of syntoim_ofmucoffline
-- ----------------------------

-- ----------------------------
-- Table structure for um_admin
-- ----------------------------
DROP TABLE IF EXISTS `um_admin`;
CREATE TABLE `um_admin` (
  `ID` bigint(20) NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ENCRYPTEDPASSWORD` varchar(255) DEFAULT NULL,
  `GROUP_CODE` varchar(255) DEFAULT NULL,
  `GROUP_NAME` varchar(128) DEFAULT NULL,
  `NICKNAME` varchar(256) DEFAULT NULL,
  `PLAINPASSWORD` varchar(64) DEFAULT NULL,
  `SALT` varchar(64) DEFAULT NULL,
  `TELEPHONE` varchar(255) DEFAULT NULL,
  `UPDATE_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `USERNAME` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_admin
-- ----------------------------
INSERT INTO `um_admin` VALUES ('1', '2019-04-17 10:42:02', 'b78d09a26a2941502a612274da81abd34e4fe7c29cd43100', '-1', null, 'Administrator', '7C4A8D09CA3762AF61E59520943DC26494F8941B', 'rIElXcP+c13TyB2IxUzimltQahH+4ACp', '', '2019-04-08 20:02:15', 'superAdmin');
INSERT INTO `um_admin` VALUES ('158802945851008', '2019-04-17 11:01:41', null, 'synto', null, null, '3D4F2BF07DC1BE38B20CD6E46949A1071F9D0E3D', null, null, '2019-04-17 11:01:41', 'synto');

-- ----------------------------
-- Table structure for um_admin11
-- ----------------------------
DROP TABLE IF EXISTS `um_admin11`;
CREATE TABLE `um_admin11` (
  `ID` bigint(20) NOT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ENCRYPTEDPASSWORD` varchar(255) DEFAULT NULL,
  `GROUP_CODE` varchar(255) DEFAULT NULL,
  `GROUP_NAME` varchar(128) DEFAULT NULL,
  `NICKNAME` varchar(256) DEFAULT NULL,
  `PLAINPASSWORD` varchar(64) DEFAULT NULL,
  `SALT` varchar(64) DEFAULT NULL,
  `TELEPHONE` varchar(255) DEFAULT NULL,
  `UPDATE_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `USERNAME` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_admin11
-- ----------------------------

-- ----------------------------
-- Table structure for um_authority
-- ----------------------------
DROP TABLE IF EXISTS `um_authority`;
CREATE TABLE `um_authority` (
  `ID` bigint(20) NOT NULL,
  `CODE` varchar(32) DEFAULT NULL,
  `NAME` varchar(32) DEFAULT NULL,
  `OPERATION_CODE` varchar(255) DEFAULT NULL,
  `RESOURCE_CODE` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_authority
-- ----------------------------

-- ----------------------------
-- Table structure for um_authority_role
-- ----------------------------
DROP TABLE IF EXISTS `um_authority_role`;
CREATE TABLE `um_authority_role` (
  `ID` bigint(20) NOT NULL,
  `AUTH_CODE` varchar(32) DEFAULT NULL,
  `ROLE_CODE` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_authority_role
-- ----------------------------

-- ----------------------------
-- Table structure for um_client_setting
-- ----------------------------
DROP TABLE IF EXISTS `um_client_setting`;
CREATE TABLE `um_client_setting` (
  `ID` bigint(20) NOT NULL,
  `SEND_FILE_SIZE` int(11) DEFAULT NULL,
  `SEND_FILE_SUFFIX` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_client_setting
-- ----------------------------
INSERT INTO `um_client_setting` VALUES ('157777808322176', '50', 'ofd,pdf,doc,docx,xls,xlsx,ppt,pptx');

-- ----------------------------
-- Table structure for um_client_version
-- ----------------------------
DROP TABLE IF EXISTS `um_client_version`;
CREATE TABLE `um_client_version` (
  `id` bigint(20) NOT NULL,
  `client_type` varchar(255) DEFAULT NULL,
  `client_version` varchar(255) DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `remark` varchar(2000) DEFAULT NULL,
  `soft_network` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_client_version
-- ----------------------------

-- ----------------------------
-- Table structure for um_contacts
-- ----------------------------
DROP TABLE IF EXISTS `um_contacts`;
CREATE TABLE `um_contacts` (
  `ID` bigint(20) NOT NULL,
  `ALIAS` varchar(32) DEFAULT NULL,
  `FRIEND_JID` varchar(64) DEFAULT NULL,
  `USER_NAME` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_contacts
-- ----------------------------
INSERT INTO `um_contacts` VALUES ('158824663225984', '测试2', 'test2@cfnmcp.cn', 'test1');

-- ----------------------------
-- Table structure for um_group
-- ----------------------------
DROP TABLE IF EXISTS `um_group`;
CREATE TABLE `um_group` (
  `ID` bigint(20) NOT NULL,
  `ADDRESS` varchar(128) DEFAULT NULL,
  `CODE` varchar(255) DEFAULT NULL,
  `GROUP_NAME` varchar(128) DEFAULT NULL,
  `GSEQUENCE` int(11) DEFAULT NULL,
  `PARENT_CODE` varchar(255) DEFAULT NULL,
  `SERVICE` varchar(128) DEFAULT NULL,
  `SUPERIOR_CODE` varchar(64) DEFAULT NULL,
  `TELEPHONE` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_group
-- ----------------------------
INSERT INTO `um_group` VALUES ('158802945709696', null, 'synto', '星图海辉', null, '-1', null, '', null);
INSERT INTO `um_group` VALUES ('158803014973056', null, '00001', '研发部', null, 'synto', null, null, null);
INSERT INTO `um_group` VALUES ('158803057516160', null, '00002', '测试部', null, 'synto', null, null, null);

-- ----------------------------
-- Table structure for um_group_visible
-- ----------------------------
DROP TABLE IF EXISTS `um_group_visible`;
CREATE TABLE `um_group_visible` (
  `ID` bigint(20) NOT NULL,
  `GROUP_CODE` varchar(255) DEFAULT NULL,
  `VISIBLE_CODE` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_group_visible
-- ----------------------------

-- ----------------------------
-- Table structure for um_notice
-- ----------------------------
DROP TABLE IF EXISTS `um_notice`;
CREATE TABLE `um_notice` (
  `ID` bigint(20) NOT NULL,
  `CONTENT` mediumtext,
  `CREATE_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `TITLE` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_notice
-- ----------------------------

-- ----------------------------
-- Table structure for um_notice_scope
-- ----------------------------
DROP TABLE IF EXISTS `um_notice_scope`;
CREATE TABLE `um_notice_scope` (
  `ID` bigint(20) NOT NULL,
  `CODES` mediumtext,
  `NOTICE_ID` bigint(20) DEFAULT NULL,
  `SCOPE` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_notice_scope
-- ----------------------------

-- ----------------------------
-- Table structure for um_operation
-- ----------------------------
DROP TABLE IF EXISTS `um_operation`;
CREATE TABLE `um_operation` (
  `ID` bigint(20) NOT NULL,
  `CODE` varchar(255) DEFAULT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_operation
-- ----------------------------

-- ----------------------------
-- Table structure for um_resource
-- ----------------------------
DROP TABLE IF EXISTS `um_resource`;
CREATE TABLE `um_resource` (
  `ID` bigint(20) NOT NULL,
  `CODE` varchar(255) DEFAULT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_resource
-- ----------------------------

-- ----------------------------
-- Table structure for um_role
-- ----------------------------
DROP TABLE IF EXISTS `um_role`;
CREATE TABLE `um_role` (
  `ID` bigint(20) NOT NULL,
  `CODE` varchar(32) DEFAULT NULL,
  `NAME` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `UKN2KW26JI2UF5OOF0HQ2N0SQJ9` (`CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_role
-- ----------------------------

-- ----------------------------
-- Table structure for um_room_notice
-- ----------------------------
DROP TABLE IF EXISTS `um_room_notice`;
CREATE TABLE `um_room_notice` (
  `ID` bigint(20) NOT NULL,
  `CONTENT` mediumtext,
  `CREATE_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ROOM_JID` varchar(255) DEFAULT NULL,
  `TITLE` varchar(256) DEFAULT NULL,
  `USER_NAME` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_room_notice
-- ----------------------------

-- ----------------------------
-- Table structure for um_system_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `um_system_admin_log`;
CREATE TABLE `um_system_admin_log` (
  `ID` bigint(20) NOT NULL,
  `GROUP_CODE` varchar(255) DEFAULT NULL,
  `GROUP_NAME` varchar(128) DEFAULT NULL,
  `NICKNAME` varchar(256) DEFAULT NULL,
  `OPERATION` varchar(255) DEFAULT NULL,
  `CREATED_TIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `USERNAME` varchar(256) DEFAULT NULL,
  `group_root_code` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_system_admin_log
-- ----------------------------
INSERT INTO `um_system_admin_log` VALUES ('158802851636864', '-1', null, 'Administrator', '登录操作', '2019-04-17 11:00:55', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158802981148288', '-1', null, 'Administrator', '登出操作', '2019-04-17 11:01:58', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158802989375104', 'synto', '星图海辉', null, '登录操作', '2019-04-17 11:02:02', 'synto', 'synto');
INSERT INTO `um_system_admin_log` VALUES ('158803088987776', 'synto', null, null, '登出操作', '2019-04-17 11:02:51', 'synto', 'synto');
INSERT INTO `um_system_admin_log` VALUES ('158803104030336', '-1', null, 'Administrator', '登录操作', '2019-04-17 11:02:58', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158803159406208', '-1', null, 'Administrator', '登出操作', '2019-04-17 11:03:25', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158803169248896', 'synto', '星图海辉', null, '登录操作', '2019-04-17 11:03:30', 'synto', 'synto');
INSERT INTO `um_system_admin_log` VALUES ('158803438792320', 'synto', null, null, '登出操作', '2019-04-17 11:05:42', 'synto', 'synto');
INSERT INTO `um_system_admin_log` VALUES ('158803451133568', '-1', null, 'Administrator', '登录操作', '2019-04-17 11:05:48', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158803518434944', '-1', null, 'Administrator', '登出操作', '2019-04-17 11:06:20', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158803526504064', 'synto', '星图海辉', null, '登录操作', '2019-04-17 11:06:24', 'synto', 'synto');
INSERT INTO `um_system_admin_log` VALUES ('158808821309056', '-1', null, 'Administrator', '登录操作', '2019-04-17 11:49:30', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158808861873792', '-1', null, 'Administrator', '登出操作', '2019-04-17 11:49:50', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158808872994432', 'synto', '星图海辉', null, '登录操作', '2019-04-17 11:49:55', 'synto', 'synto');
INSERT INTO `um_system_admin_log` VALUES ('158808986388096', 'synto', null, null, '登出操作', '2019-04-17 11:50:50', 'synto', 'synto');
INSERT INTO `um_system_admin_log` VALUES ('158808998887040', '-1', null, 'Administrator', '登录操作', '2019-04-17 11:50:56', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158809021070976', '-1', null, 'Administrator', '登出操作', '2019-04-17 11:51:07', 'superAdmin', '-1');
INSERT INTO `um_system_admin_log` VALUES ('158809032107648', 'synto', '星图海辉', null, '登录操作', '2019-04-17 11:51:13', 'synto', 'synto');

-- ----------------------------
-- Table structure for um_user_config
-- ----------------------------
DROP TABLE IF EXISTS `um_user_config`;
CREATE TABLE `um_user_config` (
  `ID` bigint(20) NOT NULL,
  `CHAT_LOG_STORAGE` varchar(255) DEFAULT NULL,
  `USERNAME` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_user_config
-- ----------------------------

-- ----------------------------
-- Table structure for um_user_role
-- ----------------------------
DROP TABLE IF EXISTS `um_user_role`;
CREATE TABLE `um_user_role` (
  `ID` bigint(20) NOT NULL,
  `ROLE_CODE` varchar(32) DEFAULT NULL,
  `USER_ID` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of um_user_role
-- ----------------------------

-- ----------------------------
-- Table structure for userstatus
-- ----------------------------
DROP TABLE IF EXISTS `userstatus`;
CREATE TABLE `userstatus` (
  `USERNAME` varchar(64) NOT NULL,
  `RESOURCE` varchar(64) NOT NULL,
  `ONLINE` int(11) NOT NULL,
  `PRESENCE` char(15) DEFAULT NULL,
  `LASTIPADDRESS` char(15) NOT NULL,
  `LASTLOGINDATE` char(15) NOT NULL,
  `LASTLOGOFFDATE` char(15) DEFAULT NULL,
  PRIMARY KEY (`USERNAME`,`RESOURCE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of userstatus
-- ----------------------------
INSERT INTO `userstatus` VALUES ('test1', 'pc', '0', 'unavailable', '192.168.1.4', '001555480954084', '001555481009864');
INSERT INTO `userstatus` VALUES ('test1', 'SyntoIM-PC', '0', 'unavailable', '192.168.1.4', '001555480267069', '001555482390740');
INSERT INTO `userstatus` VALUES ('test2', 'ios', '0', 'unavailable', '192.168.1.4', '001555480897334', '001555482388061');
INSERT INTO `userstatus` VALUES ('test2', 'pc', '0', 'unavailable', '192.168.1.4', '001555481013580', '001555482385909');
INSERT INTO `userstatus` VALUES ('test2', 'SyntoIM-PC', '0', 'unavailable', '192.168.1.4', '001555480236749', '001555480260520');

-- ----------------------------
-- Table structure for userstatushistory
-- ----------------------------
DROP TABLE IF EXISTS `userstatushistory`;
CREATE TABLE `userstatushistory` (
  `HISTORYID` bigint(20) NOT NULL,
  `USERNAME` varchar(64) NOT NULL,
  `RESOURCE` varchar(64) NOT NULL,
  `LASTIPADDRESS` char(15) NOT NULL,
  `LASTLOGINDATE` char(15) NOT NULL,
  `LASTLOGOFFDATE` char(15) NOT NULL,
  PRIMARY KEY (`HISTORYID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of userstatushistory
-- ----------------------------
INSERT INTO `userstatushistory` VALUES ('1', 'test2', 'SyntoIM-PC', '192.168.1.4', '001555480236749', '001555480260520');
INSERT INTO `userstatushistory` VALUES ('2', 'test2', 'pc', '192.168.1.4', '001555480123006', '001555480761440');
INSERT INTO `userstatushistory` VALUES ('3', 'test2', 'ios', '192.168.1.4', '001555480178493', '001555480763433');
INSERT INTO `userstatushistory` VALUES ('4', 'test1', 'pc', '192.168.1.4', '001555480954084', '001555481009864');
INSERT INTO `userstatushistory` VALUES ('5', 'test2', 'pc', '192.168.1.4', '001555481013580', '001555482385909');
INSERT INTO `userstatushistory` VALUES ('6', 'test2', 'ios', '192.168.1.4', '001555480897334', '001555482388061');
INSERT INTO `userstatushistory` VALUES ('7', 'test1', 'SyntoIM-PC', '192.168.1.4', '001555480267069', '001555482390740');

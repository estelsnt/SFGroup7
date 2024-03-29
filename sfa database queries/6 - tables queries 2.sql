CREATE TABLE useraddress(
userAddressID int not null auto_increment,
userID int not null,
brgyCode int,
citymunCode int,
provCode int,
regCode int,
address varchar(254),
PRIMARY KEY (userAddressID),
FOREIGN KEY (userID)
REFERENCES users(userID)
);

CREATE TABLE userverification(
userVerificationID int not null auto_increment,
userID int not null,
id1 LONGTEXT,
id2 LONGTEXT,
verified varchar(254),
PRIMARY KEY (userVerificationID),
FOREIGN KEY (userID)
REFERENCES users(userID)
);

INSERT INTO servicecategory
(categoryName)
VALUES
('--Others--');

CREATE TABLE premiumpost(
pID int not null auto_increment,
userID int not null,
title varchar(254),
description varchar(254),
featuredPhoto LONGTEXT,
postDate date,
postDuration date,
PRIMARY KEY (pID),
FOREIGN KEY (userID)
REFERENCES users(userID)
);

CREATE TABLE plistitems(
pListItemsID int not null auto_increment,
pID int not null,
item varchar(254),
PRIMARY KEY (pListItemsID),
FOREIGN KEY (pID)
REFERENCES premiumpost(pID) 
);

CREATE TABLE pphotos(
pPhotosID int not null auto_increment,
pID int not null,
photo LONGTEXT,
PRIMARY KEY (pPhotosID),
FOREIGN KEY (pID)
REFERENCES premiumpost(pID)
);

CREATE TABLE notification (
	notificationID int not null AUTO_INCREMENT,
	notifierID int not null,
  	receiverID int not null,
    notify int,
    PRIMARY KEY (notificationID)
);

CREATE TABLE ratings(
	ratingID int not null AUTO_INCREMENT,
    userID int,
    pID int,
    rating int,
    PRIMARY KEY (ratingID),
    FOREIGN KEY (userID)
    REFERENCES users(userID),
    FOREIGN KEY (pID)
    REFERENCES premiumpost(pID)
);

CREATE TABLE pcomments(
pCommentsID INT NOT NULL AUTO_INCREMENT,	
userID INT NOT NULL,
pID INT NOT NULL,
comment VARCHAR(254),
PRIMARY KEY (pCommentsID),
FOREIGN KEY (userID) REFERENCES users(userID),
FOREIGN KEY (pID) REFERENCES premiumpost(pID)
);

CREATE TABLE pcommentreply(
pCommentReplyID INT NOT NULL AUTO_INCREMENT,
pCommentsID INT NOT NULL,
pID INT NOT NULL,
reply VARCHAR(254),
PRIMARY KEY (pCommentReplyID),
FOREIGN KEY (pCommentsID) REFERENCES pcomments(pCommentsID),
FOREIGN KEY (pID) REFERENCES premiumpost(pID)
);
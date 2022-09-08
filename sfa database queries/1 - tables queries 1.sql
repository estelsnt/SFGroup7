/*
create database sfa
execute create table queries in sequence on database sfa
*/

#CREATE DATABASE sfa;

#USE sfa;

#users table

CREATE TABLE users(
userID int not null auto_increment,
userName varchar(254),
passWord varchar(254),
lastName varchar(254),
firstName varchar(254),
middleName varchar(254),
contactNumber varchar(254),
email varchar(254),
picture LONGTEXT,
gender varchar(254),
birthDate varchar(254),
registerDate Date,
verified varchar(254),
PRIMARY KEY(userID)
);

#insert initial data to users table for development purpose

INSERT INTO `users` 
(`userID`, `userName`, `passWord`, `lastName`, `firstName`, `middleName`, `contactNumber`, `email`, `picture`, `gender`, `birthDate`, `registerDate`) 
VALUES 
(NULL, 'superuser', 'test123superuserpleasedonthack', 'Superuser', 'Developer', 'D', NULL, NULL, NULL, NULL, NULL, '2022-07-18');

#contacts table

CREATE TABLE contacts(
contactID int not null auto_increment,
user1ID int not null,
user2ID int not null,
contactDate Date,
subject varchar(254),
PRIMARY KEY (contactID),
FOREIGN KEY (user1ID) REFERENCES users(userID),
FOREIGN KEY (user2ID) REFERENCES users(userID)
);

#otp table

CREATE TABLE otp(
otpID int not null auto_increment,
userID int not null,
otpCode varchar(254),
contactNumber varchar(254),
otpDateTime DateTime,
isSent varchar(254),
PRIMARY KEY (otpID),
FOREIGN KEY (userID) REFERENCES users(userID)
);

#chat table

CREATE TABLE chat(
chatID int not null auto_increment,
senderUserID int,
receiverUserID int,
message varchar(254),
chatDateTime DateTime,
PRIMARY KEY (chatID),
FOREIGN KEY (senderUserID) REFERENCES users(userID),
FOREIGN KEY (receiverUserID) REFERENCES users(userID)
);

#service category table

CREATE TABLE servicecategory(
serviceCategoryID int not null auto_increment,
categoryName varchar(254),
PRIMARY KEY (serviceCategoryID)
);

#services table

CREATE TABLE service(
serviceID int not null auto_increment,
serviceCategoryID int,
serviceName varchar(254),
serviceDescription varchar(254),
PRIMARY KEY (serviceID),
FOREIGN KEY (serviceCategoryID) REFERENCES serviceCategory(serviceCategoryID)
);

#service posting table

CREATE TABLE serviceposting(
servicePostingID int not null auto_increment,
userID int not null,
serviceID int,
pricing varchar(254),
description varchar(254),
servicePostDateTime DateTime,
picture LONGTEXT,
PRIMARY KEY (servicePostingID),
FOREIGN KEY (userID) REFERENCES users(userID),
FOREIGN KEY (serviceID) REFERENCES service (serviceID)
);

#service order posting table

CREATE TABLE serviceorder(
serviceOrderID int not null auto_increment,
userID int not null,
serviceID int,
description varchar(254),
serviceOrderDateTime DateTime,
picture LONGTEXT,
PRIMARY KEY (serviceOrderID),
FOREIGN KEY (userID) REFERENCES users(userID),
FOREIGN KEY (serviceID) REFERENCES service(serviceID)
);

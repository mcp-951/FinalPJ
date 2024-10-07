USE UramBank;

CREATE TABLE ADMIN_TB(
	adminNo INT AUTO_INCREMENT PRIMARY KEY,
    adminID VARCHAR(30) NOT NULL,
    adminPW VARCHAR(30) NOT NULL
);

INSERT INTO ADMIN_TB(adminID, adminPW) VALUES ('123@naver.com', 'zxc123');
COMMIT;

CREATE TABLE USER_TB(
	userNO INT AUTO_INCREMENT PRIMARY KEY,
    userID VARCHAR(20) NOT NULL,
    userEmail VARCHAR(30) NOT NULL,
    userName VARCHAR(20) NOT NULL,
    userRnum INT NOT NULL,
    OCRcheck CHAR(1),
    userBirth DATE NOT NULL,
    userHP VARCHAR(15) NOT NULL,
    userAddress VARCHAR(100) NOT NULL,
    userState VARCHAR(15) DEFAULT 'NORMAL',
    userCreateDate DATE DEFAULT (CURRENT_DATE()),
    lastAccess TIMESTAMP
);

INSERT INTO USER_TB(userID, userEmail, userName, userRnum, OCRcheck, userBirth, userHP, userAddress)
VALUES('ace', 'ace@naver.com', '에이스동명', 951103-1111111, 'Y', '1995-11-03', '01012345678', '경기도 구리시');
COMMIT;

CREATE TABLE PRODUCT_TB(
	productNo INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(50) NOT NULL,
    productCategory VARCHAR(10) NOT NULL,
    productRate FLOAT NOT NULL,
    productPeriod INT NOT NULL,
    productContent VARCHAR(255) NOT NULL,
    productIMG VARCHAR(255)
);
INSERT INTO PRODUCT_TB(productName, productCategory, productRate, productPeriod, productContent)
VALUES('에이스 예금통장', '예금', 8.8, 60, '역시 에이스 동명상 인생 첫예금');
COMMIT;

DROP TABLE ACCOUNT_TB;
COMMIT;
CREATE TABLE ACCOUNT_TB(
	accountNo INT AUTO_INCREMENT PRIMARY KEY,
	accountNumber INT NOT NULL,
    userNo INT NOT NULL,
    productNo INT NOT NULL,
    accountBalance INT NOT NULL DEFAULT 0,
    accountLimit INT NOT NULL,
    accountMax INT NOT NULL,
    accountPW INT NOT NULL,
    accountState VARCHAR(10) DEFAULT 'NORMAR',
    accountOpen DATE DEFAULT (CURRENT_DATE())
);

INSERT INTO ACCOUNT_TB(accountNumber, userNo, productNo, accountLimit, accountMax, accountPW)
VALUES(123456789, 1, 1, 1000000, 10000000, 1234);
COMMIT;

CREATE TABLE O_ACCOUNT_TB(
	oAccountNo INT AUTO_INCREMENT PRIMARY KEY,
    oAccountNumber INT NOT NULL,
    oUserName VARCHAR(20) NOT NULL,
    oAccountState VARCHAR(10) NOT NULL DEFAULT 'NORMAL',
    oBankName VARCHAR (30) NOT NULL
);
INSERT INTO O_ACCOUNT_TB(oAccountNumber, oUserName, oBankName)
VALUES(0987654321, '동명에이스', '동명은행');
COMMIT;

CREATE TABLE Log_TB(
	logNo INT AUTO_INCREMENT PRIMARY KEY,
    sendAccountNo INT NOT NULL,
	receiveAccountNo INT NOT NULL,
    sendPrice INT NOT NULL,
    sendDate TIMESTAMP NOT NULL,
    logState VARCHAR(10)
);
drop Table AUTO_TRANSFER_TB;
COMMIT;
CREATE TABLE AUTO_TRANSFER_TB(
	autoTransNo INT AUTO_INCREMENT PRIMARY KEY,
    accountNo INT NOT NULL,
    receiveAccountNo INT NOT NULL,
    autoSendPrice INT NOT NULL,
    reservationDate DATE NOT NULL,
    reservationState VARCHAR(10) NOT NULL,
    autoShow CHAR(1) DEFAULT 'Y',
    deleteDate TIMESTAMP DEFAULT NULL
);

CREATE TABLE CURRENCY_EXCHANGE_TB(
	tradeNo INT AUTO_INCREMENT PRIMARY KEY,
    userNO INT NOT NULL,
    accountNo INT NOT NULL,
    selectCountry VARCHAR(20) NOT NULL,
    exchangeRate FLOAT NOT NULL,
    tradeDate TIMESTAMP NOT NULL,
    pickupPlace VARCHAR(20) NOT NULL,
    tradePrice INT NOT NULL,
    tradeAmount INT NOT NULL,
    receiveDate TIMESTAMP
);

CREATE TABLE TAX_TB(
	taxNo INT AUTO_INCREMENT PRIMARY KEY,
    fee1 INT NOT NULL,
    fee2 INT NOT NULL,
    fee3 INT NOt NULL,
    BasicFee1 INT NOT NULL,
    BasicFee2 INT NOT NULL,
    BasicFee3 INT NOT NULL,
    taxState CHAR(1) DEFAULT 'N',
    taxDeadLine DATE NOT NULL,
    taxWriteDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    userNo INT NOT NULL
);

DROP TABLE COINLIST_TB;
COMMIT;
CREATE TABLE COINLIST_TB(
   coinNo INT auto_increment primary key,
    coinNick varchar(10) NOT NULL,
    coinName varchar(50) NOT NULL,
    coinPrice FLOAT NOT NULL,
    coinTotalPrice varchar(15) NOT NULL,
    coinIncrease FLOAT NOT NULL
);

INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('비트코인', 'BTC', 64467.6, '$1.27T', -1.69);
INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('이더리움', 'ETH' , 2630.69, '$316.68B', -1.22);
INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('바이낸스', 'BNB' , 578.6, '$84.19B', -2.93);
INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('솔라나', 'SOL' , 156.5, '$73.31B', 0.25);
INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('리플', 'XRP' , 0.649, '$36.52B', 5.37);
INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('도지코인', 'DOGE' , 0.122, '$17.88B', -4.52);
INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('카르다노', 'ADA' , 0.389, '$13.61B', -2.28);
INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('트론', 'TRX' , 2630.69, '$13.41B', 0.01);
INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('아발란체', 'AVAX' , 28.61, '$11.58B', -1.14);
INSERT INTO COINLIST_TB(coinName, coinNick, coinPrice, coinTotalPrice, coinIncrease)
VALUES ('시바이누', 'SHIB' , 0.000018, '$10.97B', -5.39);

SELECT * FROM COINLIST_TB;
USE UramBank;

CREATE TABLE userInfo (
	userNo int(100) NOT NULL AUTO_INCREMENT,
	userId VARCHAR(100) NOT NULL,
	userPw VARCHAR(100) NOT NULL,
	name VARCHAR(100) NOT NULL,
	hp VARCHAR(20) NOT NULL,
	birth DATETIME NOT NULL ,
	email VARCHAR(100) NOT NULL,
	address VARCHAR(100) NOT NULL,
	residentNumber VARCHAR(100) NOT NULL,
	joinDate DATETIME default NOW(),
	state CHAR(1) default 'y',
	grade int(1) default 9,
	OCRCheck int(1) NOT NULL,
	USER_ROLE VARCHAR(100) default 'USER',
	PRIMARY KEY (userNo)
	);

CREATE TABLE deposit_TB (
    depositNo INT AUTO_INCREMENT PRIMARY KEY, -- 상품 번호 (자동 증가)
    depositName VARCHAR(100) NOT NULL,        -- 상품 이름
    depositMinimumRate FLOAT NOT NULL,        -- 최소이자율
    depositMaximumRate FLOAT NOT NULL,        -- 최대이자율
    depositMinimumDate INT NOT NULL,          -- 최소가입일
    depositMaximumDate INT NOT NULL,          -- 최대가입일
    depositMinimumAmount INT NOT NULL,        -- 가입최소금액
    depositMaximumAmount INT NOT NULL,        -- 가입최대금액
    depositContent TEXT,                      -- 상품 설명
    depositCharacteristic TEXT,               -- 상품 특징
    depositCategory INT NOT NULL,             -- 예금 1, 적금 2
    depositState CHAR(1) NOT NULL DEFAULT 'Y' -- 상품 상태 (Y: 활성, N: 비활성)
);

COMMIT;

DROP TABLE ACCOUNT_TB;
COMMIT;
CREATE TABLE ACCOUNT_TB (
   accountNo int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   accountNumber varchar(255),
   userNo int NOT NULL,
   depositNo int,
   accountBalance int NOT NULL,
   accountLimit int NOT NULL DEFAULT 10000000,
   accountPW varchar(255),
   accountState varchar(255) DEFAULT 'NORMAL',
   accountOpen datetime(6) DEFAULT (CURRENT_DATE()),
   accountClose datetime(6) DEFAULT '2099-12-31',
   bankName varchar(255) DEFAULT '우람은행',
   accountRate double,
   agreement char(1),
   withdrawal char(1)
);

COMMIT;

CREATE TABLE O_ACCOUNT_TB (
   oAccountNo int NOT NULL,
   oAccountNumber varchar(255),
   oUserName varchar(255),
   oAccountState varchar(255),
   oBankName varchar(255)
);
INSERT INTO O_ACCOUNT_TB(oAccountNumber, oUserName, oBankName)
VALUES(0987654321, '동명에이스', '동명은행');
COMMIT;

CREATE TABLE Log_TB (
   logNo int NOT NULL,
   sendAccountNumber varchar(255),
   receiveAccountNumber varchar(255),
   sendPrice int NOT NULL,
   sendDate date NOT NULL,
   logState varchar(255)
);
drop Table AUTO_TRANSFER_TB;
COMMIT;
CREATE TABLE AUTO_TRANSFER_TB (
   autoTransNo int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   accountNo int NOT NULL,
   receiveAccountNo int NOT NULL,
   autoSendPrice int NOT NULL,
   reservationDate date NOT NULL DEFAULT (CURRENT_DATE()),
   reservationState varchar(255) DEFAULT 'ACTIVE',
   deleteDate date,
   startDate date NOT NULL,
   endDate date,
   transferDay int NOT NULL,
   toBankName varchar(255),
   autoAgreement char(1)
);

CREATE TABLE CURRENCY_EXCHANGE_TB (
  tradeNo int auto_increment NOT NULL,
  userNo int NOT NULL,
  accountNo int NOT NULL,
  exchangeRate float NOT NULL,
  pickUpPlace varchar(255) NOT NULL,
  selectCountry varchar(255) NOT NULL,
  tradeAmount int NOT NULL,
  receiveDate date NOT NULL,
  tradeDate date DEFAULT (current_date),
  tradePrice int NOT NULL,
  PRIMARY KEY (`tradeNo`));

CREATE TABLE TAX_TB (
  taxNo int NOT NULL AUTO_INCREMENT,
  fee1  int NOT NULL,
  fee2  int NOT NULL,
  fee3  int NOT NULL,
 BasicFee1 int NOT NULL,
 BasicFee2 int NOT NULL,
 BasicFee3 int NOT NULL,
  taxState char(1) DEFAULT 'N',
  taxDeadLine date NOT NULL,
  taxWriteDate date DEFAULT NULL,
  userNo int NOT NULL,
  taxCategory varchar(255) DEFAULT NULL,
  PRIMARY KEY (`taxNo`));

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

CREATE TABLE SUPPORT_TB (
    qnaNo INT PRIMARY KEY AUTO_INCREMENT,       -- 문의 ID
    userId INT NOT NULL,                        -- 사용자 ID (외래키)
    qnaTitle VARCHAR(255) NOT NULL,             -- 문의 제목
    message TEXT NOT NULL,                      -- 문의 내용
    answer TEXT,                                -- 답변 내용
    status VARCHAR(10) NOT NULL,                -- 답변 상태 ('답변 전', '답변 완료')
    isDeleted CHAR(1) DEFAULT 'N',              -- 삭제 상태 ('N': 미삭제, 'Y': 삭제)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, -- 문의 일자
    answerDay DATETIME,                         -- 답변 일자
    FOREIGN KEY (userId) REFERENCES userInfo(userNo) -- 사용자 외래 키 참조
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

COMMIT;
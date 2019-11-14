CREATE TABLE IF NOT EXISTS USER_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
userid TEXT not null,
email TEXT not null,
password TEXT not null,
name TEXT not null,
role TEXT not null);

CREATE TABLE IF NOT EXISTS DEFAULT_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
DEFAULT_DESCRIPTION TEXT not null, 
DEFAULT_VALUE TEXT not null);

CREATE TABLE IF NOT EXISTS INVNUM_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
INV_DATE TEXT not null,
INV_TYPE TEXT not null,
INV_RUNNING TEXT not null);

CREATE TABLE IF NOT EXISTS COLDEL_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
COLDEL_TYPE TEXT not null, 
COLDEL_ID TEXT not null, 
COLDEL_ACCID TEXT null, 
COLDEL_CUSTID TEXT not null, 
COLDEL_STATUS TEXT not null, 
COLDEL_DATE TEXT not null,
COLDEL_REGION TEXT not null,
COLDEL_TIME TEXT not null,
COLDEL_CUSTNAME TEXT not null,
COLDEL_CUSTTYPE TEXT,
COLDEL_COMPANYAGENT TEXT not null,
COLDEL_NAME2 TEXT not null,
COLDEL_ADDRESS TEXT not null,
COLDEL_BUILDING TEXT null,
COLDEL_LIFTLOBBY TEXT not null,
COLDEL_UNIT TEXT not null,
COLDEL_CUSTEMAIL TEXT not null,
COLDEL_UPDATEDBY TEXT not null,
COLDEL_UPDATEDON TEXT not null,
COLDEL_POSTAL TEXT not null,
COLDEL_CONTACT1 TEXT not null,
COLDEL_CONTACT2 TEXT not null,
COLDEL_CONTACT3 TEXT not null,
COLDEL_CREDIT TEXT not null,
COLDEL_NOTE TEXT not null,
COLDEL_INSTRUCTION TEXT not null,
COLDEL_JOBTYPE TEXT not null,
COLDEL_RETURNDATE TEXT null,
COLDEL_RETURNTIME TEXT null,
COLDEL_PAX TEXT not null,
COLDEL_SORT TEXT not null,
COLDEL_HANG TEXT not null,
COLDEL_PACK TEXT not null,
COLDEL_ROLL TEXT not null,
COLDEL_RETURN TEXT not null,
COLDEL_FLAG TEXT default \'new'\);

CREATE TABLE IF NOT EXISTS TEMP_COLDEL_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
COLDEL_TYPE TEXT not null, 
COLDEL_ID TEXT not null, 
COLDEL_ACCID TEXT null, 
COLDEL_CUSTID TEXT not null, 
COLDEL_STATUS TEXT not null, 
COLDEL_DATE TEXT not null,
COLDEL_REGION TEXT not null,
COLDEL_TIME TEXT not null,
COLDEL_CUSTNAME TEXT not null,
COLDEL_CUSTTYPE TEXT,
COLDEL_COMPANYAGENT TEXT not null,
COLDEL_NAME2 TEXT not null,
COLDEL_ADDRESS TEXT not null,
COLDEL_BUILDING TEXT null,
COLDEL_LIFTLOBBY TEXT not null,
COLDEL_UNIT TEXT not null,
COLDEL_CUSTEMAIL TEXT not null,
COLDEL_UPDATEDBY TEXT not null,
COLDEL_UPDATEDON TEXT not null,
COLDEL_POSTAL TEXT not null,
COLDEL_CONTACT1 TEXT not null,
COLDEL_CONTACT2 TEXT not null,
COLDEL_CONTACT3 TEXT not null,
COLDEL_CREDIT TEXT not null,
COLDEL_NOTE TEXT not null,
COLDEL_INSTRUCTION TEXT not null,
COLDEL_JOBTYPE TEXT not null,
COLDEL_RETURNDATE TEXT null,
COLDEL_RETURNTIME TEXT null,
COLDEL_PAX TEXT not null,
COLDEL_SORT TEXT not null,
COLDEL_HANG TEXT not null,
COLDEL_PACK TEXT not null,
COLDEL_ROLL TEXT not null,
COLDEL_RETURN TEXT not null,
COLDEL_FLAG TEXT default \'new'\);

CREATE TABLE IF NOT EXISTS ITEMS_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
ITEM_ID TEXT not null, 
ITEM_DESCRIPTION TEXT not null, 
ITEM_CATTYPE TEXT null, 
ITEM_CLEANTYPE TEXT not null, 
RATES_ITEM_READYTYPE TEXT not null, 
ITEM_PRICE TEXT not null,
ITEM_ISREADY TEXT not null,
ITEM_QTY TEXT not null,
ITEM_PIECES TEXT,
ITEM_SUBTOTAL TEXT not null);

CREATE TABLE IF NOT EXISTS RATES_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
RATES_ITEM_ID TEXT not null, 
RATES_ACCOUNT_ID TEXT not null, 
RATES_ITEM_DESCRIPTION TEXT null, 
RATES_ITEM_CATTYPE TEXT not null, 
RATES_ITEM_READYTYPE TEXT not null, 
RATES_ITEM_CLEANTYPE TEXT not null,
RATES_ITEM_PRICE TEXT not null,
RATES_ITEM_ISREADY TEXT not null,
RATES_ITEM_QTY TEXT NOT NULL,
RATES_ITEM_PIECES TEXT,
RATES_ITEM_SUBTOTAL TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS AREAS_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
AREA_ID TEXT not null, 
AREA_TYPE TEXT not null, 
AREA_DESCRIPTION TEXT NOT null);

CREATE TABLE IF NOT EXISTS SO_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
SO_DESCRIPTION TEXT not null, 
SO_ACTION_BY TEXT not null, 
SO_POSTED_DATE TEXT NOT null);

CREATE TABLE IF NOT EXISTS INVOICE_TYPES_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
INVOICETYPE_ID TEXT not null, 
INVOICETYPE_TYPE TEXT not null, 
INVOICETYPE_DESCRIPTION TEXT NOT null);

CREATE TABLE IF NOT EXISTS DISCOUNT_TYPES_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
DISCOUNT_ID TEXT not null, 
DISCOUNT_TYPE TEXT not null, 
DISCOUNT_DESCRIPTION TEXT null, 
DISCOUNT_MESSAGE TEXT not null, 
DISCOUNT_MINLIMIT TEXT not null, 
DISCOUNT_DISCOUNT TEXT not null,
DISCOUNT_STARTDATE TEXT not null,
DISCOUNT_ENDDATE TEXT not null,
DISCOUNT_UPDATEDBY TEXT NOT NULL,
DISCOUNT_UPDATEDON TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS UNSYNCED_CUSTOMER_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
UNCUST_CUSTNAME TEXT not null, 
UNCUST_CONTACT1 TEXT not null, 
UNCUST_CONTACT2 TEXT null,
UNCUST_EMAIL TEXT null);

CREATE TABLE IF NOT EXISTS UNSYNCED_COLLECTION_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
UNCOLL_RELATED_UNSYNCED_ID TEXT not null, 
UNCOLL_CUSTID TEXT not null, 
UNCOLL_CUSTTYPE TEXT NOT null, 
UNCOLL_COLLECTTYPE TEXT not null, 
UNCOLL_COLLECTDATE TEXT not null, 
UNCOLL_COLLECTTIME TEXT not null,
UNCOLL_COLLECTADDRESS TEXT not null,
UNCOLL_COLLECTUNIT TEXT not null,
UNCOLL_COLLECTPOSTAL TEXT NOT NULL,
UNCOLL_COLLECTBUILDING TEXT,
UNCOLL_COLLECTREGION TEXT NOT NULL,
UNCOLL_COLLECTNOTE TEXT NOT NULL,
UNCOLL_COLLECTSTATUS TEXT NOT NULL,
UNCOLL_UPDATEDBY TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS UNSYNCED_INVOICE_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
UNINV_COLLTS TEXT not null, 
UNINV_COLLID TEXT, 
UNINV_INVNO TEXT, 
UNINV_CUSTID TEXT not null, 
UNINV_INITIAL TEXT not null, 
UNINV_TYPE TEXT not null,
UNINV_DEPOAMT TEXT not null,
UNINV_DEPOTYPE TEXT not null,
UNINV_BALANCE TEXT NOT NULL,
UNINV_AGREEDDELIVERYDATE TEXT NOT NULL,
UNINV_DELIVERYTIMESLOT TEXT,
UNINV_INVOICENOTE TEXT NOT NULL,
UNINV_DISCOUNT TEXT NOT NULL,
UNINV_EXPRESS TEXT NOT NULL,
UNINV_HASDONATE TEXT NOT NULL,
UNINV_DONATE TEXT NOT NULL,
UNINV_BAGS TEXT,
UNINV_SAVEDON TEXT NULL,
);

CREATE TABLE IF NOT EXISTS UNSYNCED_PAYMENT_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
UNPAY_DELID TEXT not null, 
UNPAY_INVOICENO TEXT NOT NULL, 
UNPAY_INITIAL TEXT NOT NULL, 
UNPAY_TOTAL TEXT not null, 
UNPAY_DISCOUNT TEXT not null, 
UNPAY_DEPOTYPE TEXT not null,
UNPAY_DEPOAMT TEXT not null,
UNPAY_BALANCELEFT TEXT not null,
UNPAY_NOWPAID TEXT  null,
UNPAY_LASTPAID TEXT  null,
UNPAY_BALANCEPAID TEXT NOT NULL,
UNPAY_BALANCETYPE TEXT NOT NULL,
UNPAY_DATE TEXT NOT NULL,
UNPAY_STATUS TEXT NOT NULL,
UNPAY_PPDATE TEXT NULL,
UNPAY_UNPAY_PPTIMESLOT TEXT NULL,
UNPAY_READYTOSYNC TEXT NULL,
UNPAY_SAVEDON TEXT NULL);

CREATE TABLE IF NOT EXISTS TEMP_ITEMS_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
RELATED_INVOICE_ID TEXT not null, 
ITEM_ID TEXT NOT NULL, 
ITEM_DESCRIPTION TEXT NOT NULL, 
ITEM_CATTYPE TEXT not null, 
ITEM_CLEANTYPE TEXT not null, 
ITEM_READYTYPE TEXT not null,
ITEM_PRICE TEXT not null,
ITEM_ISREADY TEXT not null,
ITEM_QTY TEXT  NOT null,
ITEM_PIECES TEXT  null,
ITEM_SUBTOTAL TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS UNSYNCED_EMAIL_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
EMAIL_CUSTID TEXT NOT NULL,
EMAIL_ADDRESS TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS OD_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
OD_CUSTID TEXT NOT NULL,
OD_INVID TEXT NOT NULL,
OD_INVNO TEXT NOT NULL,
OD_INVDATE TEXT NOT NULL,
OD_BALANCEAMT TEXT NOT NULL,
OD_PAYTYPE TEXT NOT NULL,
OD_STATUS TEXT NOT NULL,
OD_PAYSTATUS TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS SUMMARY_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
SUMMARY_DATE TEXT NOT NULL,
SUMMARY_COLLECTED TEXT NOT NULL,
SUMMARY_DELIVERED TEXT NOT NULL,
SUMMARY_REPEAT TEXT NOT NULL,
SUMMARY_TRIP TEXT NOT NULL,
SUMMARY_CASHAMOUNT TEXT NOT NULL,
SUMMARY_CHEQUEAMOUNT TEXT NOT NULL,
SUMMARY_CREDITAMOUNT TEXT NOT NULL,
SUMMARY_BANKTRANSFERAMOUNT TEXT NULL,
SUMMARY_CCAMOUNT TEXT NOT NULL,
SUMMARY_DCAMOUNT TEXT NOT NULL,);

CREATE TABLE IF NOT EXISTS SYNCED_INVOICE_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
AS_COLDEID TEXT NOT NULL,
AS_INVOICENO TEXT NULL,
AS_TYPE TEXT NOT NULL,
AS_AMOUNT TEXT NOT NULL,
AS_AMOUNT_TYPE TEXT NOT NULL,
AS_BAGS TEXT NULL,
AS_DATESYNCED TEXT NOT NULL,
AS_TIMESYNCED TEXT NOT NULL);


CREATE TABLE IF NOT EXISTS SYNCED_INVOICE_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
AS_COLDEID TEXT NOT NULL,
AS_INVOICENO TEXT NULL,
AS_TYPE TEXT NOT NULL,
AS_AMOUNT TEXT NOT NULL,
AS_AMOUNT_TYPE TEXT NOT NULL,
AS_BAGS TEXT NULL,
AS_DATESYNCED TEXT NOT NULL,
AS_TIMESYNCED TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS TIMESLOT_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT, 
TS_DESCRIPTION TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS REWASH_ITEMS_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
RW_RELATED_INVOICE_ID TEXT NOT NULL,
RW_ITEM_INVOICE_NO TEXT NOT NULL,
RW_ITEM_DESCRIPTION TEXT NOT NULL,
RW_ITEM_CATTYPE TEXT NOT NULL,
RW_ITEM_CLEANTYPE TEXT NOT NULL,
RW_ITEM_READYTYPE TEXT NULL,
RW_ITEM_PRICE TEXT NOT NULL,
RW_ITEM_QTY TEXT NOT NULL,
RW_ITEM_PIECES TEXT NOT NULL);


CREATE TABLE IF NOT EXISTS REWASH_EXTRA_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
RW_EXTRA_INVOICE_ID TEXT NOT NULL,
RW_INVOICE_NO TEXT NOT NULL,
RW_NOTES TEXT NOT NULL,
RW_BAGS TEXT NOT NULL,
RW_DELIVERY_DATE TEXT NOT NULL,
RW_DELIVERY_TIME TEXT NULL);


CREATE TABLE IF NOT EXISTS FB_FORM_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
FB_FORM_ID TEXT NOT NULL,
FB_FIELD_ID TEXT NOT NULL,
FB_FIELD_TYPE TEXT NOT NULL,
FB_FIELD_LABEL TEXT NOT NULL,
FB_FIELD_PARAMS TEXT NULL);

CREATE TABLE IF NOT EXISTS UNSYNCED_FB_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
UNSYNCED_FB_FORM_ID TEXT NOT NULL,
UNSYNCED_FB_CUSTOMER_ID TEXT NOT NULL,
UNSYNCED_FB_RESPONSE TEXT NOT NULL);

CREATE TABLE IF NOT EXISTS UNSYNCED_ALERT_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
UNALERT_SUBJECT TEXT NOT NULL,
UNALERT_MESSAGE TEXT NOT NULL);


CREATE TABLE IF NOT EXISTS UNSYNCED_SPENDING_TABLE
(_id INTEGER PRIMARY KEY AUTOINCREMENT,
UNSYNCED_SPENDING_PETROLCASH TEXT NOT NULL,
UNSYNCED_SPENDING_PETROLCARD TEXT NOT NULL,
UNSYNCED_SPENDING_HANDPHONE TEXT NOT NULL,
UNSYNCED_SPENDING_FINES TEXT NOT NULL,
UNSYNCED_SPENDING_PARKING TEXT NOT NULL,
UNSYNCED_SPENDING_CARWASH TEXT NOT NULL,
UNSYNCED_SPENDING_TYRE TEXT NOT NULL,
UNSYNCED_SPENDING_ROADTAX TEXT NOT NULL,
UNSYNCED_SPENDING_DRIVERID TEXT NOT NULL,
UNSYNCED_SPENDING_DATE TEXT NOT NULL,);

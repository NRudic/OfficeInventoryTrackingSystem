CREATE TABLE user_role (
    role_id serial PRIMARY KEY,
    role_name VARCHAR (100) NOT NULL,
    role_description TEXT
);

CREATE TABLE app_user (
    user_id serial PRIMARY KEY,
    first_name VARCHAR (150) NOT NULL,
    last_name VARCHAR (150) NOT NULL,
    email VARCHAR (255) NOT NULL,
    hashed_password VARCHAR (100) NOT NULL,
    phone VARCHAR (50),
	is_active BOOLEAN DEFAULT TRUE,
	fk_roleid INT NOT NULL,
	UNIQUE (email),
	FOREIGN KEY (fk_roleid) REFERENCES user_role (role_id)
);

CREATE TABLE item_group (
    group_id serial PRIMARY KEY,
    group_name VARCHAR (255) NOT NULL,
    group_description TEXT
);

CREATE TABLE item (
    item_id serial PRIMARY KEY,
    item_name VARCHAR (255) NOT NULL,
	item_sn VARCHAR (255),
    item_description TEXT,
    purchase_price NUMERIC(10,2) NOT NULL,
    purchase_date TIMESTAMP NOT NULL,
	is_scannable BOOLEAN DEFAULT TRUE,
	is_active BOOLEAN DEFAULT TRUE,
	fk_groupid INT NOT NULL,
	FOREIGN KEY (fk_groupid) REFERENCES item_group (group_id)
);

CREATE TABLE xref_user_has_item (
    fk_userid INT NOT NULL,
	fk_itemid INT NOT NULL,
	in_possession_from_date TIMESTAMP NOT NULL,
	last_recorded_date TIMESTAMP NOT NULL,
	PRIMARY KEY (fk_userid, fk_itemid),
    FOREIGN KEY (fk_userid) REFERENCES app_user (user_id),
    FOREIGN KEY (fk_itemid) REFERENCES item (item_id)
);

CREATE TABLE writeoff_request (
    writeoff_id serial PRIMARY KEY,
	reason VARCHAR(255) NOT NULL,
	request_date TIMESTAMP NOT NULL,
	is_accepted BOOLEAN DEFAULT FALSE,
	is_active BOOLEAN DEFAULT TRUE,
	fk_itemid INT NOT NULL,
	fk_userid INT NOT NULL,
    FOREIGN KEY (fk_userid) REFERENCES app_user (user_id),
    FOREIGN KEY (fk_itemid) REFERENCES item (item_id)
);

CREATE TABLE transfer_request (
    transfer_id serial PRIMARY KEY,
	reason VARCHAR(255) NOT NULL,
	request_date TIMESTAMP NOT NULL,
	is_accepted BOOLEAN DEFAULT FALSE,
	is_active BOOLEAN DEFAULT TRUE,
	fk_itemid INT NOT NULL,
	fk_previous_ownerid INT,
	fk_new_ownerid INT NOT NULL,
    FOREIGN KEY (fk_previous_ownerid) REFERENCES app_user (user_id),
    FOREIGN KEY (fk_new_ownerid) REFERENCES app_user (user_id),
    FOREIGN KEY (fk_itemid) REFERENCES item (item_id)
);

INSERT INTO user_role (role_name, role_description) VALUES ('Administror', 'Admin account with access to web control panel and normal mobile app');
INSERT INTO user_role (role_name, role_description) VALUES ('User', 'User account with access to only mobile app');
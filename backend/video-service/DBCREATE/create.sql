DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS video;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS plan;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    uid uuid DEFAULT uuid_generate_v4() NOT NULL,
    email VARCHAR(64) NOT NULL,
    username VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    plantype INTEGER NOT NULL,
    PRIMARY KEY(uid)
);

CREATE TABLE video (
    vid uuid DEFAULT uuid_generate_v4() NOT NULL,
    filmLength BIGINT NOT NULL,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(500) NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    views INTEGER NOT NULL,
    released DATE NOT NULL,
    PRIMARY KEY(vid)
);

CREATE TABLE genres (
    vid uuid NOT NULL,
    comedy BOOLEAN NOT NULL,
    horror BOOLEAN NOT NULL,
    action BOOLEAN NOT NULL,
    fantasy BOOLEAN NOT NULL,
    drama BOOLEAN NOT NULL,
    documentary BOOLEAN NOT NULL,
    PRIMARY KEY(vid),
    FOREIGN KEY(vid) REFERENCES video(vid)
);

CREATE TABLE plan (
    uid uuid NOT NULL,
    planType INTEGER NOT NULL,
    PRIMARY KEY(uid),
    FOREIGN KEY(uid) REFERENCES users(uid)
);
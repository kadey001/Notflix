DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Video;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Plan;

-- Entities

CREATE TABLE User (
    uid BIGINT NOT NULL,
    email VARCHAR(64) NOT NULL,
    username VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    PRIMARY KEY(uid)
);

CREATE TABLE Video (
    vid BIGINT NOT NULL,  -- Cinema ID
    filmLength BIGINT NOT NULL,
    title VARCHAR(64) NOT NULL,  -- Cinema name
    likes INTEGER NOT NULL,  -- Number of theaters
    dislikes INTEGER NOT NULL,  -- Number of theaters
    views INTEGER NOT NULL,  -- Number of theaters
    PRIMARY KEY(vid)
);

CREATE TABLE Genres (
    vid BIGINT NOT NULL,  -- Theater ID
    comedy BIT NOT NULL,  -- Theater name
    horror BIT NOT NULL,  -- Theater name
    action BIT NOT NULL,  -- Theater name
    PRIMARY KEY(vid),
    FOREIGN KEY(vid) REFERENCES Video(vid)
);

CREATE TABLE Plan (
    uid BIGINT NOT NULL,  -- Cinema seat ID
    planType VARCHAR(64) NOT NULL,  -- Cinema name
    PRIMARY KEY(uid),
    FOREIGN KEY(uid) REFERENCES User(uid)
);
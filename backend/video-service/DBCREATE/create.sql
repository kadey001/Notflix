DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Video;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS Plan;

-- Entities

CREATE TABLE Users (
    uid BIGINT NOT NULL,
    email VARCHAR(64) NOT NULL,
    username VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    PRIMARY KEY(uid)
);

CREATE TABLE Video (
    vid BIGINT NOT NULL,
    filmLength BIGINT NOT NULL,
    title VARCHAR(64) NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    views INTEGER NOT NULL,
    PRIMARY KEY(vid)
);

CREATE TABLE Genres (
    vid BIGINT NOT NULL,
    comedy BOOLEAN NOT NULL,
    horror BOOLEAN NOT NULL,
    action BOOLEAN NOT NULL,
    PRIMARY KEY(vid),
    FOREIGN KEY(vid) REFERENCES Video(vid)
);

CREATE TABLE Plan (
    uid BIGINT NOT NULL,
    planType VARCHAR(64) NOT NULL,
    PRIMARY KEY(uid),
    FOREIGN KEY(uid) REFERENCES Users(uid)
);
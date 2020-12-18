DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS videos CASCADE;
-- DROP TABLE IF EXISTS genres CASCADE;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS plan;
DROP TABLE IF EXISTS video_user_data;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS comment_rated;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    uid uuid DEFAULT uuid_generate_v4() NOT NULL,
    email VARCHAR(64) NOT NULL,
    username VARCHAR(64) NOT NULL,
    password VARCHAR(64) NOT NULL,
    token TEXT,
    plantype INTEGER NOT NULL,
    created DATE NOT NULL,
    PRIMARY KEY(uid)
);

CREATE TABLE videos (
    vid uuid DEFAULT uuid_generate_v4() NOT NULL,
    filmLength BIGINT NOT NULL,
    title VARCHAR(64) NOT NULL,
    description TEXT,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    views INTEGER NOT NULL,
    released DATE,
    genre TEXT[],
    PRIMARY KEY(vid)
);

CREATE TABLE profiles (
    uid uuid NOT NULL, 
    profile TEXT NOT NULL, -- Start with 'default' upon acc creation
    CONSTRAINT fk_users CONTRAINT
		FOREIGN KEY(uid)
			REFERENCES users(uid)
);

CREATE TABLE video_user_data (
    vid uuid NOT NULL,
    uid uuid NOT NULL,
    profile TEXT NOT NULL,
    viewtime BIGINT,
    liked BOOLEAN,
    disliked BOOLEAN,
    listed BOOLEAN,
    viewed BOOLEAN,
    CONSTRAINT fk_videos
		FOREIGN KEY(vid)
			REFERENCES videos(vid),
    CONSTRAINT fk_users CONTRAINT
		FOREIGN KEY(uid)
			REFERENCES users(uid)
);

-- CREATE TABLE genres (
--     vid uuid NOT NULL,
--     comedy BOOLEAN NOT NULL,
--     horror BOOLEAN NOT NULL,
--     action BOOLEAN NOT NULL,
--     fantasy BOOLEAN NOT NULL,
--     drama BOOLEAN NOT NULL,
--     documentary BOOLEAN NOT NULL,
--     PRIMARY KEY(vid),
--     FOREIGN KEY(vid) REFERENCES video(vid)
-- );

CREATE TABLE comments (
	cid uuid DEFAULT uuid_generate_v4() NOT NULL,
	vid uuid,
	uid uuid,
	username TEXT,
	comment TEXT,
	timestamp TIMESTAMP,
	likes INT,
	dislikes INT,
	CONSTRAINT fk_videos
		FOREIGN KEY(vid)
			REFERENCES videos(vid),
	CONSTRAINT fk_users CONTRAINT
		FOREIGN KEY(uid)
			REFERENCES users(uid)
);

CREATE TABLE comment_rated (
    cid uuid,
    uid uuid,
    liked boolean,
    disliked boolean,
    CONSTRAINT fk_comments
        FOREIGN KEY(cid)
            REFERENCES comments(cid),
    CONSTRAINT fk_users
        FOREIGN KEY(uid)
			REFERENCES users(uid)
);
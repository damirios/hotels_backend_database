/* Создание базы данных hotels_film_db */
DROP DATABASE if EXISTS hotels_film_db;

CREATE DATABASE hotels_film_db;


/* Создание таблиц (сначала нужно "приконнектиться" к базе данных) */
CREATE TABLE person(
    person_id SERIAL PRIMARY KEY,
    first_name varchar(128),
    last_name varchar(128),
    position varchar(32)
);

CREATE TABLE film(
    film_id SERIAL PRIMARY KEY,
    title varchar(128) NOT NULL,
    release_year int NOT NULL,
    country varchar(64) NOT NULL,
    fk_director_id int REFERENCES person(person_id) NOT NULL,
    fk_writer_id int REFERENCES person(person_id) NOT NULL,
    fk_producer_id int REFERENCES person(person_id) NOT NULL,
    fk_operator_id int REFERENCES person(person_id) NOT NULL,
    fk_composer_id int REFERENCES person(person_id) NOT NULL,
    fk_artist_id int REFERENCES person(person_id) NOT NULL,
    fk_editor_id int REFERENCES person(person_id) NOT NULL,
    budget int,
    marketing int,
    cash_usa int,
    cash_world int,
    premiere_russia varchar(32),
    premiere_world varchar(32),
    release_world varchar(32),
    age_limit int,
    age_mpaa varchar(8),
    duration int
);

CREATE TABLE genre(
    genre_id SERIAL PRIMARY KEY,
    title varchar(64)
);

CREATE TABLE audience(
    audience_id SERIAL PRIMARY KEY,
    country varchar(64),
    quantity int
);

CREATE TABLE film_person(
    film_id int REFERENCES film(film_id),
    person_id int REFERENCES person(person_id),

    CONSTRAINT film_person_pkey PRIMARY KEY (film_id, person_id)
);

CREATE TABLE film_genre(
    film_id int REFERENCES film(film_id),
    genre_id int REFERENCES genre(genre_id),

    CONSTRAINT film_genre_pkey PRIMARY KEY (film_id, genre_id)
);

CREATE TABLE film_audience(
    film_id int REFERENCES film(film_id),
    audience_id int REFERENCES audience(audience_id),

    CONSTRAINT film_audience_pkey PRIMARY KEY (film_id, audience_id)
);
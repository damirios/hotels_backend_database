const db = require('../db');
const film_genre_controller = require('./film_genre_controller');

class FilmController {
    async createFilm(req, res) {
        const {title, release_year, genres_id} = req.body;
        const newFilm = await db.query("INSERT into film_simple (title, release_year) values ($1, $2) RETURNING *", 
        [title, release_year]);

        const filmID = newFilm.rows[0].film_id;
        
        if (genres_id && genres_id.length > 0) {
            await film_genre_controller.addRecord(filmID, genres_id);
        }
        
        res.send(newFilm.rows[0]);
    }

    async getFilms(req, res) {
        const id = req.params.id;
        if (id) {
            const film = await db.query(`SELECT f.title as film_title, f.release_year, 
            array_agg(g.title) as genres 
            FROM film_simple f
            LEFT JOIN film_genre fg ON fg.film_id = f.film_id
            LEFT JOIN genre_simple g ON fg.genre_id = g.genre_id WHERE f.film_id = $1 GROUP BY f.title, f.release_year`, [id]);
            res.send(film.rows[0]);
        } else {
            const films = await db.query(`SELECT f.title as title, f.release_year, 
            array_agg(g.title) as genres 
            FROM film_simple f
            LEFT JOIN film_genre fg ON fg.film_id = f.film_id
            LEFT JOIN genre_simple g ON fg.genre_id = g.genre_id GROUP BY f.title, f.release_year`);
            res.send(films.rows);
        }

    }

    async updateFilm(req, res) {
        const id = req.params.id;
        const {title, release_year, genres_id} = req.body;

        let updatedFilm;
        if (id) {
            const film = await db.query("SELECT * FROM film_simple WHERE film_id = $1", [id]);

            if (title && release_year) {
                updatedFilm = await db.query('UPDATE film_simple set title = $1, release_year = $2 WHERE film_id = $3 RETURNING *', 
                [title, release_year, id]);
            } else if (title) {
                updatedFilm = await db.query('UPDATE film_simple set title = $1 WHERE film_id = $2 RETURNING *', [title, id]);
            } else if (release_year) {
                updatedFilm = await db.query('UPDATE film_simple set release_year = $1 WHERE film_id = $2 RETURNING *', 
                [release_year, id]);
            }

            // если пришли новые записи в разделе genre, то меняем таблицу film_genre
            if (genres_id && genres_id.length > 0) {
                await film_genre_controller.deleteFilmRecords(id); // удаляем старые записи
                await film_genre_controller.addRecord(id, genres_id); // добавляем новые записи
            }

            if (updatedFilm) {
                res.send(updatedFilm.rows[0]);
            } else {
                res.send(film.rows[0]);
            }
        } else {
            throw new Error('id of "film" did not specified');
        }
    }

    async deleteFilm(req, res) {
        const id = req.params.id;
        if (id) {
            await film_genre_controller.deleteFilmRecords(id);
            const film = await db.query(`DELETE FROM film_simple WHERE film_id = $1  RETURNING *`, [id]);

            res.send(film.rows[0]);
        } else {
            throw new Error('id of "film" did not specified');
        }
    }
}

module.exports = new FilmController();
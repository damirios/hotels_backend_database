const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3000;
const Application = require('./framework/Application');
const parseJson = require('./framework/parseJson');
const parseUrl = require('./framework/parseUrl');

const filmRouter = require('./routers/filmRouter');
const genreRouter = require('./routers/genreRouter');


const app = new Application();

app.use(parseJson);
app.use(parseUrl(`http://localhost:${PORT}`));
app.addRouter(filmRouter);
app.addRouter(genreRouter);

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
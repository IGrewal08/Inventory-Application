import express from 'express';
import { fileURLToPath } from "node:url";
import inventoryRouter from './routes/inventoryRouter.js';
import path from 'node:path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.use('/', inventoryRouter);
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, 'localhost', (error) => {
    if (error) {
        throw error;
    }
    console.log(`Express app listening on port ${PORT}`);
});

/*
    feat.
    error page: handle custom errors / broken routes
*/
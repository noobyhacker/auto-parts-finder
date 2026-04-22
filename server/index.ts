import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const catalogData = [
    { id: 1, name: 'Part A', price: 100 },
    { id: 2, name: 'Part B', price: 200 },
    { id: 3, name: 'Part C', price: 300 }
];

app.get('/api/catalog', (req, res) => {
    res.json(catalogData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
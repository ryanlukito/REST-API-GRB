const express = require('express');
const grbRoutes = require('./src/student/routes');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.use('/api/v1/GRD_DB', grbRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));
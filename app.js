const express = require('express');
const app = express();
const config = require('./config');
const fileRoutes = require('./routes/fileRoutes');
const errorHandler = require('./errorHandling');
const cors = require('cors');

app.use(cors());

app.use('/api', fileRoutes);
app.use(errorHandler);


const port = config.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

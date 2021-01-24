const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

let configs = require('./api/configs');
configs.musicFolders.push('D:/Music/Music');
configs.musicFolders.push('D:/Music/Hindi');

const tracksRoutes = require('./api/routes/tracks');
const albumsRoutes = require('./api/routes/albums');
const libraryRefreshRoute = require('./api/routes/libraryRefresh');

mongoose
    .connect('mongodb://localhost:27017/player', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(
        (e) => {
            console.log('Successfully connected to MongoDB Database.');
        }, (e) => {
            console.log('Failure in connection to MongoDB Database.');
        }
    );

// logging 
app.use(morgan('dev'));

// body parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }
    next();
});

// routes which should handle requests
app.use('/tracks', tracksRoutes);
app.use('/refreshlibrary', libraryRefreshRoute);
app.use('/albums', albumsRoutes);

// error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    });
});

module.exports = app;
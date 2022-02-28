module.exports = (function () {
  const express = require('express');
  const router = express.Router();
  var mysql = require('./dbcon.js');
  // GET Events_Artists
  router.get('/', function (req, res) {
    let context = {};
    let artists = {};
    let events = {};
    mysql.pool.query(
      "SELECT ea.event_artistId, e.eventId, a.artistId, e.eventName, CONCAT(a.firstName, ' ', a.lastName) AS artistName FROM GalleryEvents_Artists ea INNER JOIN Artists a ON ea.artistId = a.artistId INNER JOIN GalleryEvents e ON ea.eventId = e.eventId ORDER BY ea.event_artistId ASC; SELECT artistId, artistId, CONCAT(firstName, ' ', lastName) AS artistName FROM Artists ORDER BY lastName ASC; SELECT eventId, eventName FROM GalleryEvents ORDER BY eventId ASC;",
      function (err, rows, fields) {
        if (err) {
          console.log(err);
          res.send('ERROR!');
          return;
        }
        // console.log(rows);
        context.results = [];
        rows[0].forEach((row) => {
          context.results.push({
            event_artistId: row.event_artistId,
            eventId: row.eventId,
            eventName: row.eventName,
            artistId: row.artistId,
            artistName: row.artistName,
          });
        });

        artists.results = [];
        rows[1].forEach((artist) => {
          artists.results.push({
            artistId: artist.artistId,
            artistName: artist.artistName,
          });
        });

        events.results = [];
        rows[2].forEach((ev) => {
          events.results.push({
            eventId: ev.eventId,
            eventName: ev.eventName,
          });
        });

        res.render('events_artists', {
          context: context.results,
          artists: artists.results,
          events: events.results,
        });
      }
    );
  });

  // // Add artist to an Event
  router.post('/', function (req, res) {
    let error = {};
    mysql.pool.query(
      'INSERT INTO GalleryEvents_Artists SET eventId=?, artistId=?',
      [req.body.eventId, req.body.artistId],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.eventId = req.body.eventId;
          error.artistId = req.body.artistId;
          if (err.code == 'ER_NO_REFERENCED_ROW_2'){
            error.message = 'Please add an artist to an event using all required fields.';
          }
        }
        if (err) {
          res.render('events_artists', { error: error });
        } else {
          res.redirect('/events_artists');
        }
      }
    );
  });


  // Get and populate events_artists edit page
  router.get('/:id', function (req, res) {
    let context = {};
    let artists = {};
    let events = {};
    // console.log(req.params);
    // console.log(req.query);

    // console.log(req.params.id);
    mysql.pool.query(
      'SELECT ea.event_artistId, e.eventId, a.artistId, e.eventName, CONCAT(a.firstName, " ", a.lastName) AS artistName FROM GalleryEvents_Artists ea INNER JOIN Artists a ON ea.artistId = a.artistId INNER JOIN GalleryEvents e ON ea.eventId = e.eventId WHERE ea.event_artistId=?; SELECT artistId, CONCAT(firstName, " ", lastName) AS artistName FROM Artists ORDER BY lastName ASC; SELECT eventId, eventName FROM GalleryEvents ORDER BY eventId ASC;',
      [req.params.id],
      function (err, result) {
        if (err) {
          // console.log(err);
          res.send(err);
          return;
        }

        // console.log(result);
        // res.send(result);
        context.results = [];
        result[0].forEach((ea) => {
          context.results.push({
            id: ea.event_artistId,
            eventId: ea.eventId,
            artistId: ea.artistId,
            eventName: ea.eventName,
            artistName: ea.artistName,
          });
        });

        artists.results = [];
        result[1].forEach((artist) => {
          artists.results.push({
            artistId: artist.artistId,
            artistName: artist.artistName,
          });
        });

        events.results = [];
        result[2].forEach((ev) => {
          events.results.push({
            eventId: ev.eventId,
            eventName: ev.eventName,
          });
        });

        res.render('events_artists-edit', {
          context: context.results,
          artists: artists.results,
          events: events.results,
        });
      }
    );
  });

  // Edit Events_Artists - handle editing of events_artists table
  router.post('/edit/:id', function (req, res) {
    let error = {};
    mysql.pool.query(
      'UPDATE GalleryEvents_Artists SET eventId=?, artistId=? WHERE event_artistId=?;',
      // [req.body.eventId, req.body.artistId, req.params.id],
      [req.body.eventId, req.body.artistId, req.params.id],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.eventId = req.body.eventId;
          error.artistId = req.body.artistId;
          error.id = req.params.id;
        }
        if (err) {
          res.render('events_artists-edit', {error: error});
        } else {
          res.redirect('/events_artists');
        }
      }  
    );
  });

  // Delete inventory by ID
  router.get('/delete/:id', function (req, res) {
    // console.log(req.params.id);
    mysql.pool.query(
      'SET FOREIGN_KEY_CHECKS=0; DELETE FROM GalleryEvents_Artists WHERE event_artistId=?; SET FOREIGN_KEY_CHECKS=1',
      [req.params.id],
      function (err, result) {
        if (err) {
          res.send(err);
          console.log(err);
          return;
        }
        // console.log(result);
        res.redirect('/events_artists');
      }
    );
  });

  return router;
})();

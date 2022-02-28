module.exports = (function () {
  const express = require('express');
  const router = express.Router();
  var mysql = require('./dbcon.js');

  // GET Events
  router.get('/', function (req, res) {
    let context = {};
    mysql.pool.query(
      'SELECT eventId, eventName, DATE_FORMAT(eventdate, "%Y-%m-%d") AS date FROM GalleryEvents',
      function (err, rows, fields) {
        if (err) {
          console.log(err);
          res.send('ERROR!');
          return;
        }
        context.results = [];
        rows.forEach((event) => {
          context.results.push({
            id: event.eventId,
            name: event.eventName,
            date: event.date,
          });
        });

        res.render('events', { context: context.results });
      }
    );
  });

  // Add Event
  router.post('/', function (req, res) {
    let error = {};
    mysql.pool.query(
      'INSERT INTO GalleryEvents SET eventName=?, eventDate=?',
      [req.body.name, req.body.date],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.name = req.body.name;
          error.date = req.body.date;
        }
        if (err) {
          res.render('events', { error: error });
        } else {
        res.redirect('/events');
      }
    }
  );
});

  // Get Event by ID
  router.get('/:id', function (req, res) {
    context = {};
    // console.log(req.params.id);
    mysql.pool.query(
      'SELECT eventId, eventName, DATE_FORMAT(eventdate, "%Y-%m-%d") AS date FROM GalleryEvents WHERE eventId=?',
      [req.params.id],
      function (err, result) {
        if (err) {
          res.send(err);
          return;
        }
        // console.log(result[0].firstName);

        // console.log(result);
        // res.send(result);
        context.results = [];
        result.forEach((ev) => {
          context.results.push({
            id: ev.eventId,
            name: ev.eventName,
            date: ev.date,
          });
        });

        res.render('event-edit', { context: context.results });
      }
    );
  });

  // Edit Event by Id
  router.post('/edit/:id', function (req, res) {
    // this route will be used from the edit-event page after user presses update button
    let error = {};
    mysql.pool.query(
      'UPDATE GalleryEvents SET eventName=?, eventDate=? WHERE eventId=?',
      [req.body.name, req.body.date, req.params.id],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.name = req.body.name;
          error.date = req.body.date;
          error.id = req.params.id;
        }
        if (err) {
          res.render('event-edit', { error: error });
        } else {
        // console.log(result[0].firstName);
        res.redirect('/events');
      }
    }  
  );
});

  // Delete Event by ID
  router.get('/delete/:id', function (req, res) {
    mysql.pool.query(
      'DELETE FROM GalleryEvents WHERE eventId=?',
      [req.params.id],
      function (err, result) {
        if (err) {
          res.send(err);
          console.log(err);
          return;
        }
        // console.log(result);
        res.redirect('/events');
      }
    );
  });

  return router;
})();

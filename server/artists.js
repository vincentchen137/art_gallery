module.exports = (function () {
  const express = require('express');
  const router = express.Router();
  var mysql = require('./dbcon.js');

  // Artists Route -  Fetch current artists in db and populate the table.
  router.get('/', function (req, res) {
    let context = {};
    mysql.pool.query(
      'SELECT artistId, firstName, lastName, email, phone FROM Artists WHERE firstName like ? AND lastName like ? AND email like ? AND phone like ?',
      [
        req.query.fname || '%',
        req.query.lname || '%',
        req.query.email || '%',
        req.query.phone || '%',
      ],
      function (err, rows, fields) {
        if (err) {
          res.send('ERROR!');
          console.log(err);
          return;
        }
        // console.log(rows);
        context.results = [];
        rows.forEach((artist) => {
          context.results.push({
            id: artist.artistId,
            first: artist.firstName,
            last: artist.lastName,
            email: artist.email,
            phone: artist.phone,
          });
        });

        res.render('artists', { context: context.results });
      }
    );
  });

  // Add Artist
  router.post('/', function (req, res) {
    let error = {};
    mysql.pool.query(
      'INSERT INTO Artists SET firstName=?, lastName=?, email=?, phone=?',
      [req.body.fname, req.body.lname, req.body.email, req.body.phone],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.fname = req.body.fname;
          error.lname = req.body.lname;
          error.email = req.body.email;
          error.phone = req.body.phone;
          // res.send(err);
          // return;
        }
        // res.render('artists');
        // res.redirect('/artists');
        if (err) {
          res.render('artists', { error: error });
        } else {
          res.redirect('/artists');
        }
      }
    );
  });

  // Get Artist by ID
  router.get('/:id', function (req, res) {
    context = {};
    // console.log(req.params.id);
    mysql.pool.query(
      'SELECT * FROM Artists WHERE artistId=?',
      [req.params.id],
      function (err, result) {
        if (err) {
          res.send(err);
          return;
        }
        // console.log(result[0].firstName);
        // display the result in a form on artist-edit page
        // console.log(result);
        // res.send(result);
        context.results = [];
        result.forEach((artist) => {
          context.results.push({
            id: artist.artistId,
            first: artist.firstName,
            last: artist.lastName,
            email: artist.email,
            phone: artist.phone,
          });
        });

        res.render('artist-edit', { context: context.results });
      }
    );
  });

  // Edit Artist by Id
  router.post('/edit/:id', function (req, res) {
    // this route will be used from the artist-edit page after user presses update button
    let error = {};
    mysql.pool.query(
      'UPDATE Artists SET firstName=?, lastName=?, email=?, phone=? WHERE artistId=? ',
      [
        req.body.fname,
        req.body.lname,
        req.body.email,
        req.body.phone,
        req.params.id,
      ],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.fname = req.body.fname;
          error.lname = req.body.lname;
          error.email = req.body.email;
          error.phone = req.body.phone;
          error.id = req.params.id;
          // context.results.push({
          //   id: req.params.id
          //   });
        }  
        if (err) {
          // res.render('artist-edit', { error: error }, {context: context.results});
          // console.log(error.id)
          res.render('artist-edit', { error: error });
        } else {
        res.redirect('/artists');
      }
      }  
    );
  });

  // Delete Artist by ID
  router.get('/delete/:id', function (req, res) {
    mysql.pool.query(
      'DELETE FROM Artists WHERE artistId=?',
      [req.params.id],
      function (err, result) {
        if (err) {
          res.send(err);
          console.log(err);
          return;
        }
        // console.log(result);
        res.redirect('/artists');
      }
    );
  });

  return router;
})();

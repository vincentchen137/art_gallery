module.exports = (function () {
  const express = require('express');
  const router = express.Router();
  var mysql = require('./dbcon.js');

  // GET Mediums
  router.get('/', function (req, res) {
    let context = {};
    mysql.pool.query(
      'SELECT mediumId, mediumDescription FROM Mediums ORDER BY mediumId',
      function (err, rows, fields) {
        if (err) {
          res.send('ERROR!');
          return;
        }
        // console.log(rows);
        context.results = [];
        rows.forEach((med) => {
          context.results.push({
            id: med.mediumId,
            medium: med.mediumDescription,
          });
        });

        res.render('mediums', { context: context.results });
      }
    );
  });

  // Add Mediums
  router.post('/', function (req, res) {
    let error = {};
    mysql.pool.query(
      'INSERT INTO Mediums SET mediumDescription=?',
      [req.body.name],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.name = req.body.name;
        }
        if (err) {
          res.render('mediums', { error: error });
        } else {
        res.redirect('/mediums');
        }
      }
    );
  });


  // Get Medium by ID
  router.get('/:id', function (req, res) {
    context = {};
    // console.log(req.params.id);
    mysql.pool.query(
      'SELECT * FROM Mediums WHERE mediumId=?',
      [req.params.id],
      function (err, result) {
        if (err) {
          res.send(err);
          return;
        }
        // console.log(result[0].firstName);
        // display the result in a form on edit-artist page
        // console.log(result);
        // res.send(result);
        context.results = [];
        result.forEach((med) => {
          context.results.push({
            id: med.mediumId,
            description: med.mediumDescription,
          });
        });

        res.render('mediums-edit', { context: context.results });
      }
    );
  });

  // Edit Medium by Id
  router.post('/edit/:id', function (req, res) {
    // this route will be used from the edit-artist page after user presses update button
    let error = {};
    mysql.pool.query(
      'UPDATE Mediums SET mediumDescription=? WHERE mediumId=? ',
      [req.body.description, req.params.id],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.name = req.body.description;
          error.id = req.params.id;
        }
        if (err) {
          res.render('mediums-edit', { error: error });
        } else {
          res.redirect('/mediums');
      }
      }  
    );
  });

//   // Delete Medium by ID
//   router.get('/delete/:id', function (req, res) {
//     mysql.pool.query(
//       'DELETE FROM Mediums WHERE mediumId=?',
//       [req.params.id],
//       function (err, result) {
//         if (err) {
//           res.send(err);
//           console.log(err);
//           return;
//         }
//         // console.log(result);
//         res.redirect('/mediums');
//       }
//     );
//   });

  return router;
})();

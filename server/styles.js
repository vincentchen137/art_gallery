module.exports = (function () {
  const express = require('express');
  const router = express.Router();
  var mysql = require('./dbcon.js');

  // GET Styles
  router.get('/', function (req, res) {
    let context = {};
    mysql.pool.query(
      'SELECT styleId, styleDescription FROM Styles ORDER BY styleId',
      function (err, rows, fields) {
        if (err) {
          res.send('ERROR!');
          return;
        }
        // console.log(rows);
        context.results = [];
        rows.forEach((style) => {
          context.results.push({
            id: style.styleId,
            style: style.styleDescription,
          });
        });

        res.render('styles', { context: context.results });
      }
    );
  });

  // Add Style
  router.post('/', function (req, res) {
    let error = {};
    mysql.pool.query(
      'INSERT INTO Styles SET styleDescription=?',
      [req.body.name],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.name = req.body.name;
        }
        if (err) {
          res.render('styles', { error: error });
        } else {
        res.redirect('/styles');
        }
      }
    );
  });

  // Get Style by ID
  router.get('/:id', function (req, res) {
    context = {};
    // console.log(req.params.id);
    mysql.pool.query(
      'SELECT * FROM Styles WHERE styleId=?',
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
        result.forEach((style) => {
          context.results.push({
            id: style.styleId,
            description: style.styleDescription,
          });
        });

        res.render('styles-edit', { context: context.results });
      }
    );
  });

  // Edit Style by Id
  router.post('/edit/:id', function (req, res) {
    // this route will be used from the edit-artist page after user presses update button
    let error = {};
    mysql.pool.query(
      'UPDATE Styles SET styleDescription=? WHERE styleId=? ',
      [req.body.description, req.params.id],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.name = req.body.description;
          error.id = req.params.id;
        }
        if (err) {
          res.render('styles-edit', { error: error });
        } else {
          res.redirect('/styles');
        }
      }  
    );
  });
//   // Delete Style by ID
//   router.get('/delete/:id', function (req, res) {
//     mysql.pool.query(
//       'DELETE FROM Styles WHERE styleId=?',
//       [req.params.id],
//       function (err, result) {
//         if (err) {
//           res.send(err);
//           console.log(err);
//           return;
//         }
//         // console.log(result);
//         res.redirect('/styles');
//       }
//     );
//   });

  return router;
})();

const mediums = require('./mediums.js');

module.exports = (function () {
  const express = require('express');
  const router = express.Router();
  var mysql = require('./dbcon.js');

  // Select Inventory
  router.get('/', function (req, res) {
    let context = {};
    let artists = {};
    let styles = {};
    let mediums = {};
    mysql.pool.query(
      'SELECT i.inventoryId, i.artworkName, a.firstName, a.lastName, CONCAT(a.firstName, " ", a.lastName) AS artistName, a.artistId, s.styleId, s.styleDescription, m.mediumId, m.mediumDescription FROM GalleryInventory i LEFT JOIN Artists a USING (artistId) INNER JOIN Styles s USING (styleId) INNER JOIN Mediums m USING (mediumId) ORDER BY i.inventoryId; SELECT artistId, firstName, lastName, CONCAT(firstName, " ", lastName) AS artistName FROM Artists; SELECT styleId, styleDescription FROM Styles; SELECT mediumId, mediumDescription FROM Mediums;',
      function (err, rows, fields) {
        if (err) {
          res.send('ERROR!');
          return;
        }
        context.results = [];

        rows[0].forEach((inv) => {
          context.results.push({
            id: inv.inventoryId,
            artWork: inv.artworkName,
            fname: inv.firstName,
            lname: inv.lastName,
            artistFullName: inv.artistName || 'NULL',
            artistId: inv.artistId || 'null',
            style: inv.styleDescription,
            styleId: inv.styleId,
            medium: inv.mediumDescription,
            mediumId: inv.mediumId,
          });
        });
        // console.log(rows[1][0]);
        artists.results = [];
        rows[1].forEach((artist) => {
          artists.results.push({
            artistId: artist.artistId,
            artistName: artist.artistName
          });
        });
        styles.results = [];
        rows[2].forEach((style) => {
          styles.results.push({
            styleId: style.styleId,
            styleDescription: style.styleDescription
          });
        });
        mediums.results = [];
        rows[3].forEach((medium) => {
          mediums.results.push({
            mediumId: medium.mediumId,
            mediumDescription: medium.mediumDescription
          });
        });

        res.render('inventory', {
          context: context.results,
          artists: artists.results,
          styles: styles.results,
          mediums: mediums.results,
        });
      }
    );
  });

  // Add Inventory
  router.post('/', function (req, res) {
    let error = {};
    if (req.body.artistId == 'NULL') {
      req.body.artistId = null;
    }
    mysql.pool.query(
      'INSERT INTO GalleryInventory SET artworkName=?, artistId=?, styleId=?, mediumId=?;',
      [req.body.name, req.body.artistId, req.body.styleId, req.body.mediumId],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.artworkName = req.body.name;
          error.artistId = req.body.artistId;
          error.styleId = req.body.styleId;
          error.mediumId = req.body.mediumId;
          if (err.code == 'ER_NO_REFERENCED_ROW_2'){
            error.message = 'Please add an artwork using all required fields.';}
        }
        if (err) {
          res.render('inventory', { error: error });
        } else {
        res.redirect('/inventory');
        }
      }
    );
  });

  // Get Inventory by ID
  router.get('/:id', function (req, res) {
    context = {};
    artists = {};
    styles = {};
    artists = {};
    q1 = '';
    if (req.query.artist == 'null') {
      q1 =
        'SELECT inventoryId, artworkName, artistId, styleId, styleDescription, mediumId, mediumDescription FROM GalleryInventory INNER JOIN Styles s USING (styleId) INNER JOIN Mediums m USING (mediumId) WHERE inventoryId=?;SELECT artistId, firstName, lastName, CONCAT(firstName, " ", lastName) AS artistName FROM Artists ORDER BY lastName;SELECT styleId, styleDescription FROM Styles;SELECT mediumId, mediumDescription FROM Mediums;';
    } else {
      q1 =
        'SELECT inventoryId, artworkName, artistId, firstName, lastName, CONCAT(firstName, " ", lastName) AS artistName, styleId, styleDescription, mediumId, mediumDescription FROM GalleryInventory INNER JOIN Artists USING(artistId) INNER JOIN Styles s USING (styleId) INNER JOIN Mediums m USING (mediumId) WHERE inventoryId=?;SELECT artistId, firstName, lastName, CONCAT(firstName, " ", lastName) AS artistName FROM Artists ORDER BY lastName;SELECT styleId, styleDescription FROM Styles;SELECT mediumId, mediumDescription FROM Mediums;';
    }
    mysql.pool.query(q1, [req.params.id], function (err, result) {
      if (err) {
        res.send(err);
        return;
      }
      context.results = [];
      result[0].forEach((inv) => {
        // console.log(inv);
        context.results.push({
          id: inv.inventoryId,
          name: inv.artworkName,
          artistId: inv.artistId || 'NULL',
          artistName: inv.artistName || 'NULL',
          styleId: inv.styleId,
          styleDescription: inv.styleDescription,
          mediumId: inv.mediumId,
          mediumDescription: inv.mediumDescription,
        });
      });

      artists.results = [];
      result[1].forEach((artist) => {
        artists.results.push({
          artistId: artist.artistId,
          artistName: artist.artistName,
        });
      });

      styles.results = [];
      result[2].forEach((style) => {
        styles.results.push({
          styleId: style.styleId,
          styleDescription: style.styleDescription,
        });
      });

      mediums.results = [];
      result[3].forEach((medium) => {
        mediums.results.push({
          mediumId: medium.mediumId,
          mediumDescription: medium.mediumDescription,
        });
      });
      // console.log(mediums.results);

      res.render('inventory-edit', {
        context: context.results,
        artists: artists.results,
        styles: styles.results,
        mediums: mediums.results,
      });
    });
  });

  // Update inventory by Id
  router.post('/edit/:id', function (req, res) {
    let error = {};
    if (req.body.artistId == 'NULL') {
      req.body.artistId = null;
    }
    mysql.pool.query(
      'UPDATE GalleryInventory SET artworkName=?, artistId=?, styleId=?, mediumId=? WHERE inventoryId=? ',
      [
        req.body.name,
        req.body.artistId,
        req.body.styleId,
        req.body.mediumId,
        req.params.id,
      ],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.artworkName = req.body.name;
          error.artistId = req.body.artistId;
          error.styleId = req.body.styleId;
          error.mediumId = req.body.mediumId;
          error.id = req.params.id;
        }
        if (err) {
          res.render('inventory-edit', {error: error});
        } else {
          res.redirect('/inventory');
        }
      }  
    );
  });

  // Delete inventory by ID
  router.get('/delete/:id', function (req, res) {
    mysql.pool.query(
      'DELETE FROM GalleryInventory WHERE inventoryId=?',
      [req.params.id],
      function (err, result) {
        if (err) {
          res.send(err);
          // console.log(err);
          return;
        }
        // console.log(result);
        res.redirect('/inventory');
      }
    );
  });

  return router;
})();

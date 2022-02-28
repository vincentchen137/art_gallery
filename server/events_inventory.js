module.exports = (function () {
  const express = require('express');
  const router = express.Router();
  var mysql = require('./dbcon.js');

  // GET Events_Inventory
  router.get('/', function (req, res) {
    let context = {};
    let events = {};
    let inventory = {};
    mysql.pool.query(
      'SELECT ei.event_inventoryId, e.eventId, e.eventName, i.inventoryId, i.artworkName FROM GalleryEvents_GalleryInventory ei INNER JOIN GalleryInventory i ON ei.inventoryId = i.inventoryId INNER JOIN GalleryEvents e ON ei.eventId = e.eventId ORDER BY ei.event_inventoryId ASC; SELECT inventoryId, artworkName FROM GalleryInventory ORDER BY artworkName ASC; SELECT eventId, eventName FROM GalleryEvents ORDER BY eventId ASC;',
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
            id: row.event_inventoryId,
            eventId: row.eventId,
            eventName: row.eventName,
            inventoryId: row.inventoryId,
            artworkName: row.artworkName,
          });
        });
        
        inventory.results = [];
        rows[1].forEach((inv) => {
          inventory.results.push({
            inventoryId: inv.inventoryId,
            artworkName: inv.artworkName,
          });
        });

        events.results = [];
        rows[2].forEach((ev) => {
          events.results.push({
            eventId: ev.eventId,
            eventName: ev.eventName,
          });
        });

        res.render('events_inventory', {context: context.results, inventory: inventory.results, events: events.results,});
      }
    );
  });

  // // Add inventory to an event
  router.post('/', function (req, res) {
    let error = {};
    mysql.pool.query(
      'INSERT INTO GalleryEvents_GalleryInventory SET eventId=?, inventoryId=? ',
      [req.body.eventId, req.body.inventoryId],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.eventId = req.body.eventId;
          error.inventoryId = req.body.inventoryId;
          if (err.code == 'ER_NO_REFERENCED_ROW_2'){
            error.message = 'Please add an artwork to an event using all required fields.';
          }
        }
        if (err) {
          res.render('events_inventory', { error: error });
        } else {
          res.redirect('/events_inventory');
        }
      }
    );
  });
  // // Get and populate events_inventory edit page
  router.get('/:id', function (req, res) {
    let context = {};
    let events = {};
    let inventory = {};
    // console.log(req.params.id);
    mysql.pool.query(
      'SELECT ei.event_inventoryId, e.eventId, e.eventName, i.inventoryId, i.artworkName FROM GalleryEvents_GalleryInventory ei INNER JOIN GalleryInventory i ON ei.inventoryId = i.inventoryId INNER JOIN GalleryEvents e ON ei.eventId = e.eventId WHERE ei.event_inventoryId=?; SELECT inventoryId, artworkName FROM GalleryInventory ORDER BY artworkName ASC; SELECT eventId, eventName FROM GalleryEvents ORDER BY eventId ASC;',
      [req.params.id],
      function (err, result) {
        if (err) {
          res.send(err);
          return;
        }
        // res.send(result);
        // console.log(result);
        context.results = [];
        result[0].forEach((ei) => {
          context.results.push({
            id: ei.event_inventoryId,
            eventId: ei.eventId,
            eventName: ei.eventName,
            inventoryId: ei.inventoryId,
            artworkName: ei.artworkName,
          });
        });
        
        inventory.results = [];
        result[1].forEach((inv) => {
          inventory.results.push({
            inventoryId: inv.inventoryId,
            artworkName: inv.artworkName,
          });
        });

        events.results = [];
        result[2].forEach((ev) => {
          events.results.push({
            eventId: ev.eventId,
            eventName: ev.eventName,
          });
        });

        res.render('events_inventory-edit', {context: context.results, events: events.results, inventory: inventory.results,});
      }
    );
  });

  // Edit Events_Inventory - handle editing of Events_Inventory table
  router.post('/edit/:id', function (req, res) {
    let error = {};
    mysql.pool.query(
      'UPDATE GalleryEvents_GalleryInventory SET eventId=?, inventoryId=? WHERE event_inventoryId=?;',
      [req.body.eventId, req.body.inventoryId, req.params.id],
      function (err, result) {
        if (err) {
          error.message = err.sqlMessage;
          error.eventId = req.body.eventId;
          error.inventoryId = req.body.inventoryId;
          error.id = req.params.id;
        }
        if (err) {
          res.render('events_inventory-edit', {error: error});
        } else {
          res.redirect('/events_inventory');
        }
      }  
    );
  });
  // Delete Events_Inventory by ID
  router.get('/delete/:id', function (req, res) {
    // console.log(req.params.id);
    mysql.pool.query(
      'SET FOREIGN_KEY_CHECKS=0; DELETE FROM GalleryEvents_GalleryInventory WHERE event_inventoryId=?; SET FOREIGN_KEY_CHECKS=1',
      [req.params.id],
      function (err, result) {
        if (err) {
          res.send(err);
          console.log(err);
          return;
        }
        // console.log(result);
        res.redirect('/events_inventory');
      }
    );
  });


  return router;
})();

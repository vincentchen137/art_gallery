-- Query for add a new character functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language
----------------------------------------------------------------------------------------------------------------------------------------------------------
-- Artists Page

-- Display & Search Artists table
SELECT artistId, firstName, lastName, email, phone FROM Artists WHERE firstName like :firstName_input || '%' AND lastName like :lastName_input || '%' AND email like :email_input || '%' AND phone like :phone_input || '%';

-- Edit page of particular row
SELECT * FROM Artists WHERE artistId=:artistId_input_artists_pg;

-- Update artist
UPDATE Artists SET firstName = :firstName_input_artists_pg, lastName = :lastName_input_artists_pg, email = :email_input_artists_pg, phone = :phone_input_artists_pg WHERE artistId = :artistId_input_artists_pg;

-- Delete artist
DELETE FROM Artists WHERE artistId = :artistId_input_artists_pg;

-- Add artist
INSERT INTO Artists SET firstName=:firstName_input_add_artists_pg, lastName=:lastName_input_add_artists_pg, email=:email_input_add_artists_pg, phone=:phone_input_add_artists_pg;

----------------------------------------------------------------------------------------------------------------------------------------------------------
-- Events Page
-- Display Events table
SELECT eventId, eventName, DATE_FORMAT(eventdate, "%Y-%m-%d") AS date FROM GalleryEvents; 

-- Edit page of particular row
SELECT eventId, eventName, DATE_FORMAT(eventdate, "%Y-%m-%d") AS date FROM GalleryEvents WHERE eventId=:eventId_input_events_pg;

-- Update event
UPDATE GalleryEvents SET eventName=:eventName_input_events_pg, eventDate=:eventDate_input_events_pg WHERE eventId=:eventId_input_events_pg;

-- Delete event
DELETE FROM GalleryEvents WHERE eventId = :eventId_input_events_pg;

-- Add event
INSERT INTO GalleryEvents SET eventName=:eventName_input_add_events_pg, eventDate=:eventDate_input_add_events_pg;

----------------------------------------------------------------------------------------------------------------------------------------------------------
-- Inventory Page
-- Display Inventory table
SELECT i.inventoryId, i.artworkName, a.firstName, a.lastName, CONCAT(a.firstName, " ", a.lastName) AS artistName, 
a.artistId, s.styleId, s.styleDescription, m.mediumId, m.mediumDescription 
  FROM GalleryInventory i 
    LEFT JOIN Artists a USING (artistId) 
    INNER JOIN Styles s USING (styleId) 
    INNER JOIN Mediums m USING (mediumId) 
  ORDER BY i.inventoryId; 
SELECT artistId, firstName, lastName, CONCAT(firstName, " ", lastName) AS artistName FROM Artists; 
SELECT styleId, styleDescription FROM Styles; SELECT mediumId, mediumDescription FROM Mediums;

-- Edit page of a particular row
-- if artistId = NULL
if (req.query.artist == 'null') {
  SELECT inventoryId, artworkName, artistId, styleId, styleDescription, mediumId, mediumDescription 
    FROM GalleryInventory 
      INNER JOIN Styles s USING (styleId) 
      INNER JOIN Mediums m USING (mediumId) 
        WHERE inventoryId=:inventoryId_input_inventory_pg;
  SELECT artistId, firstName, lastName, CONCAT(firstName, " ", lastName) AS artistName 
    FROM Artists 
      ORDER BY lastName;
  SELECT styleId, styleDescription FROM Styles;
  SELECT mediumId, mediumDescription FROM Mediums;
-- if artistId is not NULL
} else {
  SELECT inventoryId, artworkName, artistId, firstName, lastName, CONCAT(firstName, " ", lastName) AS artistName, 
  styleId, styleDescription, mediumId, mediumDescription 
    FROM GalleryInventory 
      INNER JOIN Artists USING(artistId) 
      INNER JOIN Styles s USING (styleId) 
      INNER JOIN Mediums m USING (mediumId) 
        WHERE inventoryId=:inventoryId_input_inventory_pg;
  SELECT artistId, firstName, lastName, CONCAT(firstName, " ", lastName) AS artistName FROM Artists ORDER BY lastName;
  SELECT styleId, styleDescription FROM Styles;
  SELECT mediumId, mediumDescription FROM Mediums;

-- Update artwork
UPDATE
  GalleryInventory
SET
  artworkName = :artworkName_input_inventory_pg,
  artistId = :artistId_input_inventory_pg,
  styleId = :styleId_input_inventory_pg,
  mediumId = :mediumId_input_inventory_pg
WHERE
  inventoryId = :inventoryId_input_inventory_pg;

-- Delete artwork
DELETE FROM GalleryInventory WHERE inventoryId = :inventoryId_input_inventory_pg;

-- Add artwork
INSERT INTO GalleryInventory SET artworkName=:artworkName_input_add_inventory_pg, artistId=:artistId_input_add_inventory_pg, 
styleId=:styleId_input_add_inventory_pg, mediumId=:mediumId_input_add_inventory_pg;

----------------------------------------------------------------------------------------------------------------------------------------------------------
--Styles Page
-- Display Styles table
SELECT styleId, styleDescription FROM Styles ORDER BY styleId;

-- Edit page of a particular row
SELECT * FROM Styles WHERE styleId=:styleId_input_styles_pg;

-- Update styles
UPDATE Styles SET styleDescription = :styleDescription_input_styles_pg WHERE styleId = :styleId_input_styles_pg;

-- Add styles
INSERT INTO Styles SET styleDescription=:styleDescription_input_add_styles_pg;

----------------------------------------------------------------------------------------------------------------------------------------------------------
--Mediums Page
-- Display Mediums table
SELECT mediumId, mediumDescription FROM Mediums ORDER BY mediumId;

-- Edit page of a particular row
SELECT * FROM Mediums WHERE mediumId=:mediumId_input_mediums_pg;

-- Update mediums
UPDATE Mediums SET mediumDescription=:mediumDescription_input_mediums_pg WHERE mediumId=:mediumId_input_mediums_pg;

-- Add mediums
INSERT INTO Mediums SET mediumDescription=:mediumDescription_input_add_styles_pg;

----------------------------------------------------------------------------------------------------------------------------------------------------------
--Event_Inventory Page
-- Display Events_Inventory table
SELECT ei.event_inventoryId, e.eventId, e.eventName, i.inventoryId, i.artworkName 
FROM GalleryEvents_GalleryInventory ei 
  INNER JOIN GalleryInventory i ON ei.inventoryId = i.inventoryId 
  INNER JOIN GalleryEvents e ON ei.eventId = e.eventId 
  ORDER BY ei.event_inventoryId ASC; 
SELECT inventoryId, artworkName 
FROM GalleryInventory 
  ORDER BY artworkName ASC; 
SELECT eventId, eventName 
FROM GalleryEvents 
  ORDER BY eventId ASC;

-- Edit page of a particular row
SELECT ei.event_inventoryId, e.eventId, e.eventName, i.inventoryId, i.artworkName 
FROM GalleryEvents_GalleryInventory ei 
  INNER JOIN GalleryInventory i ON ei.inventoryId = i.inventoryId 
  INNER JOIN GalleryEvents e ON ei.eventId = e.eventId 
    WHERE ei.event_inventoryId=:event_inventory_Id_input_events_inventory_pg; 
SELECT inventoryId, artworkName FROM GalleryInventory ORDER BY artworkName ASC; 
SELECT eventId, eventName FROM GalleryEvents ORDER BY eventId ASC;

-- Update events_inventory
UPDATE GalleryEvents_GalleryInventory SET eventId=:eventId_input_events_inventory_pg, inventoryId=:inventoryId_input_events_inventory_pg 
  WHERE event_inventoryId=:event_inventoryId_input_events_inventory_pg;

-- Delete events_inventory
SET FOREIGN_KEY_CHECKS=0; DELETE FROM GalleryEvents_GalleryInventory WHERE event_inventoryId=:event_inventoryId_input_events_inventory_pg; SET FOREIGN_KEY_CHECKS=1
-- DELETE FROM GalleryEvents_GalleryInventory WHERE eventId = :eventId_input_events_inventory_pg;

-- Add events_inventory
INSERT INTO GalleryEvents_GalleryInventory SET eventId=eventId_add_events_inventory_pg, inventoryId=inventoryId_input_add_events_inventory_pg;

----------------------------------------------------------------------------------------------------------------------------------------------------------
--Events_Artists Page
-- Display Events_Artists table
SELECT ea.event_artistId, e.eventId, a.artistId, e.eventName, CONCAT(a.firstName, ' ', a.lastName) AS artistName 
FROM GalleryEvents_Artists ea 
  INNER JOIN Artists a ON ea.artistId = a.artistId 
  INNER JOIN GalleryEvents e ON ea.eventId = e.eventId 
  ORDER BY ea.event_artistId ASC; 
SELECT artistId, artistId, CONCAT(firstName, ' ', lastName) AS artistName 
FROM Artists 
  ORDER BY lastName ASC; 
SELECT eventId, eventName 
FROM GalleryEvents 
  ORDER BY eventId ASC;

-- Edit page of a particular row
SELECT ea.event_artistId, e.eventId, a.artistId, e.eventName, CONCAT(a.firstName, " ", a.lastName) AS artistName 
FROM GalleryEvents_Artists ea 
  INNER JOIN Artists a ON ea.artistId = a.artistId 
  INNER JOIN GalleryEvents e ON ea.eventId = e.eventId 
    WHERE ea.event_artistId=:event_artistId_input_events_artists_pg; 
SELECT artistId, CONCAT(firstName, " ", lastName) AS artistName FROM Artists ORDER BY lastName ASC; 
SELECT eventId, eventName FROM GalleryEvents ORDER BY eventId ASC;

-- Update events_artists
UPDATE GalleryEvents_Artists SET eventId=:eventId_input_events_artists_pg, artistId=:artistId_input_events_artists_pg 
  WHERE event_artistId=:event_artistId_input_events_artists_pg;

-- Delete events_artists
SET FOREIGN_KEY_CHECKS=0; DELETE FROM GalleryEvents_Artists WHERE event_artistId=:event_artistId_input_events_artists_pg; SET FOREIGN_KEY_CHECKS=1 

-- Add events_artists
INSERT INTO GalleryEvents_Artists SET eventId=:eventId_input_add_events_artists_pg, artistId=:artistId_input_add_events_artists_pg;

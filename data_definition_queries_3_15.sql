DROP TABLE IF EXISTS `GalleryEvents_Artists`;
DROP TABLE IF EXISTS `GalleryEvents_GalleryInventory`;
DROP TABLE IF EXISTS `GalleryInventory`;
DROP TABLE IF EXISTS `Artists`;

CREATE TABLE Artists(
  artistId int(11) AUTO_INCREMENT PRIMARY KEY,
  firstName varchar(50) NOT NULL,
  lastName varchar(50) NOT NULL,
  email varchar(50) NOT NULL UNIQUE,
  phone char(10) NOT NULL,
  CONSTRAINT fullName UNIQUE(firstName, lastName)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `Styles`;

CREATE TABLE Styles(
  styleId int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  styleDescription varchar(255) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `Mediums`;

CREATE TABLE Mediums(
  mediumId int(11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  mediumDescription varchar(255) NOT NULL UNIQUE
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `GalleryInventory`;

CREATE TABLE GalleryInventory(
  inventoryId int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  artworkName varchar(255) NOT NULL,
  artistId int(11),
  styleId int(11) NOT NULL,
  mediumId int(11) NOT NULL,
  CONSTRAINT uniqueArtwork UNIQUE(artworkName, artistId),
  FOREIGN KEY (artistId) REFERENCES Artists(artistId) ON DELETE SET NULL,
  FOREIGN KEY (styleId) REFERENCES Styles(styleId),
  FOREIGN KEY (mediumId) REFERENCES Mediums(mediumId)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

DROP TABLE IF EXISTS `GalleryEvents`;

CREATE TABLE GalleryEvents(
  eventId int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  eventName varchar(255) NOT NULL UNIQUE,
  eventDate date UNIQUE NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

CREATE TABLE GalleryEvents_Artists(
  event_artistId int (11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  eventId int(11) NOT NULL,
  artistId int(11) NOT NULL,
  FOREIGN KEY (eventId) REFERENCES GalleryEvents(eventId) ON DELETE CASCADE,
  FOREIGN KEY (artistId) REFERENCES Artists(artistId) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

CREATE TABLE GalleryEvents_GalleryInventory(
  event_inventoryId int (11) AUTO_INCREMENT NOT NULL PRIMARY KEY,
  eventId int(11) NOT NULL,
  inventoryId int(11) NOT NULL,
  FOREIGN KEY (eventId) REFERENCES GalleryEvents(eventId) ON DELETE CASCADE,
  FOREIGN KEY (inventoryId) REFERENCES GalleryInventory(inventoryId) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

-- Make Events_Artists unique and not allow for duplicate INSERTS or UPDATES
ALTER TABLE `GalleryEvents_Artists` ADD UNIQUE (`eventId`, `artistId`);

-- Make Events_Inventory unique and not allow for duplicate INSERTS or UPDATES
ALTER TABLE `GalleryEvents_GalleryInventory` ADD UNIQUE (`eventId`, `inventoryId`);

-- INSERT QUERIES
--  Data created from mockaroo, https://www.mockaroo.com/
INSERT INTO
  Artists (firstName, lastName, email, phone)
VALUES
  (
    'Bartholomeus',
    'Wapplington',
    'bwapplington0@europa.eu',
    '4295939266'
  ),
  (
    'Maible',
    'Frenchum',
    'mfrenchum1@washingtonpost.com',
    '1373031077'
  ),
  (
    'Florian',
    'Kiely',
    'fkiely2@loc.gov',
    '8226627070'
  ),
  (
    'Milty',
    'O''Rudden',
    'morudden3@histats.com',
    '1562985754'
  ),
  (
    'Jamill',
    'Loudwell',
    'jloudwell0@ocn.ne.jp',
    '8118741040'
  ),
  (
    'Maison',
    'Joynes',
    'mjoynes1@newsvine.com',
    '8979627642'
  ),
  (
    'Clemmie',
    'Cuffe',
    'ccuffe2@ted.com',
    '6603127737'
  ),
  (
    'Paul',
    'Picasso',
    'ppicasso12@gmail.com',
    '1852627837'
  );

INSERT INTO
  Styles (styleDescription)
VALUES
  ('Realism'),
  ('Painterly'),
  ('Abstract'),
  ('Impressionism'),
  ('Expressionism/Fauvism');

INSERT INTO
  Mediums (mediumDescription)
VALUES
  ('Oil'),
  ('Acrylic'),
  ('Charcoal'),
  ('Glass'),
  ('Pencil'),
  ('Pastel');

INSERT INTO
  GalleryInventory (artworkName, artistId, styleId, mediumId)
VALUES
  ('Planets', 1, 1, 1),
  ('Clouds', 2, 2, 2),
  ('Oceans', 3, 3, 3),
  ('Mountains', 4, 4, 4),
  ('Beach', 2, 5, 5),
  ('Sunsets', 3, 4, 6),
  ('Moon', 5, 2, 3),
  ('Skies', NULL, 3, 6),
  ('Stars', 8, 1, 3),
  ('Galaxy', 8, 1, 4);

INSERT INTO
  GalleryEvents (eventName, eventDate)
VALUES
  ('January', '2021-01-19'),
  ('February', '2021-02-06'),
  ('March', '2021-03-19'),
  ('April', '2021-04-02'),
  ('May', '2021-05-05'),
  ('June', '2021-06-29');

INSERT INTO
  GalleryEvents_Artists (eventId, artistId)
VALUES
  (1, 2),
  (1, 3),
  (2, 2),
  (2, 4),
  (3, 2),
  (3, 3);

INSERT INTO
  GalleryEvents_GalleryInventory (eventId, inventoryId)
VALUES
  (2, 3),
  (3, 4),
  (4, 5);
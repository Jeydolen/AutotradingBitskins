-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: bitskins_csgo_prod
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `business_query`
--

DROP TABLE IF EXISTS `business_query`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_query` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `query` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_query`
--

LOCK TABLES `business_query` WRITE;
/*!40000 ALTER TABLE `business_query` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_query` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dumb_item`
--

DROP TABLE IF EXISTS `dumb_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dumb_item` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `item_type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_item_type_idx` (`item_type`),
  CONSTRAINT `fk_dumb_item_to_item_type` FOREIGN KEY (`item_type`) REFERENCES `item_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=275 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dumb_item`
--

LOCK TABLES `dumb_item` WRITE;
/*!40000 ALTER TABLE `dumb_item` DISABLE KEYS */;
INSERT INTO `dumb_item` VALUES (1,'Sealed Graffiti | Sorry (Blood Red)',NULL),(2,'Name Tag',NULL),(3,'Gamma 2 Case Key',NULL),(4,'Prisma Case Key',NULL),(5,'Spectrum 2 Case Key',NULL),(6,'Winter Offensive Case Key',NULL),(7,'Operation Hydra Case Key',NULL),(8,'StatTrak™ Swap Tool',NULL),(9,'Welcome to the Clutch Pin',NULL),(10,'CMB Pin',NULL),(11,'Office Pin',NULL),(12,'Aces High Pin',NULL),(13,'Health Pin',NULL),(14,'Valeria Phoenix Pin',NULL),(15,'Howl Pin',NULL),(16,'Patch | Bloodhound',NULL),(17,'Patch | Dragon',NULL),(18,'Sealed Graffiti | Ninja (Monster Purple)',NULL),(19,'Gamma Case Key',NULL),(20,'Operation Bloodhound Access Pass',NULL),(21,'Sustenance! Pin',NULL),(22,'Brigadier General Pin',NULL),(23,'Cobblestone Pin',NULL),(24,'City 17 Pin',NULL),(25,'Sealed Graffiti | Heart (War Pig Pink)',NULL),(26,'Inferno 2 Pin',NULL),(27,'Sealed Graffiti | Heart (Princess Pink)',NULL),(28,'Sealed Graffiti | Heart (Monster Purple)',NULL),(29,'Sealed Graffiti | Tombstone (Blood Red)',NULL),(30,'Nuke Pin',NULL),(31,'Sealed Graffiti | Sheriff (Battle Green)',NULL),(32,'Sealed Graffiti | NT (Blood Red)',NULL),(33,'Sealed Graffiti | Goofy (Cash Green)',NULL),(34,'Sealed Graffiti | Oops (Bazooka Pink)',NULL),(35,'Sealed Graffiti | Little EZ (Bazooka Pink)',NULL),(36,'Sealed Graffiti | King Me (Tracer Yellow)',NULL),(37,'Sealed Graffiti | Choke (Shark White)',NULL),(38,'Sealed Graffiti | Broken Heart (Monarch Blue)',NULL),(39,'Sealed Graffiti | Heart (Blood Red)',NULL),(40,'Sealed Graffiti | Heart (Tracer Yellow)',NULL),(41,'Sealed Graffiti | Heart (Bazooka Pink)',NULL),(42,'Patch | Wildfire',NULL),(43,'Sealed Graffiti | Heart (Brick Red)',NULL),(44,'Guardian 3 Pin',NULL),(45,'Sealed Graffiti | Smarmy (Wire Blue)',NULL),(46,'Sealed Graffiti | Little Bock (Frog Green)',NULL),(47,'Sealed Graffiti | Rly (Monarch Blue)',NULL),(48,'Sealed Graffiti | Tombstone (Shark White)',NULL),(49,'Sealed Graffiti | Little Bock (Tracer Yellow)',NULL),(50,'Sealed Graffiti | Little EZ (Cash Green)',NULL),(51,'Sealed Graffiti | BOOM (Desert Amber)',NULL),(52,'Sealed Graffiti | Little EZ (Violent Violet)',NULL),(53,'Sealed Graffiti | Little Bock (Cash Green)',NULL),(54,'Sealed Graffiti | Little EZ (Princess Pink)',NULL),(55,'Sealed Graffiti | Silver Bullet (Dust Brown)',NULL),(56,'Patch | Hydra',NULL),(57,'Patch | Phoenix',NULL),(58,'Vortigaunt Pin',NULL),(59,'Baggage Pin',NULL),(60,'Sealed Graffiti | Dead Now (Monster Purple)',NULL),(61,'Sealed Graffiti | Dizzy (Monster Purple)',NULL),(62,'Sealed Graffiti | Little Crown (Battle Green)',NULL),(63,'Patch | Vanguard',NULL),(64,'Operation Hydra Access Pass',NULL),(65,'Wildfire Pin',NULL),(66,'Sealed Graffiti | Okay (Blood Red)',NULL),(67,'Sealed Graffiti | Silver Bullet (Princess Pin',NULL),(68,'Sealed Graffiti | Shining Star (Brick Red)',NULL),(69,'Sealed Graffiti | Puke (Dust Brown)',NULL),(70,'Sealed Graffiti | Puke (Violent Violet)',NULL),(71,'Sealed Graffiti | Applause (Jungle Green)',NULL),(72,'Sealed Graffiti | Question Mark (Desert Amber',NULL),(73,'Sealed Graffiti | BOOM (Tiger Orange)',NULL),(74,'Sealed Graffiti | 200 IQ (Battle Green)',NULL),(75,'Sealed Graffiti | 1G (War Pig Pink)',NULL),(76,'Sealed Graffiti | BOOM (War Pig Pink)',NULL),(77,'Sealed Graffiti | Choke (Cash Green)',NULL),(78,'Sealed Graffiti | Lightbulb (Shark White)',NULL),(79,'Sealed Graffiti | Choke (Frog Green)',NULL),(80,'Sealed Graffiti | Happy Cat (Brick Red)',NULL),(81,'Sealed Graffiti | Applause (SWAT Blue)',NULL),(82,'Sealed Graffiti | Smooch (Bazooka Pink)',NULL),(83,'Sealed Graffiti | Happy Cat (Battle Green)',NULL),(84,'Sealed Graffiti | Dizzy (SWAT Blue)',NULL),(85,'Sealed Graffiti | Little EZ (Wire Blue)',NULL),(86,'Sealed Graffiti | Applause (Frog Green)',NULL),(87,'Sealed Graffiti | Smooch (Monarch Blue)',NULL),(88,'Sealed Graffiti | Little Crown (Cash Green)',NULL),(89,'Sealed Graffiti | OMG (Tracer Yellow)',NULL),(90,'Sealed Graffiti | Okay (Violent Violet)',NULL),(91,'Sealed Graffiti | Shining Star (Cash Green)',NULL),(92,'Sealed Graffiti | BOOM (Blood Red)',NULL),(93,'Sealed Graffiti | Smooch (Princess Pink)',NULL),(94,'Sealed Graffiti | Little Crown (Dust Brown)',NULL),(95,'Sealed Graffiti | Applause (Tracer Yellow)',NULL),(96,'Sealed Graffiti | Uh Oh (Tiger Orange)',NULL),(97,'Sealed Graffiti | Grimace (Jungle Green)',NULL),(98,'Sealed Graffiti | Fart (Cash Green)',NULL),(99,'Sealed Graffiti | BEEP (Monarch Blue)',NULL),(100,'Sealed Graffiti | Phoenix',NULL),(101,'Sealed Graffiti | Choke (Blood Red)',NULL),(102,'Sealed Graffiti | Hop (Wire Blue)',NULL),(103,'Canals Pin',NULL),(104,'Death Sentence Pin',NULL),(105,'Patch | Combine Helmet',NULL),(106,'Sealed Graffiti | Denied (Monarch Blue)',NULL),(107,'Lambda Pin',NULL),(108,'Headcrab Glyph Pin',NULL),(109,'Guardian 2 Pin',NULL),(110,'Patch | Welcome to the Clutch',NULL),(111,'Shadow Case Key',NULL),(112,'Patch | Shattered Web',NULL),(113,'Patch | Koi',NULL),(114,'Patch | Breakout',NULL),(115,'Patch | Howl',NULL),(116,'Patch | Vigilance',NULL),(117,'Patch | Bravo',NULL),(118,'Patch | Chicken Lover',NULL),(119,'Patch | Easy Peasy',NULL),(120,'Patch | Payback',NULL),(121,'Patch | Longevity',NULL),(122,'Patch | The Boss',NULL),(123,'Patch | Headcrab Glyph',NULL),(124,'Patch | Sustenance!',NULL),(125,'Chroma Case Key',NULL),(126,'Huntsman Case Key',NULL),(127,'Patch | Crazy Banana',NULL),(128,'Sealed Graffiti | Ace',NULL),(129,'Sealed Graffiti | Wings',NULL),(130,'Sealed Graffiti | Real MVP',NULL),(131,'Sealed Graffiti | Silver Bullet (Wire Blue)',NULL),(132,'Sealed Graffiti | Choke (Dust Brown)',NULL),(133,'Sealed Graffiti | BEEP (Battle Green)',NULL),(134,'Sealed Graffiti | Question Mark (Shark White)',NULL),(135,'Sealed Graffiti | Little EZ (Blood Red)',NULL),(136,'Sealed Graffiti | BEEP (Princess Pink)',NULL),(137,'Sealed Graffiti | Chef Kiss (Cash Green)',NULL),(138,'Sealed Graffiti | Thoughtfull (Frog Green)',NULL),(139,'Sealed Graffiti | Fart (Shark White)',NULL),(140,'Sealed Graffiti | Welcome to the Clutch',NULL),(141,'Sealed Graffiti | Happy Cat (Monarch Blue)',NULL),(142,'Sealed Graffiti | Astralis | London 2018',NULL),(143,'CS:GO Capsule Key',NULL),(144,'Hydra Pin',NULL),(145,'Bravo Pin',NULL),(146,'Patch | Danger Zone',NULL),(147,'Sealed Graffiti | Shining Star (Tracer Yellow',NULL),(148,'Easy Peasy Pin',NULL),(149,'Sealed Graffiti | Renegades | London 2018',NULL),(150,'Sealed Graffiti | Gambit Esports | London 201',NULL),(151,'Dust II Pin',NULL),(152,'Tactics Pin',NULL),(153,'Sealed Graffiti | Thoughtfull (Desert Amber)',NULL),(154,'Sealed Graffiti | Thoughtfull (Dust Brown)',NULL),(155,'Sealed Graffiti | Goofy (Frog Green)',NULL),(156,'Sealed Graffiti | Little Bock (SWAT Blue)',NULL),(157,'Sealed Graffiti | BEEP (Cash Green)',NULL),(158,'Sealed Graffiti | Grimace (Blood Red)',NULL),(159,'Sealed Graffiti | Rly (Tiger Orange)',NULL),(160,'Sealed Graffiti | NT (Cash Green)',NULL),(161,'Sealed Graffiti | Happy Cat (Frog Green)',NULL),(162,'Sealed Graffiti | NT (Tiger Orange)',NULL),(163,'Sealed Graffiti | Skull n\' Crosshairs',NULL),(164,'Chroma 2 Case Key',NULL),(165,'Patch | City 17',NULL),(166,'Guardian Pin',NULL),(167,'Mirage Pin',NULL),(168,'Sealed Graffiti | Smarmy (Tracer Yellow)',NULL),(169,'Cache Pin',NULL),(170,'Italy Pin',NULL),(171,'Patch | Rage',NULL),(172,'Sealed Graffiti | King Me (Desert Amber)',NULL),(173,'Sealed Graffiti | Broken Heart (Tiger Orange)',NULL),(174,'Sealed Graffiti | Choke (Wire Blue)',NULL),(175,'Sealed Graffiti | BEEP (Wire Blue)',NULL),(176,'Sealed Graffiti | Happy Cat (SWAT Blue)',NULL),(177,'Sealed Graffiti | Oops (Shark White)',NULL),(178,'Sealed Graffiti | Smirk (Blood Red)',NULL),(179,'Sealed Graffiti | Bock Bock (Tracer Yellow)',NULL),(180,'Sealed Graffiti | Chef Kiss (Brick Red)',NULL),(181,'Sealed Graffiti | Rly (SWAT Blue)',NULL),(182,'Sealed Graffiti | BOOM (Wire Blue)',NULL),(183,'Sealed Graffiti | Question Mark (Brick Red)',NULL),(184,'Sealed Graffiti | Hop (SWAT Blue)',NULL),(185,'Sealed Graffiti | Dead Now (Monarch Blue)',NULL),(186,'Sealed Graffiti | Grimace (Desert Amber)',NULL),(187,'Sealed Graffiti | OMG (Shark White)',NULL),(188,'Sealed Graffiti | Applause (War Pig Pink)',NULL),(189,'Sealed Graffiti | Broken Heart (Violent Viole',NULL),(190,'Sealed Graffiti | Kiss (Desert Amber)',NULL),(191,'Sealed Graffiti | Happy Cat (Dust Brown)',NULL),(192,'Sealed Graffiti | Smarmy (Monster Purple)',NULL),(193,'Berlin 2019 Viewer Pass',NULL),(194,'Sealed Graffiti | OpTic Gaming | Atlanta 2017',NULL),(195,'Sealed Graffiti | Question Mark (Tiger Orange',NULL),(196,'Sealed Graffiti | Little Bock (Jungle Green)',NULL),(197,'Sealed Graffiti | Silver Bullet (Monarch Blue',NULL),(198,'Sealed Graffiti | BEEP (Dust Brown)',NULL),(199,'Sealed Graffiti | Question Mark (SWAT Blue)',NULL),(200,'Sealed Graffiti | Smooch (Shark White)',NULL),(201,'Sealed Graffiti | OMG (SWAT Blue)',NULL),(202,'Sealed Graffiti | Uh Oh (Battle Green)',NULL),(203,'Sealed Graffiti | Shining Star (Tiger Orange)',NULL),(204,'Sealed Graffiti | Little Crown (Monarch Blue)',NULL),(205,'Sealed Graffiti | Dead Now (Battle Green)',NULL),(206,'Sealed Graffiti | Smirk (War Pig Pink)',NULL),(207,'Sealed Graffiti | OMG (Monster Purple)',NULL),(208,'Sealed Graffiti | Smooch (Tracer Yellow)',NULL),(209,'Sealed Graffiti | Applause (Violent Violet)',NULL),(210,'Sealed Graffiti | Okay (Monster Purple)',NULL),(211,'Sealed Graffiti | NT (Shark White)',NULL),(212,'Spectrum Case Key',NULL),(213,'Clutch Case Key',NULL),(214,'Sealed Graffiti | OMG (Cash Green)',NULL),(215,'Sealed Graffiti | Broken Heart (Frog Green)',NULL),(216,'Sealed Graffiti | Goofy (Jungle Green)',NULL),(217,'Sealed Graffiti | Uh Oh (SWAT Blue)',NULL),(218,'Sealed Graffiti | Smirk (Frog Green)',NULL),(219,'Sealed Graffiti | Smarmy (Brick Red)',NULL),(220,'Sealed Graffiti | NT (Wire Blue)',NULL),(221,'Sealed Graffiti | 1G (Desert Amber)',NULL),(222,'Sealed Graffiti | Denied (SWAT Blue)',NULL),(223,'Sealed Graffiti | Rly (Monster Purple)',NULL),(224,'Sealed Graffiti | Smooch (Battle Green)',NULL),(225,'Sealed Graffiti | Smirk (Brick Red)',NULL),(226,'Sealed Graffiti | Rly (Cash Green)',NULL),(227,'Sealed Graffiti | Smirk (Bazooka Pink)',NULL),(228,'Sealed Graffiti | Dizzy (Frog Green)',NULL),(229,'Sealed Graffiti | Goofy (Tracer Yellow)',NULL),(230,'Sealed Graffiti | Thoughtfull (Shark White)',NULL),(231,'Danger Zone Case Key',NULL),(232,'Operation Breakout Case Key',NULL),(233,'CS20 Case Key',NULL),(234,'Sealed Graffiti | Banana',NULL),(235,'Civil Protection Pin',NULL),(236,'Sealed Graffiti | Non-Veg',NULL),(237,'Sealed Graffiti | Chabo',NULL),(238,'Sealed Graffiti | Water Gun',NULL),(239,'Sealed Graffiti | Toy Tiger',NULL),(240,'Sealed Graffiti | Ivette',NULL),(241,'Sealed Graffiti | Rly (Blood Red)',NULL),(242,'Sealed Graffiti | 200 IQ (Blood Red)',NULL),(243,'Sealed Graffiti | Broken Heart (Brick Red)',NULL),(244,'Sealed Graffiti | Dead Now (Blood Red)',NULL),(245,'Sealed Graffiti | Cerberus',NULL),(246,'Sealed Graffiti | Noodles',NULL),(247,'Sealed Graffiti | Flickshot',NULL),(248,'Sealed Graffiti | Silver Bullet (Blood Red)',NULL),(249,'Sealed Graffiti | Tamara',NULL),(250,'Phoenix Pin',NULL),(251,'Sealed Graffiti | Smirk (Jungle Green)',NULL),(252,'Sealed Graffiti | Puke (Princess Pink)',NULL),(253,'Sealed Graffiti | BOOM (Dust Brown)',NULL),(254,'Sealed Graffiti | 1G (Tiger Orange)',NULL),(255,'Sealed Graffiti | Smooch (Tiger Orange)',NULL),(256,'Sealed Graffiti | Grimace (SWAT Blue)',NULL),(257,'Sealed Graffiti | Goofy (Desert Amber)',NULL),(258,'Sealed Graffiti | Question Mark (Cash Green)',NULL),(259,'Sealed Graffiti | Goofy (Dust Brown)',NULL),(260,'Sealed Graffiti | Uh Oh (Wire Blue)',NULL),(261,'Sealed Graffiti | Grimace (War Pig Pink)',NULL),(262,'Sealed Graffiti | Dead Now (Dust Brown)',NULL),(263,'Sealed Graffiti | Dizzy (Desert Amber)',NULL),(264,'Sealed Graffiti | BOOM (SWAT Blue)',NULL),(265,'Sealed Graffiti | Clutch King',NULL),(266,'Chroma Pin',NULL),(267,'Guardian Elite Pin',NULL),(268,'Victory Pin',NULL),(269,'Bloodhound Pin',NULL),(270,'Inferno Pin',NULL),(271,'Overpass Pin',NULL),(272,'Operation Wildfire Case Key',NULL),(273,'Sealed Graffiti | Smarmy (Princess Pink)',NULL),(274,'Sealed Graffiti | Rekt',NULL);
/*!40000 ALTER TABLE `dumb_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_type`
--

DROP TABLE IF EXISTS `item_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_type` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_type`
--

LOCK TABLES `item_type` WRITE;
/*!40000 ALTER TABLE `item_type` DISABLE KEYS */;
INSERT INTO `item_type` VALUES (0,'UNKNOWN'),(1,'Skin'),(2,'Agent'),(3,'Sticker'),(4,'Container'),(5,'AFER');
/*!40000 ALTER TABLE `item_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orm_mapping`
--

DROP TABLE IF EXISTS `orm_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orm_mapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `JSON_NAME` varchar(255) DEFAULT NULL,
  `OBJECT_NAME` varchar(255) DEFAULT NULL,
  `SQL_NAME` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orm_mapping`
--

LOCK TABLES `orm_mapping` WRITE;
/*!40000 ALTER TABLE `orm_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `orm_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skin`
--

DROP TABLE IF EXISTS `skin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(75) DEFAULT NULL,
  `short_name` varchar(45) DEFAULT NULL,
  `image_url` varchar(511) DEFAULT NULL,
  `skin_set` int(11) DEFAULT NULL,
  `skin_rarity` int(11) DEFAULT NULL,
  `weapon` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_skin_set_idx` (`skin_set`),
  KEY `fk_skin_rarity_idx` (`skin_rarity`),
  KEY `fk_weapon_category_idx` (`weapon`),
  CONSTRAINT `fk_skin_rarity` FOREIGN KEY (`skin_rarity`) REFERENCES `skin_rarity` (`id`),
  CONSTRAINT `fk_skin_set` FOREIGN KEY (`skin_set`) REFERENCES `skin_set` (`id`),
  CONSTRAINT `fk_weapon` FOREIGN KEY (`weapon`) REFERENCES `weapon` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skin`
--

LOCK TABLES `skin` WRITE;
/*!40000 ALTER TABLE `skin` DISABLE KEYS */;
INSERT INTO `skin` VALUES (1,'NULL_SKIN',NULL,NULL,NULL,NULL,NULL),(2,'Desert Eagle | Blaze',NULL,NULL,NULL,NULL,NULL),(3,'Karambit | Forest DDPAT',NULL,NULL,NULL,NULL,NULL),(4,'AWP | Containment Breach',NULL,NULL,NULL,NULL,NULL),(5,'AK-47 | Aquamarine Revenge',NULL,NULL,NULL,NULL,NULL),(6,'M9 Bayonet | Doppler',NULL,NULL,NULL,NULL,NULL),(7,'USP-S | Kill Confirmed',NULL,NULL,NULL,NULL,NULL),(8,'P90 | Asiimov',NULL,NULL,NULL,NULL,NULL),(9,'USP-S | Neo-Noir',NULL,NULL,NULL,NULL,NULL),(10,'M4A4 | The Emperor',NULL,NULL,NULL,NULL,NULL),(11,'Talon Knife | Tiger Tooth',NULL,NULL,NULL,NULL,NULL),(12,'M4A4 | Poseidon',NULL,NULL,NULL,NULL,NULL),(13,'Bayonet | Gamma Doppler',NULL,NULL,NULL,NULL,NULL),(14,'Talon Knife | Case Hardened',NULL,NULL,NULL,NULL,NULL),(15,'M9 Bayonet | Autotronic',NULL,NULL,NULL,NULL,NULL),(16,'Flip Knife | Tiger Tooth',NULL,NULL,NULL,NULL,NULL),(17,'AK-47 | Fire Serpent',NULL,NULL,NULL,NULL,NULL),(18,'Bayonet | Doppler',NULL,NULL,NULL,NULL,NULL),(19,'Talon Knife | Doppler',NULL,NULL,NULL,NULL,NULL),(20,'Skeleton Knife | Urban Masked',NULL,NULL,NULL,NULL,NULL),(21,'Gut Knife | Marble Fade',NULL,NULL,NULL,NULL,NULL),(22,'M9 Bayonet | Case Hardened',NULL,NULL,NULL,NULL,NULL),(23,'M4A4 | Asiimov',NULL,NULL,NULL,NULL,NULL),(24,'Ursus Knife | Marble Fade',NULL,NULL,NULL,NULL,NULL),(25,'Karambit | Doppler',NULL,NULL,NULL,NULL,NULL),(26,'Falchion Knife | Boreal Forest',NULL,NULL,NULL,NULL,NULL),(27,'Karambit | Blue Steel',NULL,NULL,NULL,NULL,NULL),(28,'M9 Bayonet | Ultraviolet',NULL,NULL,NULL,NULL,NULL),(29,'SSG 08 | Dragonfire',NULL,NULL,NULL,NULL,NULL),(30,'Ursus Knife | Stained',NULL,NULL,NULL,NULL,NULL),(31,'Bowie Knife | Marble Fade',NULL,NULL,NULL,NULL,NULL),(32,'Bowie Knife | Slaughter',NULL,NULL,NULL,NULL,NULL),(33,'M4A4 | Desolate Space',NULL,NULL,NULL,NULL,NULL),(34,'AK-47 | Frontside Misty',NULL,NULL,NULL,NULL,NULL),(35,'AWP | BOOM',NULL,NULL,NULL,NULL,NULL),(36,'AWP | Neo-Noir',NULL,NULL,NULL,NULL,NULL),(37,'AWP | Hyper Beast',NULL,NULL,NULL,NULL,NULL),(38,'Karambit | Gamma Doppler',NULL,NULL,NULL,NULL,NULL),(39,'Bowie Knife | Ultraviolet',NULL,NULL,NULL,NULL,NULL),(40,'AK-47 | Bloodsport',NULL,NULL,NULL,NULL,NULL),(41,'AK-47 | Neon Revolution',NULL,NULL,NULL,NULL,NULL),(42,'AK-47 | Neon Rider',NULL,NULL,NULL,NULL,NULL),(43,'Glock-18 | Fade',NULL,NULL,NULL,NULL,NULL),(44,'AK-47 | Wild Lotus',NULL,NULL,NULL,NULL,NULL),(45,'AWP | The Prince',NULL,NULL,NULL,NULL,NULL),(46,'AK-47 | Vulcan',NULL,NULL,NULL,NULL,NULL),(47,'AK-47 | Jaguar',NULL,NULL,NULL,NULL,NULL),(48,'Talon Knife | Ultraviolet',NULL,NULL,NULL,NULL,NULL),(49,'AWP | Asiimov',NULL,NULL,NULL,NULL,NULL),(50,'M4A4 | Buzz Kill',NULL,NULL,NULL,NULL,NULL),(51,'Talon Knife | Night Stripe',NULL,NULL,NULL,NULL,NULL),(52,'AWP | Fever Dream',NULL,NULL,NULL,NULL,NULL),(53,'M9 Bayonet | Gamma Doppler',NULL,NULL,NULL,NULL,NULL),(54,'AWP | Mortis',NULL,NULL,NULL,NULL,NULL),(55,'AK-47 | The Empress',NULL,NULL,NULL,NULL,NULL),(56,'AK-47 | Point Disarray',NULL,NULL,NULL,NULL,NULL),(57,'AK-47 | Case Hardened',NULL,NULL,NULL,NULL,NULL),(58,'Falchion Knife | Doppler',NULL,NULL,NULL,NULL,NULL),(59,'Bayonet | Ultraviolet',NULL,NULL,NULL,NULL,NULL),(60,'Skeleton Knife | Forest DDPAT',NULL,NULL,NULL,NULL,NULL),(61,'Desert Eagle | Emerald Jörmungandr',NULL,NULL,NULL,NULL,NULL),(62,'Desert Eagle | Mecha Industries',NULL,NULL,NULL,NULL,NULL),(63,'Navaja Knife | Scorched',NULL,NULL,NULL,NULL,NULL),(64,'Shadow Daggers | Slaughter',NULL,NULL,NULL,NULL,NULL),(65,'Gut Knife | Doppler',NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `skin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skin_rarity`
--

DROP TABLE IF EXISTS `skin_rarity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skin_rarity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skin_rarity`
--

LOCK TABLES `skin_rarity` WRITE;
/*!40000 ALTER TABLE `skin_rarity` DISABLE KEYS */;
INSERT INTO `skin_rarity` VALUES (0,'Unknown'),(1,'Consumer Grade'),(2,'Industrial Grade'),(3,'Mil-Spec Grade'),(4,'Restricted'),(5,'Classified'),(6,'Covert'),(7,'Contraband');
/*!40000 ALTER TABLE `skin_rarity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skin_sell_order`
--

DROP TABLE IF EXISTS `skin_sell_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skin_sell_order` (
  `name` varchar(255) NOT NULL,
  `market_name` varchar(45) DEFAULT NULL,
  `item_state` int(11) DEFAULT NULL,
  `price` float(10,2) DEFAULT NULL,
  `recommanded_price` float(10,2) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `skin` int(11) DEFAULT NULL,
  `dumb_item` int(11) DEFAULT NULL,
  `has_StatTrak` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sell_order_id_UNIQUE` (`id`),
  KEY `fk_state_idx` (`item_state`),
  KEY `fk_skin_idx` (`skin`),
  CONSTRAINT `fk_item_state` FOREIGN KEY (`item_state`) REFERENCES `skin_state` (`id`),
  CONSTRAINT `fk_skin` FOREIGN KEY (`skin`) REFERENCES `skin` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skin_sell_order`
--

LOCK TABLES `skin_sell_order` WRITE;
/*!40000 ALTER TABLE `skin_sell_order` DISABLE KEYS */;
INSERT INTO `skin_sell_order` VALUES ('NULL_SKIN_SELL_ORDER',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL);
/*!40000 ALTER TABLE `skin_sell_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skin_set`
--

DROP TABLE IF EXISTS `skin_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skin_set` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skin_set`
--

LOCK TABLES `skin_set` WRITE;
/*!40000 ALTER TABLE `skin_set` DISABLE KEYS */;
INSERT INTO `skin_set` VALUES (1,'NULL_SKIN_SET'),(2,'The Dust Collection'),(3,'NULL_SKINSET'),(4,'The Shattered Web Collection'),(5,'The Falchion Collection'),(6,'The Shadow Collection'),(7,'The Breakout Collection'),(8,'The Spectrum Collection'),(9,'The Prisma Collection'),(10,'The Gods and Monsters Collection'),(11,'The Bravo Collection'),(12,'The Winter Offensive Collection'),(13,'The Glove Collection'),(14,'The Wildfire Collection'),(15,'The Gamma Collection'),(16,'The eSports 2013 Collection'),(17,'The Danger Zone Collection'),(18,'The Gamma 2 Collection'),(19,'The Horizon Collection'),(20,'The Assault Collection'),(21,'The St. Marc Collection'),(22,'The Canals Collection'),(23,'The Huntsman Collection'),(24,'The eSports 2014 Summer Collection'),(25,'The Phoenix Collection'),(26,'The Clutch Collection'),(27,'The Spectrum 2 Collection'),(28,'The Revolver Case Collection'),(29,'The Arms Deal Collection'),(30,'The Norse Collection'),(31,'The Chroma Collection'),(32,'The Cobblestone Collection'),(33,'The Arms Deal 2 Collection'),(34,'The Vertigo Collection'),(35,'The CS20 Collection'),(36,'The X-Ray Collection'),(37,'The Prisma 2 Collection'),(38,'The Chroma 3 Collection'),(39,'The eSports 2013 Winter Collection'),(40,'The Rising Sun Collection'),(41,'The Operation Hydra Collection'),(42,'The 2018 Inferno Collection'),(43,'The Chroma 2 Collection'),(44,'The Vanguard Collection'),(45,'The Dust 2 Collection'),(46,'The Overpass Collection');
/*!40000 ALTER TABLE `skin_set` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skin_state`
--

DROP TABLE IF EXISTS `skin_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skin_state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skin_state`
--

LOCK TABLES `skin_state` WRITE;
/*!40000 ALTER TABLE `skin_state` DISABLE KEYS */;
INSERT INTO `skin_state` VALUES (0,'UNKONWN'),(1,'Battle-Scarred'),(2,'Well-Worn'),(3,'Field-Tested'),(4,'Minimal-Wear'),(5,'Factory-New');
/*!40000 ALTER TABLE `skin_state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weapon`
--

DROP TABLE IF EXISTS `weapon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weapon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_weapon_type_idx` (`type`),
  CONSTRAINT `fk_weapon_type` FOREIGN KEY (`type`) REFERENCES `weapon_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weapon`
--

LOCK TABLES `weapon` WRITE;
/*!40000 ALTER TABLE `weapon` DISABLE KEYS */;
INSERT INTO `weapon` VALUES (1,'NULL_WEAPON',NULL),(2,'Desert Eagle',2),(3,'Karambit',1),(4,'AWP',5),(5,'AK-47',4),(6,'M9 Bayonet',1),(7,'USP-S',2),(8,'P90',3),(9,'M4A4',4),(10,'Talon Knife',1),(11,'Bayonet',1),(12,'Flip Knife',1),(13,'Skeleton Knife',1),(14,'Gut Knife',1),(15,'Ursus Knife',1),(16,'Falchion Knife',1),(17,'SSG 08',5),(18,'Bowie Knife',1),(19,'Glock-18',2),(20,'Navaja Knife',1),(21,'Shadow Daggers',1),(22,'Huntsman Knife',1),(23,'Stiletto Knife',1),(24,'P250',2),(25,'Butterfly Knife',1),(26,'Nomad Knife',1),(27,'M4A1-S',4),(28,'Survival Knife',1),(29,'AUG',4),(30,'MAC-10',3),(31,'Nova',6),(32,'PP-Bizon',3),(33,'MP9',3),(34,'G3SG1',5),(35,'Five-SeveN',2),(36,'P2000',2),(37,'XM1014',6),(38,'SG 553',4),(39,'R8 Revolver',2),(40,'FAMAS',4),(41,'Galil AR',4),(42,'Tec-9',2),(43,'Dual Berettas',2),(44,'MAG-7',6),(45,'UMP-45',3);
/*!40000 ALTER TABLE `weapon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weapon_type`
--

DROP TABLE IF EXISTS `weapon_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weapon_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weapon_type`
--

LOCK TABLES `weapon_type` WRITE;
/*!40000 ALTER TABLE `weapon_type` DISABLE KEYS */;
INSERT INTO `weapon_type` VALUES (0,'Unknown'),(1,'Knife'),(2,'Pistol'),(3,'SMG'),(4,'Rifle'),(5,'Sniper Rifle'),(6,'Shotgun'),(7,'Machinegun');
/*!40000 ALTER TABLE `weapon_type` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-08 16:41:49

-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: bitskins_csgo
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
) ENGINE=InnoDB AUTO_INCREMENT=300 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dumb_item`
--

LOCK TABLES `dumb_item` WRITE;
/*!40000 ALTER TABLE `dumb_item` DISABLE KEYS */;
INSERT INTO `dumb_item` VALUES (1,'Howl Pin',NULL),(2,'Brigadier General Pin',NULL),(3,'Sealed Graffiti | Heart (Princess Pink)',NULL),(4,'StatTrak™ Swap Tool',NULL),(5,'Operation Hydra Case Key',NULL),(6,'Patch | Hydra',NULL),(7,'CS20 Case Key',NULL),(8,'Clutch Case Key',NULL),(9,'Danger Zone Case Key',NULL),(10,'Sealed Graffiti | Gambit | Krakow 2017',NULL),(11,'Huntsman Case Key',NULL),(12,'Sealed Graffiti | Heart (Blood Red)',NULL),(13,'Sealed Graffiti | Heart (Brick Red)',NULL),(14,'Sealed Graffiti | Rly (Dust Brown)',NULL),(15,'Sealed Graffiti | Sheriff (Jungle Green)',NULL),(16,'Sealed Graffiti | Sheriff (Battle Green)',NULL),(17,'Sealed Graffiti | Heart (Tracer Yellow)',NULL),(18,'Combine Helmet Pin',NULL),(19,'Canals Pin',NULL),(20,'Chroma Case Key',NULL),(21,'Tactics Pin',NULL),(22,'Patch | Shattered Web',NULL),(23,'Sealed Graffiti | Broken Heart (Blood Red)',NULL),(24,'Sealed Graffiti | Virtus.Pro | London 2018',NULL),(25,'Headcrab Glyph Pin',NULL),(26,'Sealed Graffiti | Smarmy (Cash Green)',NULL),(27,'Copper Lambda Pin',NULL),(28,'Sustenance! Pin',NULL),(29,'Death Sentence Pin',NULL),(30,'Cache Pin',NULL),(31,'Alyx Pin',NULL),(32,'Inferno Pin',NULL),(33,'Name Tag',NULL),(34,'Inferno 2 Pin',NULL),(35,'Sealed Graffiti | King Me (Desert Amber)',NULL),(36,'Sealed Graffiti | Ninjas in Pyjamas | London ',NULL),(37,'Sealed Graffiti | Astralis | London 2018',NULL),(38,'Sealed Graffiti | Natus Vincere | London 2018',NULL),(39,'Bloodhound Pin',NULL),(40,'Sealed Graffiti | Little Bock (War Pig Pink)',NULL),(41,'Sealed Graffiti | BOOM (Blood Red)',NULL),(42,'Sealed Graffiti | Flickshot',NULL),(43,'Hydra Pin',NULL),(44,'Sealed Graffiti | Crown',NULL),(45,'Sealed Graffiti | Clutch King',NULL),(46,'Sealed Graffiti | Easy Peasy',NULL),(47,'Patch | Payback',NULL),(48,'Sealed Graffiti | Sorry (Blood Red)',NULL),(49,'Chroma 3 Case Key',NULL),(50,'Bravo Pin',NULL),(51,'Sealed Graffiti | Shining Star (Monster Purpl',NULL),(52,'Sealed Graffiti | Heart (War Pig Pink)',NULL),(53,'Patch | Vigilance',NULL),(54,'Guardian 3 Pin',NULL),(55,'Overpass Pin',NULL),(56,'Nuke Pin',NULL),(57,'Patch | Wildfire',NULL),(58,'Sealed Graffiti | Goofy (Blood Red)',NULL),(59,'Gamma 2 Case Key',NULL),(60,'Aces High Pin',NULL),(61,'Patch | Crazy Banana',NULL),(62,'Valeria Phoenix Pin',NULL),(63,'Sealed Graffiti | Smarmy (Tiger Orange)',NULL),(64,'Sealed Graffiti | Smarmy (Shark White)',NULL),(65,'Sealed Graffiti | Little Bock (Princess Pink)',NULL),(66,'Sealed Graffiti | Shining Star (Blood Red)',NULL),(67,'Sealed Graffiti | 200 IQ (Princess Pink)',NULL),(68,'Sealed Graffiti | Shining Star (Princess Pink',NULL),(69,'Sealed Graffiti | Applause (Bazooka Pink)',NULL),(70,'Sealed Graffiti | Smarmy (Tracer Yellow)',NULL),(71,'Sealed Graffiti | BEEP (Frog Green)',NULL),(72,'Italy Pin',NULL),(73,'Prisma Case Key',NULL),(74,'Operation Shattered Web Premium Pass',NULL),(75,'Cobblestone Pin',NULL),(76,'Sealed Graffiti | Happy Cat (Violent Violet)',NULL),(77,'Sealed Graffiti | Goofy (War Pig Pink)',NULL),(78,'Sealed Graffiti | Lightbulb (Shark White)',NULL),(79,'Sealed Graffiti | Oops (Battle Green)',NULL),(80,'Sealed Graffiti | Chef Kiss (Desert Amber)',NULL),(81,'Sealed Graffiti | Uh Oh (Battle Green)',NULL),(82,'Sealed Graffiti | Chef Kiss (Tiger Orange)',NULL),(83,'Sealed Graffiti | Question Mark (Princess Pin',NULL),(84,'Sealed Graffiti | Little Bock (Wire Blue)',NULL),(85,'Sealed Graffiti | Uh Oh (Monster Purple)',NULL),(86,'Sealed Graffiti | Bock Bock (Monarch Blue)',NULL),(87,'Sealed Graffiti | Okay (Princess Pink)',NULL),(88,'Sealed Graffiti | Grimace (Monarch Blue)',NULL),(89,'Sealed Graffiti | Denied (Frog Green)',NULL),(90,'Sealed Graffiti | Little Crown (Monster Purpl',NULL),(91,'Sealed Graffiti | Denied (Wire Blue)',NULL),(92,'Sealed Graffiti | Bock Bock (Dust Brown)',NULL),(93,'Sealed Graffiti | Broken Heart (Brick Red)',NULL),(94,'Sealed Graffiti | Dizzy (Cash Green)',NULL),(95,'Sealed Graffiti | BEEP (Brick Red)',NULL),(96,'Sealed Graffiti | Smooch (War Pig Pink)',NULL),(97,'Sealed Graffiti | Denied (Princess Pink)',NULL),(98,'Sealed Graffiti | Bock Bock (Violent Violet)',NULL),(99,'Sealed Graffiti | Uh Oh (War Pig Pink)',NULL),(100,'Sealed Graffiti | BEEP (Dust Brown)',NULL),(101,'Lambda Pin',NULL),(102,'Health Pin',NULL),(103,'Sealed Graffiti | Hop (Tracer Yellow)',NULL),(104,'Sealed Graffiti | Hop (Desert Amber)',NULL),(105,'Sealed Graffiti | Little Crown (Blood Red)',NULL),(106,'Patch | Easy Peasy',NULL),(107,'Sealed Graffiti | Little Bock (Monster Purple',NULL),(108,'Sealed Graffiti | Okay (Monarch Blue)',NULL),(109,'Operation Breakout Case Key',NULL),(110,'Operation Phoenix Case Key',NULL),(111,'Glove Case Key',NULL),(112,'Operation Wildfire Case Key',NULL),(113,'Spectrum 2 Case Key',NULL),(114,'Patch | Sustenance!',NULL),(115,'Civil Protection Pin',NULL),(116,'Sealed Graffiti | Okay (Jungle Green)',NULL),(117,'Sealed Graffiti | Dizzy (Jungle Green)',NULL),(118,'Sealed Graffiti | Smirk (Cash Green)',NULL),(119,'Sealed Graffiti | Uh Oh (Jungle Green)',NULL),(120,'Sealed Graffiti | Silver Bullet (Jungle Green',NULL),(121,'Sealed Graffiti | Little EZ (Desert Amber)',NULL),(122,'Sealed Graffiti | NT (Cash Green)',NULL),(123,'Sealed Graffiti | BOOM (Monarch Blue)',NULL),(124,'Sealed Graffiti | Oops (Desert Amber)',NULL),(125,'Easy Peasy Pin',NULL),(126,'Sealed Graffiti | Question Mark (Frog Green)',NULL),(127,'Sealed Graffiti | Little Crown (Cash Green)',NULL),(128,'Sealed Graffiti | Dizzy (Battle Green)',NULL),(129,'Sealed Graffiti | NT (Desert Amber)',NULL),(130,'Sealed Graffiti | 1G (Dust Brown)',NULL),(131,'Sealed Graffiti | BOOM (Frog Green)',NULL),(132,'Sealed Graffiti | Little Bock (Tracer Yellow)',NULL),(133,'Sealed Graffiti | Hop (Monarch Blue)',NULL),(134,'Sealed Graffiti | Hop (Shark White)',NULL),(135,'Sealed Graffiti | Hop (Monster Purple)',NULL),(136,'Sealed Graffiti | Rly (Princess Pink)',NULL),(137,'Sealed Graffiti | Choke (Violent Violet)',NULL),(138,'Sealed Graffiti | Little Bock (Bazooka Pink)',NULL),(139,'Sealed Graffiti | Choke (Monarch Blue)',NULL),(140,'Sealed Graffiti | Broken Heart (War Pig Pink)',NULL),(141,'Sealed Graffiti | King Me (Tracer Yellow)',NULL),(142,'Sealed Graffiti | Little EZ (Brick Red)',NULL),(143,'Sealed Graffiti | Okay (Monster Purple)',NULL),(144,'Sealed Graffiti | Little Bock (Cash Green)',NULL),(145,'Sealed Graffiti | Bock Bock (Jungle Green)',NULL),(146,'Phoenix Pin',NULL),(147,'Patch | The Boss',NULL),(148,'Sealed Graffiti | Puke (Dust Brown)',NULL),(149,'Sealed Graffiti | Little Bock (Dust Brown)',NULL),(150,'Sealed Graffiti | Choke (Princess Pink)',NULL),(151,'Sealed Graffiti | 200 IQ (Jungle Green)',NULL),(152,'Sealed Graffiti | BEEP (Bazooka Pink)',NULL),(153,'Sealed Graffiti | Denied (Bazooka Pink)',NULL),(154,'Sealed Graffiti | Broken Heart (Monster Purpl',NULL),(155,'Sealed Graffiti | Lightbulb (Tracer Yellow)',NULL),(156,'Sealed Graffiti | Nezha',NULL),(157,'Sealed Graffiti | Flipsid3 Tactics | Boston 2',NULL),(158,'Sealed Graffiti | Pixiu',NULL),(159,'Patch | Phoenix',NULL),(160,'Patch | Bloodhound',NULL),(161,'Patch | Vortigaunt',NULL),(162,'Sealed Graffiti | Chef Kiss (Shark White)',NULL),(163,'Sealed Graffiti | Dizzy (Blood Red)',NULL),(164,'Sealed Graffiti | Fart (Shark White)',NULL),(165,'Sealed Graffiti | Silver Bullet (Princess Pin',NULL),(166,'Sealed Graffiti | Smirk (Monarch Blue)',NULL),(167,'Sealed Graffiti | Team Liquid | Atlanta 2017',NULL),(168,'Sealed Graffiti | Heart (Monster Purple)',NULL),(169,'Patch | Danger Zone',NULL),(170,'Patch | Welcome to the Clutch',NULL),(171,'Welcome to the Clutch Pin',NULL),(172,'Sealed Graffiti | PGL | Krakow 2017',NULL),(173,'Patch | CMB',NULL),(174,'Patch | Lambda',NULL),(175,'Guardian 2 Pin',NULL),(176,'Sealed Graffiti | Terror Rice',NULL),(177,'Sealed Graffiti | Shaolin',NULL),(178,'Patch | Breakout',NULL),(179,'Baggage Pin',NULL),(180,'Victory Pin',NULL),(181,'Patch | Howl',NULL),(182,'Sealed Graffiti | Rly (Blood Red)',NULL),(183,'Sealed Graffiti | OMG (Blood Red)',NULL),(184,'Sealed Graffiti | Puke (Blood Red)',NULL),(185,'Sealed Graffiti | Hop (Violent Violet)',NULL),(186,'Sealed Graffiti | Kiss (Brick Red)',NULL),(187,'Sealed Graffiti | Broken Heart (Dust Brown)',NULL),(188,'Sealed Graffiti | Rly (Cash Green)',NULL),(189,'Sealed Graffiti | Denied (Monarch Blue)',NULL),(190,'Berlin 2019 Viewer Pass',NULL),(191,'Sealed Graffiti | Nice Shot',NULL),(192,'Sealed Graffiti | mousesports | London 2018',NULL),(193,'Sealed Graffiti | North | London 2018',NULL),(194,'Winter Offensive Case Key',NULL),(195,'Sealed Graffiti | Bock Bock (Brick Red)',NULL),(196,'Sealed Graffiti | Howling Dawn',NULL),(197,'Sealed Graffiti | Smirk (Tracer Yellow)',NULL),(198,'Sealed Graffiti | Broken Heart (Tiger Orange)',NULL),(199,'Sealed Graffiti | Flipsid3 Tactics | Krakow 2',NULL),(200,'Sealed Graffiti | Tombstone (Shark White)',NULL),(201,'Sealed Graffiti | Ninja (Monster Purple)',NULL),(202,'Sealed Graffiti | Tombstone (Blood Red)',NULL),(203,'Sealed Graffiti | Fart (Desert Amber)',NULL),(204,'Sealed Graffiti | Bock Bock (Monster Purple)',NULL),(205,'Sealed Graffiti | Grimace (Monster Purple)',NULL),(206,'Sealed Graffiti | Smooch (Brick Red)',NULL),(207,'Sealed Graffiti | Welcome to the Clutch',NULL),(208,'Sealed Graffiti | BIG | Krakow 2017',NULL),(209,'Chroma Pin',NULL),(210,'Sealed Graffiti | Unicorn',NULL),(211,'Sealed Graffiti | GODSENT | Atlanta 2017',NULL),(212,'Vortigaunt Pin',NULL),(213,'City 17 Pin',NULL),(214,'Sealed Graffiti | Vega Squadron | Krakow 2017',NULL),(215,'Sealed Graffiti | PENTA Sports | Krakow 2017',NULL),(216,'Sealed Graffiti | Cloud9 | Krakow 2017',NULL),(217,'Sealed Graffiti | mousesports | Krakow 2017',NULL),(218,'Sealed Graffiti | North | Krakow 2017',NULL),(219,'Sealed Graffiti | Natus Vincere | Krakow 2017',NULL),(220,'Sealed Graffiti | SK Gaming | Krakow 2017',NULL),(221,'Sealed Graffiti | Fnatic | Krakow 2017',NULL),(222,'Sealed Graffiti | Virtus.Pro | Krakow 2017',NULL),(223,'Sealed Graffiti | Astralis | Krakow 2017',NULL),(224,'Sealed Graffiti | Shave Master',NULL),(225,'Sealed Graffiti | Hop (War Pig Pink)',NULL),(226,'Sealed Graffiti | BEEP (Monster Purple)',NULL),(227,'Sealed Graffiti | Oops (Bazooka Pink)',NULL),(228,'Sealed Graffiti | Rly (Tiger Orange)',NULL),(229,'Sealed Graffiti | Rly (Frog Green)',NULL),(230,'Sealed Graffiti | Silver Bullet (SWAT Blue)',NULL),(231,'Sealed Graffiti | Choke (Frog Green)',NULL),(232,'Sealed Graffiti | Goofy (Monster Purple)',NULL),(233,'Sealed Graffiti | Okay (Frog Green)',NULL),(234,'Sealed Graffiti | Thoughtfull (Blood Red)',NULL),(235,'Sealed Graffiti | Denied (Tiger Orange)',NULL),(236,'Sealed Graffiti | Little EZ (Shark White)',NULL),(237,'Sealed Graffiti | Smirk (Monster Purple)',NULL),(238,'Sealed Graffiti | Okay (Battle Green)',NULL),(239,'Sealed Graffiti | Dead Now (Brick Red)',NULL),(240,'Sealed Graffiti | Bock Bock (War Pig Pink)',NULL),(241,'Sealed Graffiti | NT (Violent Violet)',NULL),(242,'Sealed Graffiti | Bock Bock (Princess Pink)',NULL),(243,'Sealed Graffiti | Smirk (Tiger Orange)',NULL),(244,'Sealed Graffiti | Puke (Violent Violet)',NULL),(245,'Sealed Graffiti | Chef Kiss (Blood Red)',NULL),(246,'Sealed Graffiti | Okay (Dust Brown)',NULL),(247,'Sealed Graffiti | Broken Heart (SWAT Blue)',NULL),(248,'Sealed Graffiti | Question Mark (War Pig Pink',NULL),(249,'Sealed Graffiti | Silver Bullet (Frog Green)',NULL),(250,'Sealed Graffiti | Fart (SWAT Blue)',NULL),(251,'Sealed Graffiti | Hop (Cash Green)',NULL),(252,'Sealed Graffiti | Uh Oh (Brick Red)',NULL),(253,'Sealed Graffiti | Thoughtfull (Shark White)',NULL),(254,'Sealed Graffiti | God of Fortune',NULL),(255,'Guardian Pin',NULL),(256,'Sealed Graffiti | Smarmy (Princess Pink)',NULL),(257,'Sealed Graffiti | Goofy (Battle Green)',NULL),(258,'Sealed Graffiti | Smooch (Tiger Orange)',NULL),(259,'Sealed Graffiti | Kiss (Frog Green)',NULL),(260,'Sealed Graffiti | Rly (Bazooka Pink)',NULL),(261,'Sealed Graffiti | Little Crown (Bazooka Pink)',NULL),(262,'Sealed Graffiti | Goofy (Violent Violet)',NULL),(263,'Sealed Graffiti | Uh Oh (Dust Brown)',NULL),(264,'Wildfire Pin',NULL),(265,'Sealed Graffiti | Smarmy (SWAT Blue)',NULL),(266,'Sealed Graffiti | BOOM (SWAT Blue)',NULL),(267,'Sealed Graffiti | Dead Now (Blood Red)',NULL),(268,'Sealed Graffiti | Hop (Brick Red)',NULL),(269,'Gift Package',NULL),(270,'Black Mesa Pin',NULL),(271,'Mirage Pin',NULL),(272,'CS:GO Case Key',NULL),(273,'Revolver Case Key',NULL),(274,'Sealed Graffiti | Puke (Shark White)',NULL),(275,'Sealed Graffiti | Grimace (Battle Green)',NULL),(276,'Sealed Graffiti | Goofy (Tracer Yellow)',NULL),(277,'Sealed Graffiti | Bock Bock (Tracer Yellow)',NULL),(278,'Horizon Case Key',NULL),(279,'Sealed Graffiti | Smirk (Desert Amber)',NULL),(280,'Sealed Graffiti | Question Mark (Shark White)',NULL),(281,'Sealed Graffiti | Shining Star (Monarch Blue)',NULL),(282,'CMB Pin',NULL),(283,'eSports Key',NULL),(284,'Gamma Case Key',NULL),(285,'Sealed Graffiti | Oops (Blood Red)',NULL),(286,'Sealed Graffiti | Hop (Blood Red)',NULL),(287,'Sealed Graffiti | Ninjas in Pyjamas | London ',NULL),(288,'Sealed Graffiti | Shining Star (Monster Purpl',NULL),(289,'Sealed Graffiti | Shining Star (Princess Pink',NULL),(290,'Sealed Graffiti | Question Mark (Princess Pin',NULL),(291,'Sealed Graffiti | Little Crown (Monster Purpl',NULL),(292,'Sealed Graffiti | Little Bock (Monster Purple',NULL),(293,'Sealed Graffiti | Silver Bullet (Jungle Green',NULL),(294,'Sealed Graffiti | Broken Heart (Monster Purpl',NULL),(295,'Sealed Graffiti | Flipsid3 Tactics | Boston 2',NULL),(296,'Sealed Graffiti | Silver Bullet (Princess Pin',NULL),(297,'Sealed Graffiti | Flipsid3 Tactics | Krakow 2',NULL),(298,'Sealed Graffiti | Question Mark (War Pig Pink',NULL),(299,'Sealed Graffiti | Silver Bullet (Jungle Green',NULL);
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
  `has_StatTrak` tinyint(1) DEFAULT NULL,
  `weapon` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_skin_set_idx` (`skin_set`),
  KEY `fk_skin_rarity_idx` (`skin_rarity`),
  KEY `fk_weapon_category_idx` (`weapon`),
  CONSTRAINT `fk_skin_rarity` FOREIGN KEY (`skin_rarity`) REFERENCES `skin_rarity` (`id`),
  CONSTRAINT `fk_skin_set` FOREIGN KEY (`skin_set`) REFERENCES `skin_set` (`id`),
  CONSTRAINT `fk_weapon` FOREIGN KEY (`weapon`) REFERENCES `weapon` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skin`
--

LOCK TABLES `skin` WRITE;
/*!40000 ALTER TABLE `skin` DISABLE KEYS */;
INSERT INTO `skin` VALUES (1,'NULL_SKIN',NULL,NULL,NULL,NULL,NULL,NULL);
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
INSERT INTO `skin_sell_order` VALUES ('NULL_SKIN_SELL_ORDER',NULL,NULL,NULL,NULL,1,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skin_set`
--

LOCK TABLES `skin_set` WRITE;
/*!40000 ALTER TABLE `skin_set` DISABLE KEYS */;
INSERT INTO `skin_set` VALUES (1,'NULL_SKIN_SET');
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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weapon`
--

LOCK TABLES `weapon` WRITE;
/*!40000 ALTER TABLE `weapon` DISABLE KEYS */;
INSERT INTO `weapon` VALUES (1,'NULL_WEAPON',NULL),(2,'Desert Eagle',2),(3,'M4A4',4),(4,'CZ75-Auto',2),(5,'USP-S',2),(6,'Ursus Knife',1),(7,'M4A1-S',4),(8,'Dual Berettas',2),(9,'SSG 08',NULL),(10,'M9 Bayonet',NULL),(11,'AK-47',NULL),(12,'Butterfly Knife',NULL),(13,'Stiletto Knife',NULL),(14,'Glock-18',NULL),(15,'PP-Bizon',NULL),(16,'MP5-SD',NULL),(17,'P250',NULL),(18,'Nova',NULL),(19,'MAC-10',NULL),(20,'Negev',NULL),(21,'UMP-45',NULL),(22,'SCAR-20',NULL),(23,'R8 Revolver',NULL),(24,'MAG-7',NULL),(25,'AUG',NULL),(26,'P2000',NULL),(27,'G3SG1',NULL),(28,'FAMAS',NULL),(29,'Sawed-Off',NULL),(30,'Tec-9',NULL),(31,'MP9',NULL),(32,'AWP',NULL),(33,'Falchion Knife',NULL),(34,'SG 553',NULL),(35,'Survival Knife',NULL),(36,'Shadow Daggers',NULL),(37,'XM1014',NULL);
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

-- Dump completed on 2020-07-04 15:48:54

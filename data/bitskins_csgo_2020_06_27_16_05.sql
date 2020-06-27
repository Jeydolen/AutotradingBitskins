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
) ENGINE=InnoDB AUTO_INCREMENT=401 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dumb_item`
--

LOCK TABLES `dumb_item` WRITE;
/*!40000 ALTER TABLE `dumb_item` DISABLE KEYS */;
INSERT INTO `dumb_item` VALUES (1,'Howl Pin',NULL),(2,'Brigadier General Pin',NULL),(3,'Name Tag',NULL),(4,'Sealed Graffiti | BOOM (Battle Green)',NULL),(5,'Chroma 2 Case Key',NULL),(6,'Operation Hydra Case Key',NULL),(7,'Victory Pin',NULL),(8,'Sealed Graffiti | Smirk (Tracer Yellow)',NULL),(9,'Sealed Graffiti | OMG (Jungle Green)',NULL),(10,'Sealed Graffiti | Heart (War Pig Pink)',NULL),(11,'Sealed Graffiti | Little Bock (Bazooka Pink)',NULL),(12,'Sealed Graffiti | Broken Heart (Tiger Orange)',NULL),(13,'Sealed Graffiti | Heart (Tracer Yellow)',NULL),(14,'Sealed Graffiti | Howling Dawn',NULL),(15,'Chroma Case Key',NULL),(16,'Easy Peasy Pin',NULL),(17,'Health Pin',NULL),(18,'Sealed Graffiti | Heart (Blood Red)',NULL),(19,'Sealed Graffiti | Sheriff (Battle Green)',NULL),(20,'Train Pin',NULL),(21,'Patch | Easy Peasy',NULL),(22,'Guardian 3 Pin',NULL),(23,'Sealed Graffiti | Smooch (Brick Red)',NULL),(24,'Sealed Graffiti | Flipsid3 Tactics | Krakow 2',NULL),(25,'Death Sentence Pin',NULL),(26,'Sealed Graffiti | Tombstone (Shark White)',NULL),(27,'Sealed Graffiti | Ninja (Monster Purple)',NULL),(28,'Sealed Graffiti | Tombstone (Blood Red)',NULL),(29,'Falchion Case Key',NULL),(30,'Spectrum 2 Case Key',NULL),(31,'Sealed Graffiti | Fart (Desert Amber)',NULL),(32,'Sealed Graffiti | Bock Bock (Monster Purple)',NULL),(33,'Sealed Graffiti | Grimace (Monster Purple)',NULL),(34,'Sealed Graffiti | Choke (Blood Red)',NULL),(35,'Sealed Graffiti | Little Crown (Blood Red)',NULL),(36,'Sealed Graffiti | Rly (Brick Red)',NULL),(37,'City 17 Pin',NULL),(38,'Sealed Graffiti | Vega Squadron | Krakow 2017',NULL),(39,'Sealed Graffiti | PENTA Sports | Krakow 2017',NULL),(40,'Sealed Graffiti | Cloud9 | Krakow 2017',NULL),(41,'Sealed Graffiti | BIG | Krakow 2017',NULL),(42,'Sealed Graffiti | mousesports | Krakow 2017',NULL),(43,'Sealed Graffiti | North | Krakow 2017',NULL),(44,'Sealed Graffiti | Gambit | Krakow 2017',NULL),(45,'Sealed Graffiti | Natus Vincere | Krakow 2017',NULL),(46,'Sealed Graffiti | SK Gaming | Krakow 2017',NULL),(47,'Sealed Graffiti | Fnatic | Krakow 2017',NULL),(48,'Sealed Graffiti | Virtus.Pro | Krakow 2017',NULL),(49,'Sealed Graffiti | Astralis | Krakow 2017',NULL),(50,'Sealed Graffiti | Heart (Brick Red)',NULL),(51,'Guardian Pin',NULL),(52,'Bloodhound Pin',NULL),(53,'Guardian 2 Pin',NULL),(54,'Sealed Graffiti | Welcome to the Clutch',NULL),(55,'Chroma Pin',NULL),(56,'Tactics Pin',NULL),(57,'Bravo Pin',NULL),(58,'Lambda Pin',NULL),(59,'Sealed Graffiti | Unicorn',NULL),(60,'Sealed Graffiti | Astralis | Atlanta 2017',NULL),(61,'Sealed Graffiti | GODSENT | Atlanta 2017',NULL),(62,'Aces High Pin',NULL),(63,'Vortigaunt Pin',NULL),(64,'Sealed Graffiti | King Me (Desert Amber)',NULL),(65,'Sealed Graffiti | King Me (Tracer Yellow)',NULL),(66,'Sealed Graffiti | Shave Master',NULL),(67,'Berlin 2019 Viewer Pass',NULL),(68,'Huntsman Case Key',NULL),(69,'Inferno Pin',NULL),(70,'Sealed Graffiti | Rly (Dust Brown)',NULL),(71,'Sealed Graffiti | Hop (War Pig Pink)',NULL),(72,'Italy Pin',NULL),(73,'Sealed Graffiti | Uh Oh (Brick Red)',NULL),(74,'Sealed Graffiti | Thoughtfull (Shark White)',NULL),(75,'Sealed Graffiti | Terror Rice',NULL),(76,'Sealed Graffiti | Nezha',NULL),(77,'Sealed Graffiti | God of Fortune',NULL),(78,'Sealed Graffiti | Shaolin',NULL),(79,'Sealed Graffiti | BEEP (Monster Purple)',NULL),(80,'Sealed Graffiti | Oops (Bazooka Pink)',NULL),(81,'Sealed Graffiti | Goofy (Dust Brown)',NULL),(82,'Sealed Graffiti | Rly (Tiger Orange)',NULL),(83,'Sealed Graffiti | Applause (Brick Red)',NULL),(84,'Sealed Graffiti | Rly (Frog Green)',NULL),(85,'Sealed Graffiti | Silver Bullet (SWAT Blue)',NULL),(86,'Sealed Graffiti | Heart (Monster Purple)',NULL),(87,'Sealed Graffiti | Denied (Monster Purple)',NULL),(88,'Sealed Graffiti | BEEP (Desert Amber)',NULL),(89,'Sealed Graffiti | Choke (Frog Green)',NULL),(90,'Sealed Graffiti | Goofy (Monster Purple)',NULL),(91,'Sealed Graffiti | Okay (Frog Green)',NULL),(92,'Sealed Graffiti | Thoughtfull (Blood Red)',NULL),(93,'Sealed Graffiti | Denied (Tiger Orange)',NULL),(94,'Sealed Graffiti | Little Bock (War Pig Pink)',NULL),(95,'Sealed Graffiti | Little EZ (Shark White)',NULL),(96,'Sealed Graffiti | Smirk (Monster Purple)',NULL),(97,'Sealed Graffiti | Okay (Battle Green)',NULL),(98,'Sealed Graffiti | Dead Now (Bazooka Pink)',NULL),(99,'Sealed Graffiti | Bock Bock (Monarch Blue)',NULL),(100,'Sealed Graffiti | Dead Now (Brick Red)',NULL),(101,'Sealed Graffiti | Bock Bock (War Pig Pink)',NULL),(102,'Sealed Graffiti | NT (Violent Violet)',NULL),(103,'Sealed Graffiti | Lightbulb (Tracer Yellow)',NULL),(104,'Sealed Graffiti | Oops (Frog Green)',NULL),(105,'Sealed Graffiti | Bock Bock (Princess Pink)',NULL),(106,'Sealed Graffiti | Dead Now (Jungle Green)',NULL),(107,'Sealed Graffiti | Smirk (Tiger Orange)',NULL),(108,'Sealed Graffiti | Puke (Violent Violet)',NULL),(109,'Sealed Graffiti | Dead Now (Desert Amber)',NULL),(110,'Sealed Graffiti | Chef Kiss (Blood Red)',NULL),(111,'Sealed Graffiti | Okay (Dust Brown)',NULL),(112,'Sealed Graffiti | Broken Heart (SWAT Blue)',NULL),(113,'Sealed Graffiti | Question Mark (War Pig Pink',NULL),(114,'Sealed Graffiti | Silver Bullet (Frog Green)',NULL),(115,'Sealed Graffiti | Fart (SWAT Blue)',NULL),(116,'Sealed Graffiti | Hop (Cash Green)',NULL),(117,'Patch | Howl',NULL),(118,'Patch | The Boss',NULL),(119,'Patch | Hydra',NULL),(120,'Patch | Payback',NULL),(121,'Patch | Wildfire',NULL),(122,'Patch | Shattered Web',NULL),(123,'Patch | Breakout',NULL),(124,'StatTrak™ Swap Tool',NULL),(125,'Sealed Graffiti | Smarmy (Princess Pink)',NULL),(126,'Sealed Graffiti | Goofy (Battle Green)',NULL),(127,'Sealed Graffiti | Smooch (Tiger Orange)',NULL),(128,'Sealed Graffiti | Kiss (Frog Green)',NULL),(129,'Sealed Graffiti | Rly (Bazooka Pink)',NULL),(130,'Sealed Graffiti | Little Crown (Bazooka Pink)',NULL),(131,'Sealed Graffiti | Rly (Princess Pink)',NULL),(132,'Sealed Graffiti | Goofy (Violent Violet)',NULL),(133,'Sealed Graffiti | Uh Oh (Dust Brown)',NULL),(134,'Baggage Pin',NULL),(135,'Sealed Graffiti | HellRaisers | London 2018',NULL),(136,'Patch | Bravo',NULL),(137,'Welcome to the Clutch Pin',NULL),(138,'Wildfire Pin',NULL),(139,'Overpass Pin',NULL),(140,'Sealed Graffiti | Smarmy (SWAT Blue)',NULL),(141,'Sealed Graffiti | Heart (Princess Pink)',NULL),(142,'Operation Phoenix Case Key',NULL),(143,'Sealed Graffiti | Dead Now (Blood Red)',NULL),(144,'Sealed Graffiti | Hop (Brick Red)',NULL),(145,'Sealed Graffiti | BOOM (SWAT Blue)',NULL),(146,'Gamma 2 Case Key',NULL),(147,'Chroma 3 Case Key',NULL),(148,'Operation Wildfire Case Key',NULL),(149,'CS:GO Case Key',NULL),(150,'Revolver Case Key',NULL),(151,'Sealed Graffiti | Thoughtfull (Violent Violet',NULL),(152,'Mirage Pin',NULL),(153,'Nuke Pin',NULL),(154,'Sealed Graffiti | Oops (Battle Green)',NULL),(155,'Sealed Graffiti | BOOM (Blood Red)',NULL),(156,'Gift Package',NULL),(157,'Black Mesa Pin',NULL),(158,'Hydra Pin',NULL),(159,'Sealed Graffiti | Puke (Shark White)',NULL),(160,'Sealed Graffiti | Chef Kiss (Desert Amber)',NULL),(161,'Sealed Graffiti | Grimace (Battle Green)',NULL),(162,'Sealed Graffiti | Goofy (Tracer Yellow)',NULL),(163,'Sealed Graffiti | Bock Bock (Tracer Yellow)',NULL),(164,'Sealed Graffiti | Renegades | London 2018',NULL),(165,'Valeria Phoenix Pin',NULL),(166,'Cache Pin',NULL),(167,'Dust II Pin',NULL),(168,'Horizon Case Key',NULL),(169,'Sealed Graffiti | Clutch King',NULL),(170,'Sealed Graffiti | Smirk (Desert Amber)',NULL),(171,'Sealed Graffiti | Okay (Shark White)',NULL),(172,'Sealed Graffiti | Goofy (Tiger Orange)',NULL),(173,'Sealed Graffiti | Question Mark (Shark White)',NULL),(174,'Sealed Graffiti | Question Mark (Cash Green)',NULL),(175,'Sealed Graffiti | Applause (Dust Brown)',NULL),(176,'Sealed Graffiti | Dead Now (Monster Purple)',NULL),(177,'Sealed Graffiti | Shining Star (Monarch Blue)',NULL),(178,'Sealed Graffiti | Hop (Desert Amber)',NULL),(179,'Inferno 2 Pin',NULL),(180,'Sealed Graffiti | Little EZ (Violent Violet)',NULL),(181,'Sealed Graffiti | Okay (Princess Pink)',NULL),(182,'Sealed Graffiti | Oops (Blood Red)',NULL),(183,'Sealed Graffiti | Hop (Blood Red)',NULL),(184,'CMB Pin',NULL),(185,'Sealed Graffiti | 1G (Bazooka Pink)',NULL),(186,'Sealed Graffiti | Grimace (Monarch Blue)',NULL),(187,'eSports Key',NULL),(188,'Gamma Case Key',NULL),(189,'Sealed Graffiti | Space Soldiers | Boston 201',NULL),(190,'Sealed Graffiti | Bock Bock (Violent Violet)',NULL),(191,'Sealed Graffiti | Uh Oh (Princess Pink)',NULL),(192,'Sealed Graffiti | Grimace (Blood Red)',NULL),(193,'Sealed Graffiti | Smirk (Brick Red)',NULL),(194,'Sealed Graffiti | Smooch (Wire Blue)',NULL),(195,'Sealed Graffiti | Thoughtfull (Monster Purple',NULL),(196,'Patch | Vanguard',NULL),(197,'Patch | Welcome to the Clutch',NULL),(198,'Sealed Graffiti | Dizzy (Shark White)',NULL),(199,'Sealed Graffiti | Bock Bock (Tiger Orange)',NULL),(200,'Sealed Graffiti | Bock Bock (Jungle Green)',NULL),(201,'Sealed Graffiti | mousesports | London 2018',NULL),(202,'Sealed Graffiti | Lightbulb (Shark White)',NULL),(203,'Sealed Graffiti | Choke (SWAT Blue)',NULL),(204,'Sealed Graffiti | Silver Bullet (Wire Blue)',NULL),(205,'Canals Pin',NULL),(206,'Sealed Graffiti | Heart (Bazooka Pink)',NULL),(207,'Sealed Graffiti | Little EZ (Monarch Blue)',NULL),(208,'Sealed Graffiti | Virtus.Pro | Boston 2018',NULL),(209,'Sealed Graffiti | Fnatic | London 2018',NULL),(210,'Sealed Graffiti | ELEAGUE | Boston 2018',NULL),(211,'Sealed Graffiti | Gambit Esports | Boston 201',NULL),(212,'Sealed Graffiti | Astralis | Boston 2018',NULL),(213,'Sealed Graffiti | Flipsid3 Tactics | Boston 2',NULL),(214,'Sealed Graffiti | Sprout Esports | Boston 201',NULL),(215,'Sealed Graffiti | Team Liquid | Boston 2018',NULL),(216,'Sealed Graffiti | Team EnVyUs | Boston 2018',NULL),(217,'Sealed Graffiti | Quantum Bellator Fire | Bos',NULL),(218,'Sealed Graffiti | Team Spirit | London 2018',NULL),(219,'Sealed Graffiti | Team Liquid | London 2018',NULL),(220,'Sealed Graffiti | Astralis | London 2018',NULL),(221,'Sealed Graffiti | Cloud9 | Boston 2018',NULL),(222,'Sealed Graffiti | Natus Vincere | Boston 2018',NULL),(223,'Sealed Graffiti | G2 Esports | Boston 2018',NULL),(224,'Sealed Graffiti | OpTic Gaming | London 2018',NULL),(225,'Sealed Graffiti | compLexity Gaming | London ',NULL),(226,'Sealed Graffiti | Vega Squadron | London 2018',NULL),(227,'Sealed Graffiti | Vega Squadron | Boston 2018',NULL),(228,'Sealed Graffiti | BIG | Boston 2018',NULL),(229,'Sealed Graffiti | SK Gaming | Boston 2018',NULL),(230,'Sealed Graffiti | Fart (Tiger Orange)',NULL),(231,'Sealed Graffiti | Virtus.Pro | London 2018',NULL),(232,'Sealed Graffiti | Flash Gaming | Boston 2018',NULL),(233,'Sealed Graffiti | Renegades | Boston 2018',NULL),(234,'Sealed Graffiti | Avangar | Boston 2018',NULL),(235,'Sealed Graffiti | mousesports | Boston 2018',NULL),(236,'Sealed Graffiti | Cloud9 | London 2018',NULL),(237,'Sealed Graffiti | Fnatic | Boston 2018',NULL),(238,'Sealed Graffiti | Nice Shot',NULL),(239,'Sealed Graffiti | Natus Vincere | London 2018',NULL),(240,'Sealed Graffiti | OpTic Gaming | Atlanta 2017',NULL),(241,'Sealed Graffiti | Dead Now (War Pig Pink)',NULL),(242,'Sealed Graffiti | Smarmy (Frog Green)',NULL),(243,'Sealed Graffiti | 200 IQ (Monster Purple)',NULL),(244,'Guardian Elite Pin',NULL),(245,'Patch | Phoenix',NULL),(246,'Sealed Graffiti | Happy Cat (Bazooka Pink)',NULL),(247,'Sealed Graffiti | NT (Dust Brown)',NULL),(248,'Sealed Graffiti | Fart (Monster Purple)',NULL),(249,'Sealed Graffiti | Applause (War Pig Pink)',NULL),(250,'Sealed Graffiti | Puke (Princess Pink)',NULL),(251,'Sealed Graffiti | BEEP (Tiger Orange)',NULL),(252,'Sealed Graffiti | BEEP (Monarch Blue)',NULL),(253,'Sealed Graffiti | Bock Bock (Frog Green)',NULL),(254,'Operation Shattered Web Premium Pass',NULL),(255,'CS20 Case Key',NULL),(256,'Sealed Graffiti | Dizzy (Jungle Green)',NULL),(257,'Sealed Graffiti | Fart (Monarch Blue)',NULL),(258,'Sealed Graffiti | 1G (Wire Blue)',NULL),(259,'Sealed Graffiti | Kiss (Princess Pink)',NULL),(260,'Sealed Graffiti | Dizzy (Violent Violet)',NULL),(261,'Sealed Graffiti | Oops (Brick Red)',NULL),(262,'Sealed Graffiti | Grimace (Jungle Green)',NULL),(263,'Sealed Graffiti | Smooch (War Pig Pink)',NULL),(264,'Sealed Graffiti | Fart (Tracer Yellow)',NULL),(265,'Sealed Graffiti | Happy Cat (SWAT Blue)',NULL),(266,'Sealed Graffiti | Denied (Shark White)',NULL),(267,'Sealed Graffiti | Thoughtfull (Tracer Yellow)',NULL),(268,'Alyx Pin',NULL),(269,'Sealed Graffiti | Dizzy (Frog Green)',NULL),(270,'Sealed Graffiti | Thoughtfull (Frog Green)',NULL),(271,'Sealed Graffiti | Sorry (Blood Red)',NULL),(272,'Sealed Graffiti | Smooch (Jungle Green)',NULL),(273,'Sealed Graffiti | Shooting Star Return',NULL),(274,'Katowice 2019 Viewer Pass',NULL),(275,'Winter Offensive Case Key',NULL),(276,'Operation Breakout Case Key',NULL),(277,'Sealed Graffiti | Oops (Monarch Blue)',NULL),(278,'Sealed Graffiti | Crown',NULL),(279,'Sealed Graffiti | Skull n\' Crosshairs',NULL),(280,'Sealed Graffiti | Ace',NULL),(281,'Sealed Graffiti | Easy Peasy',NULL),(282,'Sealed Graffiti | Dead Now (Shark White)',NULL),(283,'Sealed Graffiti | Fart (Blood Red)',NULL),(284,'Sealed Graffiti | Water Gun',NULL),(285,'Sealed Graffiti | Rly (Blood Red)',NULL),(286,'Sealed Graffiti | Smirk (Blood Red)',NULL),(287,'Sealed Graffiti | Kiss (Shark White)',NULL),(288,'Sealed Graffiti | Broken Heart (Blood Red)',NULL),(289,'Sealed Graffiti | Kiss (SWAT Blue)',NULL),(290,'Sealed Graffiti | Broken Heart (Shark White)',NULL),(291,'Sealed Graffiti | Martha',NULL),(292,'Sealed Graffiti | Hop (Tiger Orange)',NULL),(293,'Sealed Graffiti | Smarmy (Monster Purple)',NULL),(294,'Sealed Graffiti | Puke (Blood Red)',NULL),(295,'Sealed Graffiti | Smarmy (Bazooka Pink)',NULL),(296,'Patch | Bloodhound',NULL),(297,'Sealed Graffiti | Broken Heart (War Pig Pink)',NULL),(298,'Sealed Graffiti | Fart (Princess Pink)',NULL),(299,'Sealed Graffiti | Hop (Frog Green)',NULL),(300,'Sealed Graffiti | Chef Kiss (Violent Violet)',NULL),(301,'Sealed Graffiti | OMG (Cash Green)',NULL),(302,'Sealed Graffiti | NT (War Pig Pink)',NULL),(303,'Sealed Graffiti | Dizzy (Tiger Orange)',NULL),(304,'Sealed Graffiti | Chef Kiss (Monarch Blue)',NULL),(305,'Sealed Graffiti | Smarmy (Dust Brown)',NULL),(306,'Sealed Graffiti | Applause (Shark White)',NULL),(307,'Sealed Graffiti | Denied (Bazooka Pink)',NULL),(308,'Sealed Graffiti | Goofy (Frog Green)',NULL),(309,'Sealed Graffiti | Choke (Cash Green)',NULL),(310,'Sealed Graffiti | 200 IQ (Frog Green)',NULL),(311,'Sealed Graffiti | Smarmy (Violent Violet)',NULL),(312,'Sealed Graffiti | Rly (War Pig Pink)',NULL),(313,'Sealed Graffiti | Thoughtfull (Princess Pink)',NULL),(314,'Sealed Graffiti | Hop (Monster Purple)',NULL),(315,'Sealed Graffiti | Shining Star (SWAT Blue)',NULL),(316,'Sealed Graffiti | NT (Desert Amber)',NULL),(317,'Sealed Graffiti | Bock Bock (Desert Amber)',NULL),(318,'Sealed Graffiti | Chef Kiss (Cash Green)',NULL),(319,'Sealed Graffiti | Choke (Monarch Blue)',NULL),(320,'Sealed Graffiti | Uh Oh (Monarch Blue)',NULL),(321,'Sealed Graffiti | Broken Heart (Frog Green)',NULL),(322,'Sealed Graffiti | Dizzy (Monarch Blue)',NULL),(323,'Sealed Graffiti | Uh Oh (SWAT Blue)',NULL),(324,'Sealed Graffiti | Uh Oh (Blood Red)',NULL),(325,'Sealed Graffiti | Little Crown (Wire Blue)',NULL),(326,'Sealed Graffiti | OMG (Princess Pink)',NULL),(327,'Sealed Graffiti | Smooch (Monster Purple)',NULL),(328,'Operation Vanguard Case Key',NULL),(329,'Shadow Case Key',NULL),(330,'Prisma Case Key',NULL),(331,'Danger Zone Case Key',NULL),(332,'Spectrum Case Key',NULL),(333,'Sealed Graffiti | Happy Cat (Brick Red)',NULL),(334,'Sealed Graffiti | Dizzy (Desert Amber)',NULL),(335,'Sealed Graffiti | Applause (Wire Blue)',NULL),(336,'Sealed Graffiti | 1G (Brick Red)',NULL),(337,'Sealed Graffiti | Dizzy (Cash Green)',NULL),(338,'Sealed Graffiti | BEEP (SWAT Blue)',NULL),(339,'Sealed Graffiti | Choke (Jungle Green)',NULL),(340,'Sealed Graffiti | Grimace (Bazooka Pink)',NULL),(341,'Sealed Graffiti | Uh Oh (Shark White)',NULL),(342,'Sealed Graffiti | Little Crown (Monarch Blue)',NULL),(343,'Sealed Graffiti | Fart (Violent Violet)',NULL),(344,'Sealed Graffiti | Silver Bullet (Cash Green)',NULL),(345,'Sealed Graffiti | Smooch (Blood Red)',NULL),(346,'Sealed Graffiti | Chef Kiss (Brick Red)',NULL),(347,'Sealed Graffiti | Little EZ (Desert Amber)',NULL),(348,'Sealed Graffiti | BEEP (War Pig Pink)',NULL),(349,'Sealed Graffiti | Smooch (Frog Green)',NULL),(350,'Sealed Graffiti | NT (Monster Purple)',NULL),(351,'Sealed Graffiti | Little Crown (Battle Green)',NULL),(352,'Sealed Graffiti | Uh Oh (Bazooka Pink)',NULL),(353,'Sealed Graffiti | Question Mark (Jungle Green',NULL),(354,'Sealed Graffiti | Denied (Monarch Blue)',NULL),(355,'Sealed Graffiti | BEEP (Princess Pink)',NULL),(356,'Sealed Graffiti | Okay (Monarch Blue)',NULL),(357,'Sealed Graffiti | Little EZ (Tiger Orange)',NULL),(358,'Sealed Graffiti | Choke (Tiger Orange)',NULL),(359,'Sealed Graffiti | Little EZ (Princess Pink)',NULL),(360,'Sealed Graffiti | Shining Star (Violent Viole',NULL),(361,'Sealed Graffiti | Choke (Violent Violet)',NULL),(362,'Sealed Graffiti | Smirk (Frog Green)',NULL),(363,'Sealed Graffiti | Hop (Princess Pink)',NULL),(364,'Sealed Graffiti | Denied (Battle Green)',NULL),(365,'Sealed Graffiti | Cerberus',NULL),(366,'Sealed Graffiti | Dizzy (Princess Pink)',NULL),(367,'Sealed Graffiti | Ninjas in Pyjamas | London ',NULL),(368,'Sealed Graffiti | North | London 2018',NULL),(369,'Sealed Graffiti | Guardian',NULL),(370,'Cobblestone Pin',NULL),(371,'Sealed Graffiti | 200 IQ (Tracer Yellow)',NULL),(372,'Sealed Graffiti | BOOM (Wire Blue)',NULL),(373,'Sealed Graffiti | OMG (Violent Violet)',NULL),(374,'Sealed Graffiti | Denied (Cash Green)',NULL),(375,'Sealed Graffiti | Thoughtfull (Cash Green)',NULL),(376,'Sealed Graffiti | Choke (Dust Brown)',NULL),(377,'Sealed Graffiti | Bock Bock (Battle Green)',NULL),(378,'Sealed Graffiti | Fart (Cash Green)',NULL),(379,'Sealed Graffiti | Rly (Monster Purple)',NULL),(380,'Sealed Graffiti | Little EZ (Jungle Green)',NULL),(381,'Sealed Graffiti | Silver Bullet (Shark White)',NULL),(382,'Sealed Graffiti | Shining Star (Jungle Green)',NULL),(383,'Sealed Graffiti | Smooch (SWAT Blue)',NULL),(384,'Sealed Graffiti | 200 IQ (Bazooka Pink)',NULL),(385,'Sealed Graffiti | Denied (Tracer Yellow)',NULL),(386,'Copper Lambda Pin',NULL),(387,'Sealed Graffiti | Little Bock (Frog Green)',NULL),(388,'Sealed Graffiti | Thoughtfull (Wire Blue)',NULL),(389,'Sealed Graffiti | OMG (Brick Red)',NULL),(390,'Sealed Graffiti | Happy Cat (Tiger Orange)',NULL),(391,'Sealed Graffiti | Choke (Bazooka Pink)',NULL),(392,'Sealed Graffiti | 1G (Cash Green)',NULL),(393,'Sealed Graffiti | Broken Heart (Dust Brown)',NULL),(394,'Sealed Graffiti | Okay (Blood Red)',NULL),(395,'Sealed Graffiti | Chef Kiss (Jungle Green)',NULL),(396,'Sealed Graffiti | Old School',NULL),(397,'Sealed Graffiti | Broken Heart (Bazooka Pink)',NULL),(398,'Operation Hydra Access Pass',NULL),(399,'Sustenance! Pin',NULL),(400,'Glove Case Key',NULL);
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
  `price` float DEFAULT NULL,
  `recommanded_price` float DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weapon`
--

LOCK TABLES `weapon` WRITE;
/*!40000 ALTER TABLE `weapon` DISABLE KEYS */;
INSERT INTO `weapon` VALUES (1,'NULL_WEAPON',NULL),(2,'Ursus Knife',1),(3,'Talon Knife',1),(4,'M4A4',4),(5,'Desert Eagle',2),(6,'Karambit',NULL),(7,'Bayonet',NULL),(8,'USP-S',NULL),(9,'M9 Bayonet',NULL),(10,'AK-47',NULL),(11,'AWP',NULL),(12,'Flip Knife',NULL),(13,'Stiletto Knife',NULL),(14,'M4A1-S',NULL),(15,'Butterfly Knife',NULL),(16,'Huntsman Knife',NULL),(17,'Classic Knife',NULL),(18,'Shadow Daggers',NULL),(19,'Five-SeveN',NULL),(20,'P250',NULL),(21,'Glock-18',NULL),(22,'SG 553',NULL),(23,'Bowie Knife',NULL),(24,'Gut Knife',NULL),(25,'SSG 08',NULL),(26,'Skeleton Knife',NULL),(27,'Survival Knife',NULL),(28,'Navaja Knife',NULL),(29,'Falchion Knife',NULL),(30,'Paracord Knife',NULL),(31,'Nomad Knife',NULL),(32,'UMP-45',NULL),(33,'AUG',NULL),(34,'P2000',NULL),(35,'Sawed-Off',NULL),(36,'MAG-7',NULL),(37,'MAC-10',NULL),(38,'P90',NULL),(39,'MP9',NULL),(40,'FAMAS',NULL),(41,'XM1014',NULL),(42,'MP7',NULL),(43,'Galil AR',NULL),(44,'PP-Bizon',NULL),(45,'Negev',NULL),(46,'Nova',NULL),(47,'G3SG1',NULL);
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

-- Dump completed on 2020-06-27 16:05:16

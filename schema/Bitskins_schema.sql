-- MySQL Script generated by MySQL Workbench
-- Mon Apr 27 14:19:45 2020
-- Model: New Model    Version: 1.4
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema bitskins_csgo
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `bitskins_csgo` ;

-- -----------------------------------------------------
-- Schema bitskins_csgo
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `bitskins_csgo` DEFAULT CHARACTER SET utf8 ;
USE `bitskins_csgo` ;

-- -----------------------------------------------------
-- Table `bitskins_csgo`.`skin_state`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bitskins_csgo`.`skin_state` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bitskins_csgo`.`skin_rarity`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bitskins_csgo`.`skin_rarity` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bitskins_csgo`.`skin_sell_order`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bitskins_csgo`.`skin_sell_order` (
  `id_str` VARCHAR(255) NOT NULL,
  `market_name` VARCHAR(45) NULL,
  `item_rarity` INT NULL,
  `item_state` INT NULL,
  `image` VARCHAR(255) NULL,
  `price` FLOAT NULL,
  `recommanded_price` FLOAT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  INDEX `fk_state_idx` (`item_state` ASC) VISIBLE,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sell_order_id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_rarity_idx` (`item_rarity` ASC) VISIBLE,
  CONSTRAINT `fk_item_state`
    FOREIGN KEY (`item_state`)
    REFERENCES `bitskins_csgo`.`skin_state` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_item_rarity`
    FOREIGN KEY (`item_rarity`)
    REFERENCES `bitskins_csgo`.`skin_rarity` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bitskins_csgo`.`business_query`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bitskins_csgo`.`business_query` (
  `id` INT NOT NULL,
  `name` VARCHAR(255) NULL,
  `query` VARCHAR(255) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bitskins_csgo`.`skin_set`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bitskins_csgo`.`skin_set` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bitskins_csgo`.`skin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bitskins_csgo`.`skin` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `image_url` VARCHAR(255) NULL,
  `skin_set` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_skin_set_idx` (`skin_set` ASC) VISIBLE,
  CONSTRAINT `fk_skin_set`
    FOREIGN KEY (`skin_set`)
    REFERENCES `bitskins_csgo`.`skin_set` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `bitskins_csgo`.`skin_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `bitskins_csgo`.`skin_category` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `parent_category_id` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_parent_category_idx` (`parent_category_id` ASC) VISIBLE,
  CONSTRAINT `fk_parent_category`
    FOREIGN KEY (`parent_category_id`)
    REFERENCES `bitskins_csgo`.`skin_category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `bitskins_csgo`.`skin_state`
-- -----------------------------------------------------
START TRANSACTION;
USE `bitskins_csgo`;
INSERT INTO `bitskins_csgo`.`skin_state` (`id`, `name`) VALUES (0, 'UNKONWN');
INSERT INTO `bitskins_csgo`.`skin_state` (`id`, `name`) VALUES (1, 'Battle-Scarred');
INSERT INTO `bitskins_csgo`.`skin_state` (`id`, `name`) VALUES (2, 'Well-Worn');
INSERT INTO `bitskins_csgo`.`skin_state` (`id`, `name`) VALUES (3, 'Field-Tested');
INSERT INTO `bitskins_csgo`.`skin_state` (`id`, `name`) VALUES (4, 'Minimal-Wear');
INSERT INTO `bitskins_csgo`.`skin_state` (`id`, `name`) VALUES (5, 'Factory-New');

COMMIT;


-- -----------------------------------------------------
-- Data for table `bitskins_csgo`.`skin_rarity`
-- -----------------------------------------------------
START TRANSACTION;
USE `bitskins_csgo`;
INSERT INTO `bitskins_csgo`.`skin_rarity` (`id`, `name`) VALUES (0, 'Unknown');
INSERT INTO `bitskins_csgo`.`skin_rarity` (`id`, `name`) VALUES (1, 'Consumer Grade');
INSERT INTO `bitskins_csgo`.`skin_rarity` (`id`, `name`) VALUES (2, 'Industrial Grade');
INSERT INTO `bitskins_csgo`.`skin_rarity` (`id`, `name`) VALUES (3, 'Mil-spec Grade');
INSERT INTO `bitskins_csgo`.`skin_rarity` (`id`, `name`) VALUES (4, 'Restricted');
INSERT INTO `bitskins_csgo`.`skin_rarity` (`id`, `name`) VALUES (5, 'Classified');
INSERT INTO `bitskins_csgo`.`skin_rarity` (`id`, `name`) VALUES (6, 'Covert');
INSERT INTO `bitskins_csgo`.`skin_rarity` (`id`, `name`) VALUES (7, 'Contraband');

COMMIT;


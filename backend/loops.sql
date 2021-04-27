-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema loops
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema loops
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `loops` DEFAULT CHARACTER SET utf8mb4 ;
USE `loops` ;

-- -----------------------------------------------------
-- Table `loops`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `loops`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `loops`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `loops`.`messages` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `username_idx` (`name` ASC),
  CONSTRAINT `username`
    FOREIGN KEY (`name`)
    REFERENCES `loops`.`user` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `loops`.`rooms`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `loops`.`rooms` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `creator` INT(11) NOT NULL,
  `params` VARCHAR(255) NOT NULL,
  `modified` BIGINT(20) NOT NULL,
  `moveCount` INT(11) NOT NULL,
  `game` MEDIUMBLOB NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC),
  INDEX `user_id_idx` (`creator` ASC),
  CONSTRAINT `user_id`
    FOREIGN KEY (`creator`)
    REFERENCES `loops`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `loops`.`moves`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `loops`.`moves` (
  `room` INT(11) NOT NULL,
  `user` INT(11) NOT NULL,
  `moveNumber` INT(11) NOT NULL,
  `move` TINYBLOB NOT NULL,
  PRIMARY KEY (`room`,`moveNumber`),
  INDEX `room_id_idx` (`room` ASC),
  INDEX `userid_idx` (`user` ASC),
  CONSTRAINT `room_id`
    FOREIGN KEY (`room`)
    REFERENCES `loops`.`rooms` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `userid`
    FOREIGN KEY (`user`)
    REFERENCES `loops`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

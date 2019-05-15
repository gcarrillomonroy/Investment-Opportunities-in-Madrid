CREATE DATABASE  IF NOT EXISTS `B_Project02`;
USE `B_Project02`;

CREATE TABLE IF NOT EXISTS origin_distribution (
      id INT AUTO_INCREMENT,
	  `Latitude` text,
	  `Longitude` text,
	  `Date` text,
	  `Source` text,
	  `Channel` text,
	  `Merchants` double DEFAULT NULL,
	  `Cards` double DEFAULT NULL,
	  `Txs` double DEFAULT NULL,
	  `Avg. amount` text,
	  `Origin type` text,
	  `Origin` text,
	  `Merchants by origin` double DEFAULT NULL,
	  `Cards by origin` double DEFAULT NULL,
	  `Txs by origin` double DEFAULT NULL,
	  `Avg. amount by origin` text,
	  `Age` text,
	  `Merchants by age` double DEFAULT NULL,
	  `Cards by age` double DEFAULT NULL,
	  `Txs by age` double DEFAULT NULL,
	  `Avg. amount by age` text,
	  `Gender` text,
	  `Merchants by gender` double DEFAULT NULL,
	  `Cards by gender` double DEFAULT NULL,
	  `Txs by gender` double DEFAULT NULL,
	  `Avg. amount by gender` text,
      PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS consumption_pattern (
  id INT AUTO_INCREMENT,
  `Latitude` float DEFAULT NULL,
  `Longitude` float DEFAULT NULL,
  `Source` text,
  `Category` text,
  `Merchants` float DEFAULT NULL,
  `Cards` float DEFAULT NULL,
  `Txs` float DEFAULT NULL,
  `Avg. amount` float DEFAULT NULL,
  `Day` text,
  `Merchants by day` float DEFAULT NULL,
  `Cards by day` float DEFAULT NULL,
  `Txs by day` float DEFAULT NULL,
  `Avg. amount by day` float DEFAULT NULL,
  `Max. amount by day` float DEFAULT NULL,
  `Min. amount by day` float DEFAULT NULL,
  `Std. amount by day` float DEFAULT NULL,
  `Hour` time DEFAULT NULL,
  `Merchants by hour` float DEFAULT NULL,
  `Cards by hour` float DEFAULT NULL,
  `Txs by hour` float DEFAULT NULL,
  `Avg. amount by hour` float DEFAULT NULL,
  `Max. amount by hour` float DEFAULT NULL,
  `Min. amount by hour` float DEFAULT NULL,
  `Std. amount hour` float DEFAULT NULL,
  PRIMARY KEY (id)
);

select * from OriginDistribution;
select count(Cards) from OriginDistribution;

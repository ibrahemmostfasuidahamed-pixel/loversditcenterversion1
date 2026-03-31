<?php
// ============================================================
//  SQL Schema — Run once in phpMyAdmin SQL tab
//  Place this file at: /public_html/api/create_table.sql
// ============================================================
CREATE TABLE IF NOT EXISTS `products` (
  `id`          INT            NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(255)   NOT NULL,
  `description` TEXT,
  `price`       VARCHAR(50)    NOT NULL DEFAULT '0',
  `image`       VARCHAR(500)   DEFAULT NULL,
  `video`       VARCHAR(500)   DEFAULT NULL,
  `category`    VARCHAR(100)   DEFAULT 'other',
  `created_at`  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

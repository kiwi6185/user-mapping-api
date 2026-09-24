CREATE TABLE user_mappings (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  id1        VARCHAR(128)    NOT NULL,
  id2        VARCHAR(128)    NOT NULL,
  user_id    CHAR(36)        NOT NULL,
  created_at DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_id1_id2 (id1, id2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

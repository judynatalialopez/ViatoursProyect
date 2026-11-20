CREATE TABLE IF NOT EXISTS place_branches (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  place_id       BIGINT UNSIGNED NOT NULL,
  destination_id BIGINT UNSIGNED NOT NULL,
  is_branch      TINYINT(1) NOT NULL DEFAULT 0,
  address        VARCHAR(255) NULL,
  phone          VARCHAR(50)  NULL,
  UNIQUE KEY uq_pb_place_dest_branch (place_id, destination_id, is_branch),
  KEY idx_pb_destination (destination_id),
  CONSTRAINT fk_pb_place
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  CONSTRAINT fk_pb_dest
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
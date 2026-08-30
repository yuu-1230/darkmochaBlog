CREATE TABLE IF NOT EXISTS post_likes (
  post_id VARCHAR(100) NOT NULL,
  visitor_hash CHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (post_id, visitor_hash)
);

CREATE INDEX IF NOT EXISTS post_likes_post_id_idx
  ON post_likes (post_id);

ALTER TABLE categories DROP FOREIGN KEY fk_categories_destination;
ALTER TABLE categories DROP INDEX uq_category_destination_slug;
ALTER TABLE categories DROP COLUMN destination_id;
ALTER TABLE categories ADD UNIQUE KEY uq_categories_slug(slug);

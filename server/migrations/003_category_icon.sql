ALTER TABLE categories
ADD COLUMN icon VARCHAR(100) NOT NULL DEFAULT 'fa-light fa-tag' AFTER slug;

UPDATE categories SET icon='fa-light fa-utensils' WHERE slug='restaurantes';
UPDATE categories SET icon='fa-light fa-map' WHERE slug='experiencia';
UPDATE categories SET icon='fa-light fa-gem' WHERE slug='joyeria';

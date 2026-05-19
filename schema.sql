-- Create the characters table
CREATE TABLE characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image_url TEXT,
    votes INTEGER DEFAULT 0
);

-- Seed default characters
INSERT INTO characters (name, image_url, votes)
VALUES 
    ('Hero Alpha', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alpha', 0),
    ('Hero Beta', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Beta', 0);

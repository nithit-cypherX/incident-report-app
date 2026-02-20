-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_incidents_category ON incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_title ON incidents(title);

-- Full-text search index for title and description
CREATE INDEX IF NOT EXISTS idx_incidents_search ON incidents USING gin(to_tsvector('english', title || ' ' || description));
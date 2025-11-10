-- Indexes pour optimiser les recherches de photos

-- Index sur eventId (filtrage par événement)
CREATE INDEX IF NOT EXISTS "idx_photos_eventId" ON "photos"("eventId");

-- Index sur userId (les photographes voient seulement leurs photos)
CREATE INDEX IF NOT EXISTS "idx_photos_userId" ON "photos"("userId");

-- Index sur createdAt (tri par date)
CREATE INDEX IF NOT EXISTS "idx_photos_createdAt" ON "photos"("createdAt" DESC);

-- Index GIN sur le tableau tags pour recherche rapide d'éléments
CREATE INDEX IF NOT EXISTS "idx_photos_tags_gin" ON "photos" USING GIN("tags");

-- Index sur username pour recherche de photographe
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users"("username");

-- Index compound pour la requête principale (userId + eventId + createdAt)
CREATE INDEX IF NOT EXISTS "idx_photos_user_event_created" ON "photos"("userId", "eventId", "createdAt" DESC);

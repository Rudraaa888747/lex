ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "suspended" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "preferences" JSONB;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'User'
      AND column_name = 'emailVerified'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMPTZ;

    UPDATE "User"
    SET "emailVerifiedAt" = CASE
      WHEN "emailVerified" = true THEN COALESCE("updatedAt", "createdAt", CURRENT_TIMESTAMP)
      ELSE NULL
    END;

    ALTER TABLE "User" DROP COLUMN "emailVerified";
    ALTER TABLE "User" RENAME COLUMN "emailVerifiedAt" TO "emailVerified";
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key"
ON "Account"("provider", "providerAccountId");

CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  "userAgent" TEXT,
  "ip" TEXT,
  "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key"
ON "Session"("sessionToken");

CREATE INDEX IF NOT EXISTS "Session_userId_idx"
ON "Session"("userId");

CREATE INDEX IF NOT EXISTS "Session_expires_idx"
ON "Session"("expires");

ALTER TABLE "Analysis"
ADD COLUMN IF NOT EXISTS "topRedFlags" TEXT,
ADD COLUMN IF NOT EXISTS "importantClauses" TEXT,
ADD COLUMN IF NOT EXISTS "beforeYouSign" TEXT,
ADD COLUMN IF NOT EXISTS "legalInsights" TEXT,
ADD COLUMN IF NOT EXISTS "contractScore" TEXT,
ADD COLUMN IF NOT EXISTS "conflictOfInterest" TEXT,
ADD COLUMN IF NOT EXISTS "favorableClauses" TEXT,
ADD COLUMN IF NOT EXISTS "jurisdictionInsights" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Analysis_documentId_key"
ON "Analysis"("documentId");

CREATE INDEX IF NOT EXISTS "Document_userId_idx"
ON "Document"("userId");

CREATE INDEX IF NOT EXISTS "Analysis_userId_idx"
ON "Analysis"("userId");

CREATE INDEX IF NOT EXISTS "ChatSession_userId_idx"
ON "ChatSession"("userId");

CREATE TABLE IF NOT EXISTS exam (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    level       VARCHAR(10)  NOT NULL,        -- N1 / N2 / N3 / N4 / N5
    exam_year   INT,
    exam_season VARCHAR(10),                  -- 7月 / 12月
    content     TEXT NOT NULL,                -- 整张听力试卷原文（几百行，保留换行）
    note        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- slug 由数据库自动生成：n1-2025-07，天然唯一
    slug        TEXT GENERATED ALWAYS AS (
        LOWER(level) || '-' || exam_year::TEXT
        || '-' || LPAD(REGEXP_REPLACE(COALESCE(exam_season, ''), '[^0-9]', '', 'g'), 2, '0')
    ) STORED UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_exam_level_year  ON exam (level, exam_year DESC);
CREATE INDEX IF NOT EXISTS idx_exam_title       ON exam (title);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_exam_content_trgm
    ON exam USING gin (content gin_trgm_ops);

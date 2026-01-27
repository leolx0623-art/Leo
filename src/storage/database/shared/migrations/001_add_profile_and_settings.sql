-- 创建个人名片表
CREATE TABLE IF NOT EXISTS profile (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  location VARCHAR(255),
  email VARCHAR(255),
  github VARCHAR(255),
  linkedin VARCHAR(255),
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建网站设置表
CREATE TABLE IF NOT EXISTS settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name VARCHAR(255) NOT NULL,
  site_description TEXT,
  enable_contact_form BOOLEAN NOT NULL DEFAULT true,
  enable_ai_chat BOOLEAN NOT NULL DEFAULT true,
  contact_email VARCHAR(255) NOT NULL,
  ai_persona TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS profile_id_idx ON profile(id);
CREATE INDEX IF NOT EXISTS settings_id_idx ON settings(id);

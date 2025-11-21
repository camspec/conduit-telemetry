CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  api_key varchar(64) UNIQUE NOT NULL,
  device_type varchar(50) NOT NULL,
  created_at timestamptz DEFAULT now()
);

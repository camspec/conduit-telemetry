CREATE TABLE devices (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name varchar(100) NOT NULL,
  api_key varchar(64) NOT NULL UNIQUE,
  category varchar(50) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE telemetry_numeric (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reading numeric NOT NULL,
  unit varchar(50),
  device_id integer NOT NULL REFERENCES devices(id),
  recorded_at timestamptz NOT NULL
);

CREATE INDEX idx_telemetry_numeric_device_time ON telemetry_numeric(device_id, recorded_at);

CREATE TABLE telemetry_text (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reading text NOT NULL,
  device_id integer NOT NULL REFERENCES devices(id),
  recorded_at timestamptz NOT NULL
);

CREATE INDEX idx_telemtetry_text_device_time ON telemetry_text(device_id, recorded_at);

# Conduit
*Named after the conduit blocks from the Minecraft mod Ender IO, which transport items, energy, and data between systems.* <img width="20" height="20" alt="Block_Item_Conduit" src="https://github.com/user-attachments/assets/0e18ead7-794c-4f35-9b03-5157a248ce5e" />


Conduit is a light telemetry data collection and visualization app. My goal is to consolidate a variety of device data and telemetry into a single interface, while also handling real-time data.

The app demonstrates efficient live data visualization with minimal latency over the WebSocket protocol. It focuses on time series data (a series of datapoints each individually linked with a timestamp). This lets us potentially do more interesting data analytics such as aggregation, trend analysis, and visualization.

I have a few focuses in mind while developing this application:
- Simplicity: We want to allow people to access data easily. The data pipeline should be simple and minimalistic.
- Analytics: It should be easy to compare data streams or values within a unified framework.
- Compatibility: We should be able to support a wide variety of data formats, types, and frequencies.
- Real-time: The app should be able to reasonably handle large amounts of real-time data.

## Potential use case
Smart home devices often lack unified interfaces, and they unfortunately require multiple apps to access data (everything needs an app now). Telemetry from different devices can be difficult to retrieve and view in one pretty place. 

Traditional data analytics tools like Jupyter, R, or BI platforms are powerful but can require significant setup and technical expertise. Conduit provides a lightweight alternative and focuses on quick visualization and monitoring of device telemetry.

This is a learning project and proof of concept that intends to demonstrate how an API and visualization layer can make data collection simpler.

For production use, we'd want authentication, more features, and robust, extensible time series storage (e.g. TimescaleDB).

## Tech stack
For the backend:
- Node.js + Express
- PostgreSQL with some composite indexes
- WebSockets for real-time data

Frontend stuff:
- React and TypeScript
- Vite
- Recharts
- React Query and React Router
- Native WebSocket API

Development tools:
- ESLint and Prettier
- Sheer willpower

## Setup instructions
```bash
# Clone the repo (I personally use SSH)
git clone https://github.com/camspec/conduit-telemetry.git
cd conduit-telemetry

# Install backend dependencies
cd backend
npm install

# Make a postgres superuser if you haven't already
# The username will need to match your system username for the following commands to work
sudo -u postgres createuser -s <your_username>

# Create database
createdb conduit

# Run schema
psql -d conduit -f db/schema.sql
# You'll also want to create a .env file in the backend directory containing your Postgres credentials
# Example:
# PGUSER=<your_username>
# PGHOST=localhost
# PGPORT=5432
# PGDATABASE=conduit
# PGPASSWORD=<your_password>

# Generate some mock data
npm run seed

# Start the backend server (runs on http://localhost:3000 unless PORT is specified in .env)
npm start

# In another terminal, install frontend dependencies
cd frontend
npm install

# Start the frontend dev server
npm run dev
```

## Attributions
Ender IO conduit image from user RZR0 of the FTB wiki. Licensed under [CC BY-NC-SA 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/).

This project is licensed under the [MIT License](https://github.com/camspec/conduit-telemetry/blob/main/LICENSE).

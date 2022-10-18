# rmv-dashboard

A self-hosted web app for displaying public transport information like train & bus using the [RMV Open Data](https://opendata.rmv.de/site/start.html) API.

![Preview](https://user-images.githubusercontent.com/11744028/196059284-17f40ac5-c390-4168-b243-00bf539f55a1.png)

## Description

...

## Technology

- Backend
  - Express.js
  - Sequelize + SQLite
- Frontend
  - React
  - MaterialUI
- Docker

## Installation

First of all, get your RMV API Key from [here](https://opendata.rmv.de/site/anmeldeseite.html).

### Docker Hub

Pull the Docker image from [DockerHub](https://hub.docker.com/r/larswaechter/rmv-dashboard):

```bash
docker pull larswaechter/rmv-dashboard
```

or build it on your own:

```bash
docker build . -t larswaechter/rmv-dashboard
```

And run it:

```bash
docker run \
  -p 8080:8080 \
  -v /path/to/host/data:/app/data \
  -e RMV_KEY="YOUR_KEY" \
  -d \
  larswaechter/rmv-dashboard
```

### Docker Compose

```yml
version: "3"
services:
  rmv-dashboard:
    image: larswaechter/rmv-dashboard:latest
    container_name: rmv-dashboard
    volumes:
      - /path/to/host/data:/app/data
    ports:
      - 8080:8080
    restart: unless-stopped
```

### Debugging

If there occur any errors on the backend you can check the log files:

```bash
# Connect to container
docker exec -it <ContainerID> bash

# Open logs dir
cd backend/logs

# View logs
cat errors.log
```

## Development

```bash
# Clone Repo
git clone https://github.com/larswaechter/rmv-dashboard
cd rmv-dashboard

# Create Database
cd data
touch db.sqlite

# Setup Backend
cd backend
npm i
mv .env.example .env  # Enter your RMV API Key
npm run watch

# Setup Frontend
cd frontend
npm i
npm start
```

## Features

- Station Departure Board
- Train connection details

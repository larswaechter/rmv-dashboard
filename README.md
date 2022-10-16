# rmv-dashboard

A self-hosted web app for displaying public transport information like train & bus using the [RMV Open Data](https://opendata.rmv.de/site/start.html) API.

## Installation

First of all, get your RMV API Key from [here](https://opendata.rmv.de/site/anmeldeseite.html).

### Docker Hub

Pull the Docker image from [DockerHub](https://hub.docker.com/r/larswaechter/rmv-dashboard):

```bash
docker pull larswaechter/rmv-dashboard
```

And run it:

```bash
docker run \
  -p 8080:8080 \
  -v ~/rmvdata:/app/data \
  -e RMV_KEY="YOUR_KEY" \
  -d \
  rmv-dashboard
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

## Development

```bash
git clone https://github.com/larswaechter/rmv-dashboard
cd rmv-dashboard

# Create Database
cd data
touch db.sqlite

# Setup Frontend
cd frontend
npm run i
npm start

# Setup Backend
cd backend
npm run i
mv .env.example .env  # Enter your RMV API Key
npm run watch
```

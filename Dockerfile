FROM node:latest

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Copy data
COPY . /app

# Frontend target built directory
RUN mkdir -p ./public

# Frontend
RUN cd frontend \
    && npm i \
    && npm run build \
    && mv ./build/* ../public

# Backend
RUN cd backend \
    && npm i

# Cleanup
RUN rm -rf frontend/

# Run
EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "backend/src/index.js"]

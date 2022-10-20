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
    && npm i \
    && npm run build

# Cleanup
RUN rm -rf frontend/
RUN rm -rf backend/src

# Run
EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "backend/src/index.js"]

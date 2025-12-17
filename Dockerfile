FROM node:18-bullseye

WORKDIR /app

# Copy root package metadata if it exists
COPY package*.json ./

# Copy monorepo packages first (for caching)
COPY packages ./packages
COPY dc-dashboard ./dc-dashboard
COPY data-experience ./data-experience

# Install & build packages
WORKDIR /app/packages
RUN npm install && npm run build && npm run prepare

# Install & build dc-dashboard
WORKDIR /app/dc-dashboard
RUN npm install && npm run build

# Install & run data-experience
WORKDIR /app/data-experience
RUN npm install

EXPOSE 8080
CMD ["npm", "run", "dev:app"]

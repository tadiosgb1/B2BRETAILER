# ---------- Stage 1: Build Vue app ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Vue app
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:stable-alpine

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: copy custom nginx config if using Vue router in history mode
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

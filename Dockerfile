FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files and config files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY typeorm.config.ts ./
COPY typeorm.config.prod.ts ./

# Copy source files
COPY src ./src

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Build backend
RUN npm run build

# Compile production typeorm config
RUN npx tsc typeorm.config.prod.ts --esModuleInterop --resolveJsonModule

FROM node:20-alpine AS runner
WORKDIR /app

# Copy dist and package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/typeorm.config.prod.js ./typeorm.config.js

# Install production dependencies only
RUN npm install --omit=dev

ENV NODE_ENV=production

ENTRYPOINT ["node", "dist/src/main.js"]

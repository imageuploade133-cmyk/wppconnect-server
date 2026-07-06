FROM node:22.22.2-alpine AS base

WORKDIR /usr/src/wpp-server

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install build dependencies
RUN apk update && \
    apk add --no-cache \
    vips \
    vips-dev \
    fftw-dev \
    gcc \
    g++ \
    make \
    libc6-compat \
    pkgconfig \
    python3 \
    && rm -rf /var/cache/apk/*

# Ensure Yarn uses node_modules linker
COPY .yarnrc.yml ./

# Copy dependency files
COPY package.json ./
COPY yarn.lock ./

# Enable Corepack and Yarn
RUN corepack enable && \
    corepack prepare yarn@4.14.1 --activate

# Install dependencies
RUN yarn install --immutable

# ==========================
# Build Stage
# ==========================
FROM base AS build

WORKDIR /usr/src/wpp-server

COPY . .

RUN yarn install --immutable
RUN yarn build

# ==========================
# Runtime Stage
# ==========================
FROM build AS runtime

WORKDIR /usr/src/wpp-server

ENV NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROME_BIN=/usr/bin/chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install Chromium and required runtime libraries
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    vips \
    fftw

EXPOSE 21465

ENTRYPOINT ["node", "dist/server.js"]

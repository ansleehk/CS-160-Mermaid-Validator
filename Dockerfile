FROM node:20.11.1-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# If you're using `puppeteer` instead of `puppeteer-core`, it's recommended to skip the Chromium download since we'll be installing it manually
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install the latest version of Chromium package, which Puppeteer will use
# This step might need adjustments based on your specific needs or if you're using `puppeteer-core` with a custom browser binary
RUN apt-get update && apt-get install -y wget gnupg2 ca-certificates procps libxss1 \
      && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
      && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
      && apt-get update \
      && apt-get install -y google-chrome-stable \
      && rm -rf /var/lib/apt/lists/* \
      && apt-get purge --auto-remove -y wget gnupg2

# Copy the rest of your app's source code
COPY . .

# Expose port 3000 to the outside once the container has launched
EXPOSE 3000

# Run the application
CMD ["node", "app.js"]

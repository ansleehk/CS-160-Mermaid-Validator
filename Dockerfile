FROM node:20.11.1-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Update packages and install dependencies required for Google Chrome and Puppeteer
RUN apt-get update && apt-get install -y wget gnupg2 ca-certificates procps libxss1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
    libx11-6 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    libnss3 lsb-release xdg-utils

# Install Google Chrome Stable
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable

# Cleanup
RUN apt-get purge --auto-remove -y wget gnupg2 \
    && rm -rf /var/lib/apt/lists/*

# Copy the rest of your app's source code
COPY . .

# Expose port 3000 to the outside once the container has launched
EXPOSE 3000

# Run the application
CMD ["node", "index.js"]

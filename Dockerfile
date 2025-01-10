FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /usr/src/app

COPY package*.json ./

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

RUN npm install

RUN npx playwright install chromium

COPY . .

CMD ["node", "app.js"]

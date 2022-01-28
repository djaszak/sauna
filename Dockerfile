FROM node:16

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm exec pnpm install --frozen-lockfile

COPY . .
RUN npm exec pnpm run build

EXPOSE 3000
VOLUME [ "/app/data" ]

CMD ["npm", "run", "start"]

FROM node:16

WORKDIR /app

RUN npm -g i pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

EXPOSE 3000
VOLUME [ "/app/data" ]

CMD ["pnpm", "run", "start"]

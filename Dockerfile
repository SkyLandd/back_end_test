FROM node:18-alpine
COPY setup.sh /home/node/app/
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .

RUN chmod +x setup.sh && ./setup.sh
EXPOSE 3081
RUN pnpm run build

CMD ["pnpm", "run", "start"]
# client.Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
RUN npm run build

CMD sh -c 'if [ "$FRONT_MODE" = "dev" ]; then npm run dev -- --host 0.0.0.0; else npm run preview -- --host 0.0.0.0 --port 5173; fi'

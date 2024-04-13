# FROM node:17-alpine as backend

# WORKDIR /app

# COPY package*.json /app

# RUN npm install pm2 -g

# RUN npm install

# COPY ./client/package*.json /app/client/
# COPY prisma ./prisma/ 
# RUN cd client && npm install --force

# COPY . .

# # RUN npm run build

# CMD ["pm2-runtime", "process.json"]









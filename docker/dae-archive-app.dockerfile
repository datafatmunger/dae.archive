FROM node:12.18.3

WORKDIR /archive-app

# COPY /dae-archive-app/package-lock.json /usr/src/archive-app
# COPY /dae-archive-app/package.json /usr/src/archive-app

# RUN npm install

# COPY /dae-archive-app /usr/src/archive-app

ADD dae-archive-app /archive-app

RUN npm install

RUN npm run build

# for production
CMD ["npm", "start"] 

# for dev
# CMD ["npm", "run", "dev"]
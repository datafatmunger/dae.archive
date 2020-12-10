FROM node:12.18.3

WORKDIR /usr/src/app

COPY /dae-app/package-lock.json /usr/src/app
COPY /dae-app/package.json /usr/src/app

RUN npm install

COPY /dae-app /usr/src/app

RUN npm run build

# for production
CMD ["npm", "start"] 

# for dev
# CMD ["npm", "run", "dev"]
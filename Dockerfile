ARG node_ver=18-alpine
FROM node:${node_ver} as build-stage


# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

ARG VITE_API_BASE_URL
ARG VITE_APP_CLIENT_ID
ARG VITE_APP_AUTHORITY
ARG VITE_APP_NODE
ARG VITE_APP_REDIRECT_URL
ARG VITE_APP_TENANT_ID

# build app for production with minification
RUN npm run build


# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN chown -R nginx /var/cache/nginx /var/log/nginx/ /var/run/
EXPOSE 8081
USER nginx
CMD ["nginx", "-g", "daemon off;"]
FROM ubuntu:16.04

#####################################################
# NVM install to get node v0.12
# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Install base dependencies
RUN apt-get update && apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        wget

ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 0.12.18

WORKDIR $NVM_DIR

RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH
#####################################################
# make sure it worked...
RUN node --version && npm --version

# install sass
RUN apt-get install -y ruby ruby-dev
RUN gem install sass
RUN gem install compass

# install gulp
RUN npm install -g nodemon gulp

# copy app code to image
COPY . /usr/src/app

# chdir into /usr/src/app/application
WORKDIR /usr/src/app/application

# install dependencies
RUN npm install

# run production build
RUN npm run production-dist

# expose application port
EXPOSE 3000

# chdir into /usr/src/app/server
WORKDIR /usr/src/app/application/dist/server

RUN which node
# start app as default container command
CMD ["node", "index.js"]
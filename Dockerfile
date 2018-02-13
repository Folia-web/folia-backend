FROM node:8.9.4

MAINTAINER pgicquel <pygicq@kuniv-lemans.fr>

RUN apt-get update \
        && apt-get upgrade -y \
        && apt-get install -y unzip wget curl build-essential \
                cmake git pkg-config libswscale-dev \
                python3-dev python3-numpy \
                libtbb2 libtbb-dev libjpeg-dev \
                libpng-dev libtiff-dev libjasper-dev libgtk2.0-dev


RUN cd \
        && wget https://github.com/Itseez/opencv/archive/3.1.0.zip \
        && unzip 3.1.0.zip \
        && cd opencv-3.1.0 \
        && mkdir build \
        && cd build \
        && cmake .. \
        && make -j3 \
	      && make install \
	      && cd \
	      && rm 3.1.0.zip

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 8081
CMD [ "npm", "start" ]
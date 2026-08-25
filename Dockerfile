FROM node:18-bullseye

# Install python, pip, ffmpeg, and yt-dlp
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    pip3 install -U yt-dlp && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "start"]

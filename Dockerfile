# Use an official Python runtime as a parent image
FROM node:18-bullseye-slim

# Set the working directory to /dalinode
WORKDIR /worklog

# Copy the current directory contents into the container at /app

COPY ./server /worklog/server
COPY ./dist /worklog/dist
COPY ./server/package.json package.json

# Install any needed packages specified 
RUN cd server && npm install

# Define environment variable
ENV NAME worklog

# Run app when the container launches
CMD [ "node" , "server" ]

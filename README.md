# OpenLayers Flight Tracker Project

![demo](https://github.com/user-attachments/assets/8331ee55-694b-47d8-bb12-5d57209efe72)

This project is a containerized web application that displays live flight data on a map using OpenLayers for map tiles and the OpenSky Network API for real-time flight information. The backend, built with NestJS, fetches live flight data from the OpenSky Network API and streams it to the frontend using Server-Sent Events (SSE). The frontend, built with SvelteKit, visualizes this data on an interactive map.

This setup allows users to see live flight information seamlessly updated on a map, all while being hosted in a containerized environment for easy scaling and management.

### Key Features

- OpenLayers: Used for rendering dynamic map tiles and displaying flight data.
- OpenSky Network API: Provides live flight data, which is processed by the backend.
- NestJS Backend: Fetches flight data and streams it to the frontend via SSE.
- SvelteKit Frontend: Displays real-time flight data on an interactive map.
- Docker Containerization: Both the frontend and backend are containerized using Docker, making the application easy to deploy and run in any environment.

### Technology Stack

- ![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
- ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### Installation

#### Creating the .env file

Before anything please create a .env file in the backend directory using the .env.example as reference.

You will also need to head over to [OpenSky Network](https://opensky-network.org/) and register for an account if you do not already have one.

```
# OPENSKY NETWORK CONFIGURATIONS
OPENSKY_USERNAME=""
OPENSKY_PASSWORD=""
```

> [!NOTE] 
> **OPENSKY_USERNAME** refers to the username you signed up with and **OPENSKY_PASSWORD** refers to the password you signed up with.

#### Using Docker

You can install and run the web application just by using the docker command (assuming you have docker installed).

```
docker-compose up --build
```

#### Manual

You can also manually run the web application using the commands below.

To start the frontend:

```
cd .\frontend\
npm run dev
```

To start the backend:

```
cd .\backend\
npm run start
```

### Conclusion

This project showcases my skills in building modern, real-time web applications by integrating OpenLayers with the OpenSky Network API to provide dynamic, live flight tracking. By using NestJS for the backend and SvelteKit for the frontend, I've demonstrated my full-stack development capabilities, delivering a seamless experience from data fetching to visualization.

Containerizing the application with Docker ensures consistency across different environments, making it easier to deploy, scale, and maintain the application. This approach highlights my ability to create robust, portable applications that can run reliably in any setup, whether for local development or production.

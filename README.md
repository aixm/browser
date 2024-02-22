# AIXM Browser [![version](https://img.shields.io/badge/version-1.0.0-yellow.svg)](https://semver.org)
> Visualizing AIXM feature associations

AIXM Browser is a tool which evolves from [AIXM Graph](https://github.com/eurocontrol-swim/aixm-graph) that aims at visualizing the various features that can be found in an [AIXM](http://aixm.aero/) 
dataset along with their associations. The representation is made via an interactive graph where the user can explore 
the features and how they connect to each other in the specific dataset. 

At this [link](https://64.225.111.39:82) you can have a look at a demo of 
the tool and play around with preloaded AIXM datasets or upload your AIXM XML dataset files.

## Installation

The project can get easily up and running in any machine regardless the running OS with the help of 
[Docker](https://www.docker.com/).

> Before proceeding to the next steps please make sure that you have installed on your machine:
>   - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) 
>   - [Docker](https://docs.docker.com/get-docker/)
>   - [Node.js v20](https://nodejs.org/dist/latest-v20.x/)

### Get the repository

```shell script
git clone https://github.com/aixm/Graph.git
```

### Build server and client images

In the aixm-server directory:
```shell script
make create
```
In the aixm-client directory:
```shell script
make create
```

### Run the containers and install backend application

In the Graph directory:
```shell script
docker compose up -d --force-recreate --build
```
In the aixm-server directory:
```shell script
make install
```

## Update
In case a new version of the tool is available you can update via the following steps:

### Update the git repository
In the Graph directory:
```shell script
git pull --rebase origin master
```

### Stop/remove the relevant containers

In the Graph directory:
```shell script
docker compose down
```

### Build updated server and client images

In the aixm-server directory:
```shell script
make create
```
In the aixm-client directory:
```shell script
make create
```

### Run the containers and update backend application

In the Graph directory:
```shell script
docker compose up -d --force-recreate --build
```
In the aixm-server directory:
```shell script
make update
```


## For developers

The project is divided in two parts: [Server](./aixm-server/README.md) and [Client](./aixm-client/README.md). 

The server is the backend where the uploading and processing of the datasets happens. The api is implemented with the Laravel framework.
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

The client is the frontend where the datasets are visualized. The interface is implemented with the Angular framework.
<p align="center"><a href="https://angular.io/" target="_blank"><img src="https://angular.io/assets/images/logos/angular/angular.svg" width="150" alt="Angular Logo"></a></p>

In order to run the project locally on your machine for development and debug reasons you need to start the server 
and the client separately.

### Server
In the aixm-server directory:
```shell script
make up
make install
```

### Client
In the aixm-client directory:
```shell script
npm install
ng serve
```

    
## Contributing
If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

### Angular Linting
Linting is a crucial aspect of software development, ensuring code quality, consistency, and reliability. In the world of Angular, ESLint has become the go-to tool for enforcing coding standards and catching potential errors.

Before pushing source code to the main branch, please do the following in the aixm-client directory:
```shell script
npm run lint
```
or
```shell script
npm run lint:fix
```
### Updating libraries
The project does not use any special library except Laravel & Angular build in libraries. To keep them up to date please follow this guides:
- https://update.angular.io/
- https://laravel.com/docs/master/upgrade



## Links
- Repository: https://github.com/aixm/Graph
- AIXM: http://aixm.aero/


## Licensing

See [LICENSE](LICENSE)

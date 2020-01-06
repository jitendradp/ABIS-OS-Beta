# ABIS OS Alpha SDK

Live-Demo: https://dbidev.github.io/

To start the frontend, use the @angular/cli tool:  
```cd``` to the "frontend" directory, then run ```npm install``` and ```ng serve```.  
If you want to access the frontend from another device is your network, use ```ng serve --host YOUR.IP.ADD.RESS``` instead.
  
To start the complete environment, use the "docker-compose.yml" file in the root directory of this repository:  
```docker-compose up```  
  
The ports are mapped like following:  
* postgres: localhost:5432
* frontend: http://localhost:80
* yoga: http://localhost:4000
* prisma: http://localhost:4466/AbisStarterkit/dev
* prisma-admin: http://localhost:4466/AbisStarterkit/dev/_admin

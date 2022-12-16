#   MaplTube

##  Bitácora

Hola, soy Alan Lucciano Pindo, y me gusta ir registrando mis procesos de trabajo a modo de historia. 
Lo hago más que nada para poder recordar lo que hice y para poder compartirlo con otros.
Manos a la obra.


###  2022-12-15 21:00
Recibí la solicitud de realizar este challenge hoy a las 20:00.
Pasé un par de horas finalizando mini tareas y cerrando tabs de navegación.
A las 22:00 comencé a leer el challenge y a hacer un esquema mental de lo que se me pedía. Que es algo más o menos así:

> El reto es escribir un script o una pequeña aplicación que autentique a un usuario y devuelva si le gustó o no un video específico (dada su identificación o URL) usando NodeJS. 

A las 23:00 me puse a leer la documentación de la API de Youtube y a hacer un esquema mental de cómo podría resolver el challenge.

A las 23:30 comencé a escribir este documento. Y a las 00:00 comencé a escribir el código. Más bien, a crear el repo en Github y ajustar a mi gusto mi IDE favorito, IntelliJ IDEA Ultimate 2022.3 de JetBrains.

Luego me vi este video:

[How to Use YouTube API in Node - Full Tutorial](https://www.youtube.com/watch?v=3VHCxuxtuL8)

Ya son pasadas las 00:00, hago el primer commit y mañana es otra historia.

###  2022-12-16 15:00
Toca hacer toda la configuración de la API de Youtube. No entraré en detalles.
Y comenzamos nuestro código con un buen npm init.
next, next, next y ya tenemos nuestro package.json.
Actualizamos con sudo
```node
sudo npm install -g npm@9.2.0
```
y limpiamos terminal con 
```bash
clear
```
Ahora instalamos las dependencias que necesitamos para el proyecto.
```node
npm install express dotenv googleapis
```
Y ya tenemos nuestro package.json con las dependencias que necesitamos.



#### Important
The deadline for this assessment is Tuesday 20th of December at 24:00 CET. 
Please send your script to xxxxxxxxxx@yyyyyy.zzz before this deadline, indicating your name.
# Correcta ejecución de la página web

Para la correcta ejecución de la página y la promoción de buenas prácticas, se debe crear el archivo .env en la raíz de la página web, es decir en el directorio /racional-app/
el archivo .env debe tener el siguiente formato para que los archivos de conexión lean correctamente las credenciales:

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

Teniendo las credenciales, se deben ejecutar los siguientes comandos:

npm install

npm run dev

Y estará ejecutandose la página en localhost en el puerto indicado por vite.

# Uso de inteligencia artificial en el desarrollo de la tarea.

Antes de empezar con la interacción con la IA, debí realizar una investigación inicial sobre Firestore, pese a conocerla, nunca interactué con este tipo de bases de datos y no tenía una noción clara sobre la interacción que se tiene con las bases de datos no relacionales.

Posterior a esto implementé el uso de ia para hacer la planeación de la estructura de la página web, ya que pese a tener conocimientos sobre desarrollo web, no tenía una noción clara de cómo interactuar con esta base de datos, por lo que fue de gran ayuda para establecer una comunicación con la misma.
Por el hecho de nunca haber interactuado con Firestore, no conocía como esta entregaba la data, por lo que al consultar con Gemini, me indicó crear 2 scripts, siendo estos findArray.js e inspectData.js. Estos scripts fueron de gran ayuda para entender la estructura y la forma en la que se me estaba mostrando los datos, y fue clave para el desarrollo de la página web, ya que al tener el tipo de datos, tenía más claro el foco que debía tener la página y la forma en la que se muestran los datos para el usuario.

Al momento de tener una idea de como quería que fuera la página, la implementación fue mucho más sencilla, ya que teniendo la estructura de la misma levantada, y la conexión con la base de datos establecida, debía crear los gráficos y mostrar la información necesaria para el usuario. Entonces con ayuda de la ia, logramos la generación de scripts individuales para cada gráfico, además de que cada uno tuviera un diseño propio en pos de un mejor entendimiento con el usuario final.

En conclusión la ia fue de gran ayuda para establecer la conexión con la base de datos, la estructura de la pagina a nivel de código y para cambios estéticos que quisiera realizarle a la página, indicandome en dónde tienen que ir los cambios para la personalización de la estética de la página.
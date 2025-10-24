# instalación
Repositorio creado para realizar las pruebas para entrar como practicante a Racional.

Para iniciar la ejecución de la API, debe crear un entorno virtual. Ejecute el siguiente comando

python -m venv venv

Para activarlo en linux/macOS:

source venv/bin/activate

windows:

venv\Scripts\Activate

Una vez creado e iniciado el entorno virtual, debe instalar los requerimientos necesarios para la ejecución de la API (requirements.txt)

pip install -r requirements.txt

Una vez instalado los requerimientos necesarios para la API, se debe ejecutar el siguiente comando para levantar el servidor local:

python manage.py runserver

Una vez levantado el servidor, se debe ingresar a la URL http://127.0.0.1:8000/admin e iniciar sesión con las credenciales 

User: admin
password: admin

Esto dará un token de acceso lo que nos permitirá hacer consultas a la API.
Dentro de la vista de administrador se pueden hacer modificaciones manuales a la base de datos, como agregar más usuarios, agregar o eliminar stocks, etc.

# Rutas API
La API cuenta con 4 rutas principales, siendo estas:

/admin/
/api/transactions/
/api/users/id/
/api/users/id/portafolio

La primera ruta es para el inicio de sesión y verificación de credenciales para el uso seguro de la API
La segunda ruta corresponde a la ruta para obtener todas las transacciones, donde a partir de 4 transacciones principales se puede obtener información.
El formato que debe tener el JSON para hacer una solicitud GET es:

{
    "stock": ,
    "type": ,
    "quantity": ,
    "total_amount": 
}

En donde a partir del atributo "type" se elige el tipo de transacción a ejecutar.
Para cuando se ejecuta la transacción "deposit" o "withdrawal" los atributos "stock" y "quantity" puden ser null
Para cuando se ejecuta la transacción "buy" o "sell" el atrubuto "total_amount" debe quedar nulo ya que la API calcula el monto total.

La tercera ruta corresponde a la ruta para obtener toda la información del usuario. En este caso la id = 1 que es el único usuario creado en la base de datos.
Esta ruta cuenta con métodos GET, PUT, PATCH (para la modificación de info del usuario), HEAD y OPTIONS

{
    "id": 1,
    "username": "",
    "email": "",
    "first_name": "",
    "last_name": "",
    "rut": "",
    "balance": ""
}

Por último, la cuarta ruta corresponde al portafolio del usuario, en donde se muestra toda la información del portafolio, con el valor del mismo y de qué Stocks se compone este.

# Descripción del modelo de datos

Para el modelo de datos utilizado en este proyecto, me he decidido en una base de datos relacional, siendo implementada con python en el framework de Django.
Esto por la facilidad de configuración con diferentes bases de datos relacionales.
En cuanto a la elección de una base de datos relacional, mi desición se basó en la relación que existen entre diferentes componentes, como las transacciones que se realizan en base a los valores de Stock y los valores que posee el usuario (balance y su portafolios).
Es por esto que al momento de diseñar la base de datos, me enfoqué en 4 tablas principales, siendo estas User, Stock, Holdings y Transactions.
La tabla User debe contener toda la información del usuario, la tabla Stock debe contener toda la información de la acción (Stock), la tabla Holdings corresponden a las posesiones que tiene el usuario en su cuenta (qué Stock, en qué cantidad y el costo medio de esta), y finalmente la tabla Transactions registra todas las transacciones realizadas en la base de datos de manera centralizada, teniendo información de cuando se hizo la transacción, el tipo de transacción y por quién fue realizada. Además de información relacionada con la transacción en si.

La planeación de esta base de datos se basó en los requisitos indicados por la tarea, ya que en base a lo que solicita el sistema, se estipuló la forma en la que se procesan los datos y se almacenan los mismos, sin generar redundancias en el sistema.

# Uso de IA

En cuanto al uso de ia, esta fue involucrada posterior al diseño de la base de datos, ya que una vez hecha la planeación de la base de datos, utilicé Gemini PRO para asegurarme del correcto funcionamiento de django, en pos de que me diera instrucciones de instalación y el orden correcto de la ejecución de comandos para inicializar el proyecto.

Una vez establecida la estructura del sistema, el modelo fue de gran ayuda para la generación de los scripts, ya que, teniendo levantada la base de datos, se debían realizar consultas a la misma, además de implementar lógica para algunos requisitos.



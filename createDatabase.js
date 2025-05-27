const mysql = require('mysql2/promise')

const crearDataBase = async () =>
{
    const conection = await mysql.createConection({
        host:'host'
        user:'root'
        password:ENV.password
    })
    await connection.query('CREATE DATABASE IF NOT EXISTS crud_app')
    console.log('La base de datos se creo o ya existia')
    await connection.end()

} 


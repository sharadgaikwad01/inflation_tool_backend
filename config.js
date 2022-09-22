require('dotenv').config();   //instatiate environment variables

let CONFIG = {}               //Make this global to use all over the application

CONFIG.port         = process.env.PORT  || '3001';


CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '5432';
CONFIG.db_name      = process.env.DB_NAME       || 'inflation_tool';
CONFIG.db_user      = process.env.DB_USER       || 'postgres';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'metroindia1$';

CONFIG.session_encryption  = process.env.SESSION_ENCRPTION || 'SECRET_2022';
CONFIG.session_expiration  = process.env.SESSION_EXPIRATION || 8 * 3600 * 1000;
CONFIG.Allow_Origin = process.env.Allow_Origin || '';
module.exports = CONFIG;

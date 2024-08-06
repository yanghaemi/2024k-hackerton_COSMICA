const mysql = require('mysql');
require('dotenv').config();

// db 연결 설정
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//db 연결
const connect = () => {
    connection.connect((err) => {
        if (err) {
            console.error('db연결 실패:', err);
            return;
        }
        console.log('db연결 성공');
    });
};

//db 연결 종료
const disconnect = () => { //서버 연결 종료할 때 같이 사용 (선택)
    connection.end((err) => {
        if (err) {
            console.error('db 연결 종료 실패:', err);
            return;
        }
        console.log('db 연결 종료');
    });
};

module.exports = { connect, disconnect };

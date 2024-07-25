const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000; 
//서버 포트 번호 process.env.PORT 나중에
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.listen(port, () => {
    console.log("listen") // 정상 작동
}); 
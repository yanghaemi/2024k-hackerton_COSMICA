const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 5000; //process.env.PORT 나중에
const app = express();
const Map = require('./routes/MapRouter');
const MyPage =require('./routes/MyPageRouter');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.use('/main', Map);
app.use('/mypage', MyPage);

app.listen(port, () => {
    console.log("listen") // 정상 작동
}); 
const express = require('express');
const router = express.Router();
const SerachLocation = require('../controllers/SearchLocation');
const axios = require('axios');

router.route('/Search')
    .post(SerachLocation)

/** 
 * - 저상 버스 API를 처리하는 라우터
 * - 호출 주소: http://localhost:5000/main/bus
*/
router.get('/bus', async (req, res) => {
    
    const apiResult = {
        code: "400",
        data: "",
        msg : ""
    }

    try {

        const response = await axios.get('https://openapi.gg.go.kr/TBGGLOWBUSSTUSM');

        apiResult.code = 200;
        apiResult.data = response.data;
        apiResult.msg = "Ok";
        
    } catch(error) {
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = "Failed";
    }

    res.json(apiResult);
});

module.exports = router

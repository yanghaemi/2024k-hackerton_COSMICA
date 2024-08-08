var express = require('express');
var router = express.Router();
// 기본 주소: http://localhost:5000/report


//DB프로그래밍을 위한 ORM DB객체 참조하기
var db = require('../models/index');


/**신고 접수 리스트를 불러오는 라우터
 * 호출주소: http://localhost:5000/report/
 */
router.get('/', async (req, res) => {
    let apiResult = {
        code : 400,
        data : "",
        msg : ""
    }
    try {
        
        // DB내 신고 정보들 다 가져오기
        var reports = await db.report.findAll();

        apiResult.code = 200;
        apiResult.data = reports;
        apiResult.msg = "Ok";
    } catch (err) {
        console.log("에러: ",err);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = "Failed";
    }

    res.json(reports);
});

/**
 * 신고 접수 라우터
 * 호출주소 : http://localhost:5000/report/create
 */
router.post('/create', async (req, res) => {

    let apiResult = {
        code : 400,
        data : "",
        msg : ""
    }
    
    try{const report = {
        title: req.body.title,
        contents: req.body.contents,
        registedDate: Date.now(),
        registuserId: 1
    }

    const registedReport = await db.report.create(report);
        console.log("실제 DB article 테이블에 저장된 데이터확인:", registedReport);


        apiResult.code = 200;
        apiResult.data = report;
        apiResult.msg = "Ok";
    } catch (err) {
        console.error("에러: ", err);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = "Failed";
    }

    res.json(apiResult);
})

module.exports = router;
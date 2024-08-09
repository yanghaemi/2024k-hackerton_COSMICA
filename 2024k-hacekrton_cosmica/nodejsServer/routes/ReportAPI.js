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
        code: 400,
        data: "",
        msg: ""
    }
    
    try {
        const report = {
            title: req.body.title,
            contents: req.body.contents,
            registedDate: Date.now(),
            registuserId: 1
        }

        const registedReport = await db.report.create(report);
        console.log("실제 DB report 테이블에 저장된 데이터확인:", registedReport);


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
});


/**
 * 기존 신고 내용 수정 라우터
 * 호출주소 : http://localhost:5000/report/modify
 * 호출방식: post 
 */
router.post('/modify/:idx', async (req, res) => {
    let apiResult = {
        code: 400,
        data: "",
        msg: ""
    };

    try {

        const reportIdx = req.params.idx;

        const modifiedReport = {
            title: req.body.title,
            contents: req.body.contents,
            registedDate: Date.now(),
            registuserId: 1
        }

        const resultModify = await db.report.update(modifiedReport, { where: { reportId: reportIdx } });
        console.log("수정되어 db에 업데이트된 결과: ", resultModify);

        apiResult.code = 200;
        apiResult.data = modifiedReport;
        apiResult.msg = "Ok";
    } catch (err) {
        console.error("에러: ", err);

        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = "Failed";
    }

    res.json(apiResult);

});

/**
 * 기존 신고 내용 가져오는 라우터
 * 호출주소 : http://localhost:5000/report/modify/:id
 * 호출방식: get 
 */
router.get('/modify/:idx', async (req, res) => {
    let apiResult = {
        code: 400,
        data: "",
        msg: ""
    };

    try {

        // 현재 게시글 고유번호를 추출한다.
        const reportIdx = req.params.idx;


        //Step2: 해당 게시글 번호를 기준으로 단일 게시글 정보를 조회한다.
        const report = await db.report.findOne({ where: { reportId: reportIdx } });

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
});

module.exports = router;
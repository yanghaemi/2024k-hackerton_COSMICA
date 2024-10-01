const express = require('express');
const router = express.Router();
const SerachLocation = require('../controllers/SearchLocation');
const axios = require('axios');
var db = require('../models/index');
const { DESCRIBE } = require('sequelize/lib/query-types');
require('dotenv').config(); // .env 파일 로드


    
/**
 * 임의의 경로를 DB에 저장하는 기능을 처리하는 라우터
 * - 호출 주소: http://localhost:5000/main/addRoute
 */
router.post('/addRoute', async (req, res) => {
    const apiResult = {
        code: "400",
        data: "",
        msg: ""
    }

    try {
        
        const route = {
            data: JSON.stringify(req.body.selectedLocation), // JSON 문자열로 변환
            origin: JSON.stringify(req.body.origin),
            destination: JSON.stringify(req.body.destination)
        };
            console.log("addRoute: ",route);
        
        
        const registedRoute = await db.route.create(route);
        console.log("실제 DB route 테이블에 저장된 데이터확인:", registedRoute);




            apiResult.code = 200;
            apiResult.data = registedRoute;
            apiResult.msg = "Ok";
        
        
    } catch (error) {
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = "Failed";
    }

    res.json(apiResult);
});

/**
 * 각 추천루트 보여주고, flask 서버에 추천루트들 전송.
 * http:aws:5000/route/getRoute
 * get형식
 */

router.get('/getRoute', async (req, res) => {
    const apiResult = {
        code: "400",
        data: {
        data1: "", // 첫 번째 데이터
        data2: ""  // 두 번째 데이터
    },
        msg: ""
    }
    try {
        // 클라이언트에서 수신한 데이터 확인
        console.log("서버에서 수신한 origin:", req.query.origin);
        console.log("서버에서 수신한 destination:", req.query.destination);

        //문자열 형식으로 저장
        const origin = {
            latitude: Number(req.query.origin.latitude),
            longitude: Number(req.query.origin.longitude),
            name: req.query.origin.name
        };
        
        const destination = {
            latitude: Number(req.query.destination.latitude),
            longitude: Number(req.query.destination.longitude),
            name: req.query.destination.name
        };

        // 쿼리 조건을 객체 형태로 정의
        const routes = await db.route.findAll({
            where: {
                origin: JSON.stringify(origin),
                destination: JSON.stringify(destination)
            }
        });
        console.log("서버에서 조회한 routes:", routes);
        
        // 각 요소에 대해 JSON.parse를 적용합니다.
        const parsedRoutes = routes.map(route => {
        return {
            ...route.dataValues, // 기존 데이터베이스의 다른 필드들도 유지하려면 사용
            // data: JSON.parse(route.dataValues.data),
            data: typeof route.dataValues.data === 'string' ? JSON.parse(route.dataValues.data) : route.dataValues.data,
            destination: typeof route.dataValues.destination === 'string' ? JSON.parse(route.dataValues.destination) : route.dataValues.destination,
            // origin: JSON.parse(route.dataValues.origin)
        };
        });

        console.log(`${process.env.FLASK_URL}`)

        // flask에 보내는 부분------
        const response = await axios.post(`${process.env.FLASK_URL}/receive_data`, parsedRoutes);
        console.log("플라스크 url: ",`${process.env.FLASK_URL}`)
        console.log("flask로부터 응답: ", response.data);
        //--------
        
        // console.log("getRoute 서버 부분", parsedRoutes);

        apiResult.code = 200;
        apiResult.data.data1 = response.data; // Flask에서 받은 응답 데이터
        apiResult.data.data2 = parsedRoutes;  // 데이터베이스에서 가져온 경로 데이터
        apiResult.msg = "Ok";
        
        
    } catch (error) {
        console.log(error);
        apiResult.code = 500;
        apiResult.data = null;
        apiResult.msg = "Failed";
    }

    res.json(apiResult);
})

module.exports = router

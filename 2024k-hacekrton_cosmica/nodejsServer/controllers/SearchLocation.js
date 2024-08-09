const express = require('express');
const app = express();

const SearchLocation = (req,res) =>{ //위치 검색
    const location = req.body;

    res.send(location);
}

module.exports = SearchLocation;
const UserData = (req,res) =>{ //위치 검색
    const data = {
        name: 'hi',
        role: 'companion',
        rank: 'normal'
    }
    res.json(data);
}

module.exports = UserData;
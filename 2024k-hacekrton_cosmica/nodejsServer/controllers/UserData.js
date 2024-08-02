//nodejs 서버 확인용 코드입니다

const UserData = (req,res) =>{ //유저 데이터
    const data = {
        name: 'hi',
        role: 'companion',
        rank: 'normal'
    }
    res.json(data);
}

module.exports = UserData;
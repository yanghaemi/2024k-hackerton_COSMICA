from flask import Flask, request, jsonify
import numpy as np
import json
from math import radians, cos, sin, sqrt, atan2
from itertools import permutations


app = Flask(__name__)


# ----------ai 관련 함수 -----------------
def aiRoute(routeData):
    # Haversine 함수를 사용해 두 좌표 사이의 거리 계산
    def haversine(lat1, lon1, lat2, lon2):
        R = 6371  # 지구 반지름 (km)
        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)
        a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = R * c
        return distance

    # JSON 데이터를 거리 행렬로 변환
    def json_to_matrix(json_data):
        data = json.loads(json_data)
        points = [(float(point["lat"]), float(point["long"])) for point in data["data"]]

        num_points = len(points)
        distance_matrix = np.zeros((num_points, num_points))

        for i in range(num_points):
            for j in range(num_points):
                if i != j:
                    distance_matrix[i][j] = haversine(points[i][0], points[i][1], points[j][0], points[j][1])

        return points, distance_matrix

    # Brute-force TSP 경로 최적화
    def tsp_bruteforce(distance_matrix):
        num_points = len(distance_matrix)
        all_routes = permutations(range(num_points))
        min_distance = float('inf')
        best_route = None

        for route in all_routes:
            current_distance = 0
            for i in range(len(route) - 1):
                current_distance += distance_matrix[route[i]][route[i + 1]]
            current_distance += distance_matrix[route[-1]][route[0]]  # 시작점으로 돌아가기

            if current_distance < min_distance:
                min_distance = current_distance
                best_route = route

        return min_distance, best_route

    # Matrix Factorization (MF) 알고리즘 구현
    class MF():
        def __init__(self, R, hyper_params):
            self.R = np.array(R)
            self.num_users, self.num_items = np.shape(self.R)

            self.K = hyper_params['K']
            self.alpha = hyper_params['alpha']
            self.beta = hyper_params['beta']
            self.iterations = hyper_params['iterations']
            self.verbose = hyper_params['verbose']

            self.P = np.random.normal(scale=1./self.K, size=(self.num_users, self.K))
            self.Q = np.random.normal(scale=1./self.K, size=(self.num_items, self.K))

            self.b_u = np.zeros(self.num_users)
            self.b_i = np.zeros(self.num_items)
            self.b = np.mean(self.R[self.R.nonzero()])

            rows, cols = self.R.nonzero()
            self.samples = [(i, j, self.R[i, j]) for i, j in zip(rows, cols)]

        # RMSE 계산
        def rmse(self):
            xs, ys = self.R.nonzero()
            error = []
            for x, y in zip(xs, ys):
                prediction = self.get_prediction(x, y)
                error.append(self.R[x, y] - prediction)
            return np.sqrt(np.mean(np.array(error)**2))

        # 예측 계산
        def get_prediction(self, i, j):
            prediction = self.b + self.b_u[i] + self.b_i[j] + self.P[i, :].dot(self.Q[j, :].T)
            return prediction

        # 학습 과정
        def train(self):
            for it in range(self.iterations):
                np.random.shuffle(self.samples)
                for i, j, r in self.samples:
                    prediction = self.get_prediction(i, j)
                    e = r - prediction

                    self.b_u[i] += self.alpha * (e - self.beta * self.b_u[i])
                    self.b_i[j] += self.alpha * (e - self.beta * self.b_i[j])

                    self.P[i, :] += self.alpha * (e * self.Q[j, :] - self.beta * self.P[i, :])
                    self.Q[j, :] += self.alpha * (e * self.P[i, :] - self.beta * self.Q[j, :])

                rmse = self.rmse()

        # 모든 경로에 대해 예측 점수를 반환하는 함수
        def recommend(self):
            predictions = np.zeros((self.num_users, self.num_items))
            for i in range(self.num_users):
                for j in range(self.num_items):
                    predictions[i, j] = self.get_prediction(i, j)
            return predictions

    # 경로 데이터를 평가 매트릭스로 변환하고 MF 적용
    json_data_list = routeData

    # 평가 매트릭스 (예시)
    R = [
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3]
    ]

    # 하이퍼파라미터 설정 및 MF 모델 생성
    hyper_params = {'K': 10, 'alpha': 0.01, 'beta': 0.01, 'iterations': 600, 'verbose': True}
    mf = MF(R, hyper_params)
    mf.train()

    # 경로 추천
    predicted_scores = mf.recommend()

    # 가장 높은 점수를 가진 경로 추천
    best_route_index = np.argmax(np.mean(predicted_scores, axis=0))
    print(f"추천경로: {best_route_index + 1}번째 경로")
    recommended_json_data = json_data_list[best_route_index]
    print(recommended_json_data)

    # 추천 데이터 반환
    return recommended_json_data
# ---------------------------------------

@app.route('/', methods=['GET'])
def index():
    print("hello")
    return "Hello, Flask!", 200  # 웹페이지에 표시될 텍스트

@app.route('/receive_data', methods=['POST'])
def receive_data():
    try:
        apiResult = {
            "code": "400",
            "data": "",
            "msg": ""
        }

        # Node.js로부터 데이터를 수신
        received_data = request.json
        # print("node.js에서 받은 데이터: ", received_data)

        json_data_list = []

        for route in received_data:
            data_list = [{"lat": str(point['latitude']), "long": str(point['longitude'])} for point in route['data']]
            json_data_list.append({
                "data": data_list
            })

        print("변환된 json_data_list: ", json_data_list)

        # 데이터 처리 (ai)
        aiData = aiRoute(json_data_list)
        print("ai로 나온 경로:", aiData)

        # 처리된 데이터를 json 형식으로 응답
        apiResult["code"] = 200
        apiResult["data"] = aiData
        apiResult["msg"] = "ai 성공"

        return jsonify(apiResult), 200
    except Exception as e:
        print("Error: ",str(e))
        apiResult["code"] = 500
        apiResult["data"] = None
        apiResult["msg"] = "failed"
        return jsonify(apiResult), 500



if __name__ == '__main__':
    app.run(port=5001)  # Flask 서버 실행
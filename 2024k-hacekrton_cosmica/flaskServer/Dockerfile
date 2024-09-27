FROM python:3.9-slim
COPY . / ./


RUN pip install jsonify
RUN pip install flask
RUN pip install numpy
RUN pip install gunicorn

EXPOSE 5001
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]

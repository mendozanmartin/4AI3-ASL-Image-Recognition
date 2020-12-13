FROM python:3.6.8

RUN mkdir -p /usr/src/flask_app/
COPY requirements.txt /usr/src/flask_app/

WORKDIR /usr/src/flask_app/
RUN pip install -r requirements.txt

COPY . /usr/src/flask_app

# CMD ["flask", "run", "--host", "0.0.0.0"]\
EXPOSE 5000
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ["sh", "entrypoint.sh"]
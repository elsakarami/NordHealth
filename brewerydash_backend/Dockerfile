FROM python:3.11-slim

WORKDIR /app

COPY ./brewerydash_backend /app
COPY ./brewerydash_backend/requirements.txt /app/requirements.txt

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
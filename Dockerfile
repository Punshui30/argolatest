
FROM node:18 AS frontend

WORKDIR /app
COPY ./frontend ./frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

FROM python:3.10

WORKDIR /app
COPY ./backend /app
COPY --from=frontend /app/frontend/dist /app/static

RUN pip install --no-cache-dir fastapi uvicorn google-cloud-aiplatform

ENV GOOGLE_APPLICATION_CREDENTIALS="/app/argos-credentials.json"

COPY ./entrypoint.py /app/entrypoint.py
CMD ["python", "entrypoint.py"]

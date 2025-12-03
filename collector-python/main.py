import os
import time
import json
import requests
import pika
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')

RABBIT_HOST = os.getenv('RABBIT_HOST', 'localhost')
RABBIT_USER = os.getenv('RABBIT_USER', 'user')
RABBIT_PASS = os.getenv('RABBIT_PASS', 'password')
QUEUE_NAME = 'weather_queue'

#Latitude e Longitude de Goiânia
LAT = "-16.68"
LON = "-49.26"
API_URL = f"https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=America%2FSao_Paulo"


def get_weather_data():
  try:
    response = requests.get(API_URL)
    response.raise_for_status()
    data = response.json()

    current = data.get('current', {})

    payload = {
        "city": "Goiânia",
        "temperature": current.get('temperature_2m'),
        "humidity": current.get('relative_humidity_2m'),
        "wind_speed": current.get('wind_speed_10m'),
        "condition_code": current.get('weather_code'), 
        "timestamp": current.get('time') 
    }
    return payload
  except Exception as e:
    logging.error(f"Erro ao buscar clima: {e}")
    return None
  
def connect_rabbitmq():
  credentials = pika.PlainCredentials(RABBIT_USER, RABBIT_PASS)
  parameters = pika.ConnectionParameters(host=RABBIT_HOST, credentials=credentials)

  while True:
    try:
      connection = pika.BlockingConnection(parameters)
      logging.info("Sucesso ao conectar ao RabbitMQ")
      return connection
    except pika.exceptions.AMQPConnectionError:
      logging.warning("RabbitMQ indisponivel, tentando conexao novamente")
      time.sleep(5)

def main():
  connection = connect_rabbitmq()
  channel = connection.channel()

  channel.queue_declare(queue=QUEUE_NAME, durable=True)

  logging.info("Coletor iniciado!")

  while(True):
    weather_data = get_weather_data()

    if weather_data:
      message = json.dumps(weather_data)

      try:
        channel.basic_publish(
          exchange='',
          routing_key=QUEUE_NAME,
          body=message,
          properties=pika.BasicProperties(
            delivery_mode=2, #mensagem persistente 
          )
        )
        logging.info(f"Enviado {message}")
      except Exception as e:
        logging.error(f"Erro ao publicar: {e}")
        if connection.is_closed:
          connection = connect_rabbitmq()
          channel = connection.channel()
    time.sleep(60)

if __name__ == "__main__":
  main()    
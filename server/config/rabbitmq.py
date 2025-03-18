import pika
import os

connection = pika.BlockingConnection(pika.ConnectionParameters(os.getenv('RABBITMQ_HOST'),heartbeat=0))
channel = connection.channel()

channel.queue_declare(queue='Descriptive_Q')




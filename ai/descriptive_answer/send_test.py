#!/usr/bin/env python
import pika,json

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='Descriptive_Q')

channel.basic_publish(exchange='', routing_key='Descriptive_Q', body=json.dumps({"correct":correct,"student":student}))
print(" [x] Sent 'Hello World!'")
connection.close()

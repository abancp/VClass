import pika

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost',heartbeat=0))
channel = connection.channel()

channel.queue_declare(queue='Descriptive_Q')




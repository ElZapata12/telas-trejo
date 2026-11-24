import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificacionesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.grupo = "tienda"
        await self.channel_layer.group_add(self.grupo, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.grupo, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            try:
                datos = json.loads(text_data)
            except json.JSONDecodeError:
                datos = text_data
            await self.send(text_data=json.dumps({"tipo": "eco", "datos": datos}))
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Cấu hình origin cho phù hợp
    },
  })
  export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
    
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('send_message')
    handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
      // Ví dụ: broadcast message đến tất cả client
      client.broadcast.emit('receive_message', data);
    }

    // @SubscribeMessage('send_message')
    // handleMessage(@MessageBody() data: any): void {
    //     this.server.emit('receive_message', data);
    // }

  }
  
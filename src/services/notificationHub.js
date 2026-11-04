import * as signalR from '@microsoft/signalr';

let connection;

export const connectToNotificationHub = async (onReceiveNotification, accessToken = null) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5063/notificationHub', {
      accessTokenFactory: () => accessToken,
      withCredentials: true
    })
    .withAutomaticReconnect()
    .build();

  connection.on('ReceiveNotification', onReceiveNotification);

  try {
    await connection.start();
    console.log('Connected to SignalR hub');
  } catch (err) {
    console.error('Connection failed: ', err);
  }
};

export const sendNotification = async (notification) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    await connection.invoke('SendNotification', notification);
  } else {
    console.error('Not connected to hub');
  }
};

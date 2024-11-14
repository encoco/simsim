import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        if (WebSocketService.instance) {
            return WebSocketService.instance;
        }
        WebSocketService.instance = this;

        this.stompClient = null;
        this.subscriptions = new Map();
        this.connected = false;
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                const socket = new SockJS('https://localhost:8443/ws-stomp');

                this.stompClient = new Client({
                    webSocketFactory: () => socket,
                    debug: (str) => {
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000
                });

                this.stompClient.onConnect = () => {
                    this.connected = true;
                    console.log('WebSocket 연결 성공');
                    resolve();
                };

                this.stompClient.onStompError = (frame) => {
                    this.connected = false;
                    reject(new Error('STOMP error ' + frame.body));
                };

                this.stompClient.activate();

            } catch (error) {
                reject(error);
            }
        });
    }

    subscribe = (destination, callback) => {
        if (!this.stompClient || !this.connected) {
            return null;
        }

        try {
            console.log('Subscribing to:', destination);
            const subscription = this.stompClient.subscribe(destination, (message) => {
                try {
                    // body가 있으면 파싱 시도
                    if (message.body) {
                        const parsedBody = JSON.parse(message.body);
                        callback(parsedBody);
                    } else {
                        // body가 없으면 원본 메시지 전달
                        callback(message);
                    }
                } catch (error) {
                    console.log('Message is not JSON, using raw body');
                    callback(message.body);
                }
            });
            this.subscriptions.set(destination, subscription);
            return subscription;
        } catch (error) {
            console.error('Subscription failed:', error);
            return null;
        }
    };

    send(destination, headers = {}, body = {}) {
        if (!this.stompClient || !this.connected) {
            console.warn('WebSocket이 연결되지 않았습니다.');
            return;
        }

        try {
            this.stompClient.publish({
                destination: destination,
                headers: headers,
                body: JSON.stringify(body)
            });
        } catch (error) {
            console.error('메시지 전송 실패:', error);
        }
    }

    disconnect() {
        if (this.stompClient) {
            try {
                this.subscriptions.forEach(subscription => {
                    if (subscription) subscription.unsubscribe();
                });
                this.subscriptions.clear();
                this.stompClient.deactivate();
                this.connected = false;
                console.log('WebSocket 연결이 종료되었습니다.');
            } catch (error) {
                console.error('WebSocket 연결 종료 실패:', error);
            }
        }
    }

    unsubscribe(destination) {
        if (this.subscriptions.has(destination)) {
            try {
                const subscription = this.subscriptions.get(destination);
                if (subscription) {
                    subscription.unsubscribe();
                    this.subscriptions.delete(destination);
                }
            } catch (error) {
                console.error('구독 해제 실패:', error);
            }
        }
    }

    isConnected() {
        return this.connected;
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
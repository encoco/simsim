import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
    client;
    connected = false;

    constructor() {
        this.client = new Client({
            brokerURL: null, // 직접 SockJS를 사용하므로 brokerURL 사용 안 함
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str) => {
                console.debug('STOMP debug:', str);
            },
        });
    }

    /**
     * 동기식 연결 메서드
     */
    async connect() {
        if (this.connected) {
            console.warn('이미 WebSocket에 연결됨');
            return;
        }

        const socket = new SockJS('/ws-stomp'); // SockJS 경로 설정

        this.client.webSocketFactory = () => socket;

        return new Promise((resolve, reject) => {
            this.client.onConnect = () => {
                this.connected = true;
                console.log('WebSocket 연결 성공');
                resolve();
            };

            this.client.onStompError = (frame) => {
                this.connected = false;
                console.error('STOMP Error:', frame.body);
                reject(new Error('STOMP Error: ' + frame.body));
            };

            this.client.onDisconnect = () => {
                this.connected = false;
                console.warn('WebSocket 연결 해제');
            };

            try {
                this.client.activate();
            } catch (error) {
                console.error('WebSocket 활성화 오류:', error);
                reject(error);
            }
        });
    }

    /**
     * 대상에 구독
     * @param {string} destination - 구독할 STOMP 경로
     * @param {function} callback - 메시지 수신 콜백
     */
    subscribe(destination, callback) {
        if (!this.connected) {
            console.warn('WebSocket 연결되지 않음. 구독 불가능:', destination);
            return;
        }

        this.client.subscribe(destination, (message) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                callback(parsedMessage);
            } catch (error) {
                console.error('메시지 파싱 오류:', error, message.body);
            }
        });
    }

    /**
     * 메시지 전송
     * @param {string} destination - 전송할 STOMP 경로
     * @param {object} body - 전송할 데이터
     */
    send(destination, body) {
        if (!this.connected) {
            console.warn('WebSocket 연결되지 않음. 메시지 전송 불가능:', destination);
            return;
        }

        try {
            this.client.publish({
                destination,
                body: JSON.stringify(body),
            });
        } catch (error) {
            console.error('메시지 전송 오류:', error);
        }
    }

    disconnect() {
        if (this.connected && this.client) {
            try {
                this.client.deactivate(); // STOMP 클라이언트 비활성화
                this.connected = false;
                console.log('WebSocket 연결 해제');
            } catch (error) {
                console.error('WebSocket 연결 해제 중 오류:', error);
            }
        }
    }
}

export const webSocketService = new WebSocketService();
export default webSocketService;

import { Channel } from "amqplib";

export const SCANS_EXCHANGE = 'scans';
export const SCANS_DL_EXCHANGE = 'scans.dl';

const exchanges = [
    { name: SCANS_EXCHANGE, type: 'topic', durable: true },
    { name: SCANS_DL_EXCHANGE, type: 'topic', durable: true }
];

/// Ensures that the necessary exchanges and queues are initialized in the message broker. Idempotent.
const ensureExchangesInitialized = async (channel: Channel) => {
    for (const exchange of exchanges) {
        await channel.assertExchange(exchange.name, exchange.type, { durable: exchange.durable });
    }
}

export default ensureExchangesInitialized;
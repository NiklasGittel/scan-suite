import { ChannelModel, connect } from "amqplib";

export const MQ_URL = process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672';

export const openConnection = async (setup?: (model: ChannelModel) => Promise<void>) => {
    const conn = await connect(MQ_URL, { recovery: { setup } });
    conn.on('disconnect', (err) => console.warn(`[amqp] disconnected: ${err.message}`));
    conn.on('reconnect-scheduled', ({ attempt, delay }) =>
    console.warn(`[amqp] reconnect #${attempt} in ${delay}ms`));
    return conn;
};
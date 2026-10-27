import type { ChannelModel, ConfirmChannel } from "amqplib";
import { openConnection } from "./connectionHandler";
import ensureExchangesInitialized, { SCANS_EXCHANGE } from "./topology";

let channel: ConfirmChannel | undefined;

const setup = async (model: ChannelModel) => {
    channel = await model.createConfirmChannel();
    await ensureExchangesInitialized(channel);
    channel.on('return', handleUnroutable);
}

const handleUnroutable = (msg: any) => {
    console.warn(`Message returned: ${msg.content.toString()}`);
};

export const publishScan = async (routingKey: string, body: unknown) => {
    if (!channel) throw new Error('RabbitMQ not connected');
    channel.publish(SCANS_EXCHANGE, routingKey, Buffer.from(JSON.stringify(body)), {
        mandatory: true,
        persistent: true,
    });
    await channel.waitForConfirms();
};

const connection = await openConnection(setup);
connection.on('disconnect', () => { channel = undefined; });


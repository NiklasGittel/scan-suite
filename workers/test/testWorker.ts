import { openConnection } from "../../mq/connectionHandler"
import { publishScan } from "../../mq/scanPublisher";
import ensureExchangesInitialized, { SCANS_DL_EXCHANGE, SCANS_EXCHANGE } from "../../mq/topology"
import type { Channel, ChannelModel, ConsumeMessage } from "amqplib"

const REQUESTED_QUEUE = "scans.test.requested";
const FINISHED_QUEUE = "scans.test.finished";
const DEAD_QUEUE = "scans.test.dead";

const setup = async (model: ChannelModel) => {
    const channel = await model.createChannel();
    await ensureExchangesInitialized(channel);
    await ensureQueuesRegistered(channel);
    await channel.close();

    await listen(model, REQUESTED_QUEUE, onConsumeRequested);
    await listen(model, FINISHED_QUEUE, onConsumeFinished);
    await listen(model, DEAD_QUEUE, onConsumeDead);
}

const listen = async (model: ChannelModel, queue: string, handler: (msg: ConsumeMessage | null, channel: Channel) => Promise<void>) => {
    const channel = await model.createChannel();
    await channel.prefetch(1);
    await channel.consume(queue, async (msg) => {
        await handler(msg, channel);
    }, { noAck: false });
}

const ensureQueuesRegistered = async (channel: Channel) => {
    await channel.assertQueue(REQUESTED_QUEUE, { durable: true, deadLetterExchange: SCANS_DL_EXCHANGE });
    await channel.bindQueue(REQUESTED_QUEUE, SCANS_EXCHANGE, "scans.test.requested");

    await channel.assertQueue(FINISHED_QUEUE, { durable: true, deadLetterExchange: SCANS_DL_EXCHANGE });
    await channel.bindQueue(FINISHED_QUEUE, SCANS_EXCHANGE, "scans.test.finished");

    await channel.assertQueue(DEAD_QUEUE, { durable: true });
    await channel.bindQueue(DEAD_QUEUE, SCANS_DL_EXCHANGE, "scans.test.#");
}

const onConsumeRequested = async (msg: ConsumeMessage | null, channel: Channel) => {
    if (!msg) return;
    console.log(`Received message: ${msg.content.toString()}`);
    if (msg.content.toString().includes("dead")) {
        channel.nack(msg, false, false);
        return;
    }
    await publishScan("scans.test.finished", { foo: "bar finished" });
    channel.ack(msg);
};

const onConsumeFinished = async (msg: ConsumeMessage | null, channel: Channel) => {
    if (!msg) return;
    console.log(`Received finished message: ${msg.content.toString()}`);
    channel.ack(msg);
};

const onConsumeDead = async (msg: ConsumeMessage | null, channel: Channel) => {
    if (!msg) return;
    console.log(`Received dead message: ${msg.content.toString()}`);
    channel.ack(msg);
};

await openConnection(setup);


import { Kafka } from "@upstash/kafka";

let kafkaClientInstance = null;

/**
 * Check whether Upstash Kafka credentials are configured in environment variables.
 */
export function isKafkaConfigured() {
  const url = process.env.UPSTASH_KAFKA_REST_URL;
  const username = process.env.UPSTASH_KAFKA_REST_USERNAME;
  const password = process.env.UPSTASH_KAFKA_REST_PASSWORD;

  return Boolean(url && username && password);
}

/**
 * Returns an initialized Upstash Kafka client instance or a simulation fallback.
 */
export function getKafkaClient() {
  if (kafkaClientInstance) {
    return kafkaClientInstance;
  }

  const url = process.env.UPSTASH_KAFKA_REST_URL;
  const username = process.env.UPSTASH_KAFKA_REST_USERNAME;
  const password = process.env.UPSTASH_KAFKA_REST_PASSWORD;

  if (url && username && password) {
    try {
      kafkaClientInstance = new Kafka({
        url,
        username,
        password,
      });
      return kafkaClientInstance;
    } catch (err) {
      console.error("[Kafka Client] Initialization failed:", err);
    }
  }

  // Graceful fallback / Mock producer for local development or unconfigured environments
  return {
    isMock: true,
    producer: () => ({
      produce: async (topic, message, options = {}) => {
        console.warn(
          `[Kafka Mock Producer] Message sent to topic '${topic}' (UPSTASH_KAFKA credentials not configured):`,
          {
            key: options.key,
            messagePreview: typeof message === "string" ? message.slice(0, 150) : message,
          }
        );
        return [
          {
            topic,
            partition: 0,
            offset: Date.now(),
            timestamp: Date.now(),
          },
        ];
      },
      produceMany: async (messages) => {
        console.warn(
          `[Kafka Mock Producer] Batch of ${messages.length} messages simulated (UPSTASH_KAFKA credentials not configured).`
        );
        return messages.map((m, idx) => ({
          topic: m.topic,
          partition: 0,
          offset: Date.now() + idx,
          timestamp: Date.now(),
        }));
      },
    }),
    consumer: () => ({
      consume: async () => [],
    }),
  };
}

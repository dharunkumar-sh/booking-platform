import crypto from "crypto";

export const KAFKA_TOPICS = {
  EVENTS_LIFECYCLE: "events.lifecycle",
  EVENTS_ENGAGEMENT: "events.engagement",
  BOOKINGS_TRANSACTIONS: "bookings.transactions",
  NOTIFICATIONS_DISPATCHER: "notifications.dispatcher",
};

export const EVENT_TYPES = {
  EVENT_CREATED: "EVENT_CREATED",
  EVENT_UPDATED: "EVENT_UPDATED",
  EVENT_DELETED: "EVENT_DELETED",
  EVENT_LIKED: "EVENT_LIKED",
  EVENT_UNLIKED: "EVENT_UNLIKED",
  EVENT_REVIEW_ADDED: "EVENT_REVIEW_ADDED",
  BOOKING_CREATED: "BOOKING_CREATED",
  BOOKING_CONFIRMED: "BOOKING_CONFIRMED",
  BOOKING_CANCELLED: "BOOKING_CANCELLED",
  USER_FORM_SUBMITTED: "USER_FORM_SUBMITTED",
};

export const DEFAULT_TOPIC_MAP = {
  [EVENT_TYPES.EVENT_CREATED]: KAFKA_TOPICS.EVENTS_LIFECYCLE,
  [EVENT_TYPES.EVENT_UPDATED]: KAFKA_TOPICS.EVENTS_LIFECYCLE,
  [EVENT_TYPES.EVENT_DELETED]: KAFKA_TOPICS.EVENTS_LIFECYCLE,
  [EVENT_TYPES.EVENT_LIKED]: KAFKA_TOPICS.EVENTS_ENGAGEMENT,
  [EVENT_TYPES.EVENT_UNLIKED]: KAFKA_TOPICS.EVENTS_ENGAGEMENT,
  [EVENT_TYPES.EVENT_REVIEW_ADDED]: KAFKA_TOPICS.EVENTS_ENGAGEMENT,
  [EVENT_TYPES.BOOKING_CREATED]: KAFKA_TOPICS.BOOKINGS_TRANSACTIONS,
  [EVENT_TYPES.BOOKING_CONFIRMED]: KAFKA_TOPICS.BOOKINGS_TRANSACTIONS,
  [EVENT_TYPES.BOOKING_CANCELLED]: KAFKA_TOPICS.BOOKINGS_TRANSACTIONS,
  [EVENT_TYPES.USER_FORM_SUBMITTED]: KAFKA_TOPICS.NOTIFICATIONS_DISPATCHER,
};

/**
 * Creates a standardized event envelope for publishing.
 */
export function createEventEnvelope({
  eventType,
  topic = null,
  entityId = null,
  payload = {},
  metadata = {},
  idempotencyKey = null,
}) {
  const resolvedTopic = topic || DEFAULT_TOPIC_MAP[eventType] || "events.lifecycle";
  const now = new Date();
  const resolvedKey =
    idempotencyKey ||
    `${eventType}-${entityId || "gen"}-${now.getTime()}-${crypto.randomBytes(4).toString("hex")}`;

  return {
    id: crypto.randomUUID(),
    idempotencyKey: resolvedKey,
    topic: resolvedTopic,
    eventType,
    entityId: entityId ? String(entityId) : null,
    version: "1.0",
    timestamp: now.toISOString(),
    payload,
    metadata: {
      source: "booking-platform-api",
      environment: process.env.NODE_ENV || "development",
      ...metadata,
    },
  };
}

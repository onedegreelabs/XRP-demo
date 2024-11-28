import { InjectQueue } from '@nestjs/bullmq';

export const EVENT_TICKET_NFT_QUEUE = 'EVENT_TICKET_NFT_QUEUE';
export const EVENT_TICKET_NFT_JOB = 'EVENT_TICKET_NFT_JOB';
export const InjectCreateEventTicketQueue = () =>
  InjectQueue(EVENT_TICKET_NFT_QUEUE);

export const EVENT_TICKET_NFT_SELL_OFFER_QUEUE =
  'EVENT_TICKET_NFT_SELL_OFFER_QUEUE';
export const EVENT_TICKET_NFT_SELL_OFFER_JOB =
  'EVENT_TICKET_NFT_SELL_OFFER_JOB';
export const InjectSellEventTicketQueue = () =>
  InjectQueue(EVENT_TICKET_NFT_SELL_OFFER_QUEUE);

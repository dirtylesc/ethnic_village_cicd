
export type MessageItem = {
  role: 'user' | 'assistant';
  content: string;
}

export type CacheData = {
  tour_list?: {
    tours: any[];
    query: string;
    count: number;
  } | null;
  available_dates?: {
    tour_id: string;
    tour_name: string;
    dates: any[];
    count: number;
  } | null;
  booking_info?: {
    booking_id: string;
    tour_id: string;
    tour_name: string;
    departure_date: string;
    adults: number;
    children: number;
    total_price: number;
    status: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
  } | null;
  payment_link?: {
    checkout_url: string;
    expires_at: string;
  } | null;
}

export type ChatRequest = {
  message: string;
  session_id?: string;
  history?: MessageItem[];
  cache?: CacheData;
}

export type ChatResponse = {
  response: string;
  session_id: string;
  cache: CacheData;
}

export type ChatHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
}

export type ChatHistoryResponse = {
  session_id: string;
  history: ChatHistoryItem[];
  count: number;
}

export type SessionResponse = {
  session_id: string;
  message: string;
}

export type HealthResponse = {
  status: string;
  version: string;
}

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export type ChatSession = {
  session_id: string;
  messages: Message[];
  last_updated: number;
}

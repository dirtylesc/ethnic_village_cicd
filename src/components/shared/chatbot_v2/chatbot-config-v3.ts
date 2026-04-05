export type ChatbotV3Config = {
  apiUrl: string;
  title: string;
  placeholder: string;
  welcomeMessage: string;
  errorMessage: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: {
    primaryColor: string;
    textColor: string;
    backgroundColor: string;
    borderColor: string;
  };
  sessionConfig: {
    maxMessages: number;
    storageKey: string;
  };
}

export const defaultChatbotV3Config: ChatbotV3Config = {

  apiUrl: process.env.NEXT_PUBLIC_CHATBOT_V2_API_URL || 'http://localhost:8000/api',
  title: 'Trợ lý Du lịch AI',
  placeholder: 'Hỏi về tour du lịch làng dân tộc...',
  welcomeMessage:
    'Xin chào! Tôi là trợ lý AI chuyên về du lịch dân tộc thiểu số Việt Nam. Tôi có thể giúp bạn:\n\n• Tìm kiếm tour du lịch\n• Tư vấn về văn hóa, phong tục dân tộc\n• Hỗ trợ đặt tour và thanh toán\n• Trả lời câu hỏi về địa điểm, giá cả\n\nBạn muốn biết điều gì?',
  errorMessage: '❌ Xin lỗi, có lỗi xảy ra khi kết nối với trợ lý AI. Vui lòng thử lại.',
  position: 'bottom-right',
  theme: {
    primaryColor: 'bg-emerald-600',
    textColor: 'text-gray-800',
    backgroundColor: 'bg-white',
    borderColor: 'border-gray-200',
  },
  sessionConfig: {
    maxMessages: 50,
    storageKey: 'chatbot_v3_session',
  },
};

export const getChatbotPosition = (position: ChatbotV3Config['position']) => {
  switch (position) {
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'top-right':
      return 'top-4 right-4';
    case 'top-left':
      return 'top-4 left-4';
    default:
      return 'bottom-4 right-4';
  }
};

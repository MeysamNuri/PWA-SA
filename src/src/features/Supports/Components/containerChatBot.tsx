import AjaxLoadingComponent from '@/core/components/ajaxLoadingComponent';
import { useUserSerialStore } from '@/core/zustandStore';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import chatbotConfig from "@/core/constant/chatBotConfig.json";
// Define the shape of the chatbot configuration object using a TypeScript interface.
interface ChatbotConfig {
  baseUrl: string;
  baseUrlApi: string;
  baseUrl_script: string;
  token: string;
  baseUrlApiChatBot: string;
  serial?: string;
}

declare global {
  interface Window {
    WebChat?: {
      selfMount: (config: {
        faq: boolean;
        zIndex: number;
        baseUrl: string;
        baseUrlApi: string;
        token: string;
        baseUrlApiChatBot: string;
        // Added the 'serial' property to the selfMount configuration.
        serial?: string;
      }, selector: string) => void;
    };
  }
}


const ChatBotContainer: React.FC = () => {
  const userSerial = useUserSerialStore((state) => state.userSerial)

  const chatbotInfo: ChatbotConfig = {
    baseUrl: chatbotConfig.baseUrl,
    baseUrlApi: chatbotConfig.baseUrlApi,
    baseUrl_script: chatbotConfig.baseUrl_script,
    token: chatbotConfig.token,
    baseUrlApiChatBot: chatbotConfig.baseUrlApiChatBot,
    serial: userSerial ?? ""
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `${chatbotInfo.baseUrl_script}/app.bundle.js`;
    script.async = true;

    script.onload = () => {

      if (window.WebChat && typeof window.WebChat.selfMount === 'function') {
     
        window.WebChat.selfMount(
          {
            faq: true,
            zIndex: 9999999999,
            baseUrl: chatbotInfo.baseUrl,
            baseUrlApi: chatbotInfo.baseUrlApi,
            token: chatbotInfo.token,
            baseUrlApiChatBot: chatbotInfo.baseUrlApiChatBot,
            serial: chatbotInfo.serial 
          },
          '#contanerForChatBot'
        );
      }
    };

    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (

    <Box id="contanerForChatBot" sx={{ width: '100%', height: 'calc(100vh - 61px)' }}>
      <AjaxLoadingComponent />
    </Box>
  );
};

export default ChatBotContainer;

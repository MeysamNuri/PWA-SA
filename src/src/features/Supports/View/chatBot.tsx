import InnerPageHeader from '@/core/components/innerPagesHeader';
import ChatBotContainer from '../Components/containerChatBot'
import { Box } from '@mui/material';


export default function ChatBot() {


    return (
        <Box>
            <InnerPageHeader title="چت آنلاین" path="/supports" />
            <ChatBotContainer />
        </Box>


    );
}

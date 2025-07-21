import { Stack, Button } from '@mui/material';
import Box from '../../components/atoms/Box';
import { Textarea } from '@mui/joy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Text } from '../../components/atoms/Typography';
import { ChatMessage, UserSection } from './interface.type';
import { useState } from 'react';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import CustomBtn from '../../components/atoms/CustomBtn';

interface ChatProps {
    chat: ChatMessage[];
    sendMessage: (chat: ChatMessage) => void;
    isLargeChat: boolean;
    setIsLargeChat: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chat = ({ chat, isLargeChat, sendMessage, setIsLargeChat }: ChatProps) => {
    const [message, setMessage] = useState<string>('');

    return (
        <Stack display={'flex'} flexDirection={'column'} gap={2} flex={1} p={2}>
            <Stack
                flexDirection={'row'}
                width={'-webkit-fill-available'}
                justifyContent={'flex-end'}
            >
                <CustomBtn onClick={() => setIsLargeChat(!isLargeChat)}>
                    {isLargeChat ? (
                        <ZoomInMapIcon
                            fontSize="small"
                            sx={{
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        />
                    ) : (
                        <ZoomOutMapIcon
                            fontSize="small"
                            sx={{
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        />
                    )}
                </CustomBtn>
            </Stack>
            <Stack
                flex={1}
                display={'flex'}
                flexDirection={'column'}
                gap={2}
                sx={{ overflowY: 'scroll' }}
            >
                {chat.map((discussion) => (
                    <Text
                        sx={{
                            alignSelf:
                                discussion.user === UserSection.Ia ? 'flex-start' : 'flex-end',
                            paddingY: 1,
                            paddingX: 2,
                            borderRadius: 4,
                            backgroundColor:
                                discussion.user === UserSection.Ia
                                    ? 'initial'
                                    : (th) => th.palette.grey['100'],
                        }}
                    >
                        {discussion.message}
                    </Text>
                ))}
            </Stack>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    backgroundColor: (th) => th.palette.grey['100'],
                    minHeight: '50px',
                    maxHeight: '200px',
                    width: '-webkit-fill-available',
                    padding: 1,
                    gap: 0.5,
                }}
            >
                <Textarea
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    placeholder="Write your message..."
                    sx={{
                        paddingX: 2,
                        border: 0,
                        maxHeight: '-webkit-fill-available',
                        width: '-webkit-fill-available',
                        backgroundColor: (th) => th.palette.grey?.['100'],
                        '& .Mui-focused': {
                            border: 0,
                        },
                    }}
                />
                <Button
                    size="small"
                    color="info"
                    variant="contained"
                    sx={{
                        // p: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '14px',
                        width: '120px',
                    }}
                    startIcon={<FontAwesomeIcon icon={faArrowUp} />}
                    onClick={() => {
                        sendMessage({ user: UserSection.User, message });
                        setMessage('');
                    }}
                >
                    Send
                </Button>
            </Box>
        </Stack>
    );
};

export default Chat;

import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { DragIndicator } from '@mui/icons-material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@/core/components/icons';
import { useThemeContext } from '@/core/context/useThemeContext';
import type { HomeCustomizationItem } from '../types';

interface CustomizationItemProps {
    item: HomeCustomizationItem;
    onToggle: (pageId: string) => void;
}

export default function CustomizationItem({ item, onToggle }: CustomizationItemProps) {
    const { palette } = useTheme();
    const { isDarkMode } = useThemeContext();
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.pageId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleClick = () => {
        onToggle(item.pageId);
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
            sx={{
                backgroundColor: palette.background.paper,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': {
                    backgroundColor: palette.action.hover,
                }
            }}
        >
            {/* Drag Handle */}
            <Box
                {...attributes}
                {...listeners}
                sx={{
                    cursor: 'grab',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                    borderRadius: '4px',
                    touchAction: 'none',
                    '&:active': {
                        cursor: 'grabbing',
                    },
                    '&:hover': {
                        backgroundColor: palette.action.hover,
                    }
                }}
            >
                <DragIndicator 
                    sx={{ 
                        color: palette.text.secondary,
                        fontSize: 20 
                    }} 
                />
            </Box>

            {/* Title */}
            <Typography
                variant="body1"
                sx={{
                    fontSize: '14px',
                    fontWeight: 400,
                    color: palette.text.primary,
                    flex: 1,
                    textAlign: 'right',
                    direction: 'rtl',
                    cursor: 'pointer',
                    marginX: 2
                }}
                onClick={handleClick}
            >
                {item.persianTitle}
            </Typography>
            
            {/* Toggle Button */}
            <IconButton
                size="small"
                onClick={handleClick}
                sx={{
                    '&:hover': {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <Icon 
                    name={item.isEnabled ? 'truecheckbox' : 'falsecheckbox'} 
                    isDarkMode={isDarkMode}
                    width={16.5} 
                    height={16.5} 
                />
            </IconButton>
        </Box>
    );
}

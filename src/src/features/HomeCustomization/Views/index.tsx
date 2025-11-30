import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useHomeCustomization } from '../Hooks/useHomeCustomization';
import CustomizationItem from '../Components/CustomizationItem';
import InnerPageHeader from '@/core/components/innerPagesHeader';
import AjaxLoadingComponent from '@/core/components/ajaxLoadingComponent';

export default function HomeCustomizationView() {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const { customizationItems, isLoading, error, toggleItem, reorderItems, saveCustomization, isUpdating } = useHomeCustomization();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            reorderItems(active.id as string, over.id as string);
        }
    };

    const handleSave = async () => {
        await saveCustomization();
        navigate('/home');
    };

    if (isLoading) return <AjaxLoadingComponent />;

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: palette.background.default,
                    padding: 2
                }}
            >
                <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                    خطا در بارگذاری اطلاعات
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                backgroundColor: palette.background.default,
                minHeight: '100vh'
            }}
        >
            <InnerPageHeader 
                title="سفارشی سازی خانه" 
                path="/user-profile" 
            />

            <Box sx={{  padding: 2 }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={customizationItems.map(item => item.pageId)}
                        strategy={verticalListSortingStrategy}
                    >
                        {customizationItems.map((item) => (
                            <CustomizationItem
                                key={item.pageId}
                                item={item}
                                onToggle={toggleItem}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </Box>
            {/* Save Button */}
            <br />
            <br />
            <br />
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    display: 'flex',
                    justifyContent: 'center',
                
                }}
            >
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleSave}
                    disabled={isUpdating}
                    sx={{
                        width: '100%',
                        maxWidth: "800px",
                        height: 40,
                        borderRadius: 2,
                        fontSize: '16px',
                        fontWeight: 600,
                        backgroundColor:"#b50404",
                    }}
                >
                    {isUpdating ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
                </Button>
            </Box>
        </Box>
    );
}

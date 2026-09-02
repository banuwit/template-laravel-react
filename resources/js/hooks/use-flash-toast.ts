import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

// A stable id makes a new flash toast replace whatever the previous one
// left on screen instead of stacking on top of it.
const FLASH_TOAST_ID = 'flash-toast';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            if (data.type === 'default') {
                toast(data.message, { id: FLASH_TOAST_ID });

                return;
            }

            toast[data.type](data.message, { id: FLASH_TOAST_ID });
        });
    }, []);
}

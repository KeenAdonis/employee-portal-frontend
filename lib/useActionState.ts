import { useState } from "react";

type AsyncAction<T = void> = () => Promise<T> | T;

export function useActionState() {
    const [loading, setLoading] = useState<boolean>(false);

    const run = async (action: AsyncAction) => {
        if (loading) return;

        try {
            setLoading(true);
            await action();
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        run,
    };
}
import { useState } from "react";

export const useSelectedRow = (array: any[]) => {
    const [test, setTest] = useState<number[]>([]);

    const handleTest = () => {
        setTest([]);
    }

    return [handleTest] as const;
};

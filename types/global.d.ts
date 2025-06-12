interface ResponsiveVoice {
    speak: (text: string, voice?: string, options?: Record<string, unknown>) => void;
    pause: () => void;
    resume: () => void;
    cancel: () => void;
}

interface Window {
    responsiveVoice?: ResponsiveVoice;
}
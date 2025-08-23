import { useState, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadAudio } from '../protocol/api';

export enum RecorderState {
    Idle = 'idle',
    Recording = 'recording',
    Paused = 'paused',
    Stopped = 'stopped',
}

interface UseAudioRecorderProps {
    stepRecorder?: number;
}

export const useAudioRecorder = ({ stepRecorder: stepRecorderProps }: UseAudioRecorderProps) => {
    const [sectionId, setSectionId] = useState<string>('');
    const [state, setState] = useState<RecorderState>(RecorderState.Idle);
    const [stepRecorder, setStepRecorder] = useState<number>(stepRecorderProps || 1);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const sendAudio = useMutation({
        mutationFn: async (audioBlob: Blob) => {
            console.log('@@audioBlob:', audioBlob);
            console.log('@@audioBlob size:', audioBlob.size);
            console.log('@@audioBlob type:', audioBlob.type);

            const formData = new FormData();

            formData.append('audio', audioBlob, `${stepRecorder}.webm`);
            formData.append('sectionId', sectionId);
            formData.append('index', stepRecorder.toString());

            // Debug FormData
            console.log('@@formData entries:');
            for (const [key, value] of Array.from(formData.entries())) {
                console.log(key, value);
            }

            const res = await uploadAudio(formData);

            // Axios retourne directement la réponse
            console.log('@@sendAudio - response:', res);
            return res.data;
        },
        onSuccess: (data) => {
            console.log('✅ Audio envoyé avec succès:', data);
        },
        onError: (err) => {
            console.error('❌ Erreur upload audio :', err);
        },
    });

    const startRecording = useCallback(
        async (sectionId: string) => {
            setSectionId(sectionId);

            if (state === 'recording') {
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: { channelCount: 1, sampleRate: 44100 },
                });

                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                chunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    console.log('@@dataavailable - size:', event.data.size);
                    if (event.data.size > 0) {
                        chunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    console.log('@@onstop - chunks count:', chunksRef.current.length);
                    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                    console.log('@@onstop - final blob size:', audioBlob.size);
                    sendAudio.mutate(audioBlob);
                };

                mediaRecorder.start();
                setState(RecorderState.Recording);
                console.log('🎙️ Enregistrement démarré');
            } catch (err) {
                console.error('Erreur démarrage micro :', err);
            }
        },
        [state],
    );

    const pauseRecording = useCallback(() => {
        if (!mediaRecorderRef.current || state !== RecorderState.Recording) {
            return;
        }

        mediaRecorderRef.current.pause();
        setState(RecorderState.Paused);
        console.log('⏸️ Enregistrement en pause');
    }, [state]);

    const resumeRecording = useCallback(() => {
        if (!mediaRecorderRef.current || state !== RecorderState.Paused) {
            return;
        }

        mediaRecorderRef.current.resume();
        setState(RecorderState.Recording);
        console.log('▶️ Enregistrement repris');
    }, [state]);

    const stopRecording = useCallback(() => {
        if (!mediaRecorderRef.current) {
            return;
        }

        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
        setState(RecorderState.Stopped);
        console.log('⏹️ Enregistrement arrêté');
    }, []);

    return {
        state,
        stepRecorder,
        setStepRecorder,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
    };
};

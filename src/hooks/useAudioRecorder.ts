import { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createTempFile, sendToTranscriptionQueue } from '../protocol/api';

export enum RecorderState {
    Idle = 'idle',
    CreatingSection = 'creatingSection',
    Recording = 'recording',
    Paused = 'paused',
    Stopped = 'stopped',
}

interface UseAudioRecorderProps {
    stepRecorder?: number;
}

export const useAudioRecorder = ({
    stepRecorder: stepRecorderFromLocalStorage,
}: UseAudioRecorderProps) => {
    const [sectionId, setSectionId] = useState<string>('');
    const [state, setState] = useState<RecorderState>(RecorderState.Idle);
    const [stepRecorder, setStepRecorder] = useState<number>(stepRecorderFromLocalStorage || 0);
    const [isStopped, setIsStopped] = useState<boolean>(false);
    const isLastPageRef = useRef<boolean>(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const sendAudio = useMutation({
        mutationFn: async ({ audioBlob, isLastPage }: { audioBlob: Blob; isLastPage: boolean }) => {
            console.debug('@@audioBlob size:', audioBlob.size);

            const audioBase64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    const base64 = result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(audioBlob);
            });

            const createTempFileRes = await createTempFile({
                sectionId,
                index: stepRecorder,
                filename: `${stepRecorder}.webm`,
            });

            console.log('@@createTempFile:', createTempFileRes);

            await sendToTranscriptionQueue({
                audio_base64: audioBase64,
                audio_format: 'webm',
                tmp_file_id: createTempFileRes.fileId,
                is_last_page: isLastPage,
            });

            if (isLastPage) {
                setSectionId('');
            }
        },
        onSuccess: (data) => {
            console.log('Transcription démarrée en arrière-plan');
            console.log('data:', data);
            console.log('✅ Audio envoyé avec succès');
            setStepRecorder(stepRecorder + 1);
        },
        onError: (err) => {
            console.error('❌ Erreur upload audio :', err);
        },
    });

    const sendCurrentAudio = useCallback(
        ({ isLastPage }: { isLastPage: boolean }) => {
            const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
            console.log(`📦 Création du Blob audio final - taille: ${audioBlob.size} bytes`);
            sendAudio.mutate({ audioBlob, isLastPage });
            chunksRef.current = [];
        },
        [sendAudio],
    );

    const startRecording = useCallback(
        async ({ sectionId }: { sectionId: string }) => {
            setSectionId(sectionId);

            if (state === RecorderState.Recording) {
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
                    console.log('@@onstop');
                    sendCurrentAudio({ isLastPage: isLastPageRef.current });
                    if (!isLastPageRef.current) {
                        setIsStopped(true);
                    }
                    setStepRecorder(0);
                };

                mediaRecorder.start();

                setState(RecorderState.Recording);
                console.log('🎙️ Enregistrement démarré');
            } catch (err) {
                console.error('Erreur démarrage micro :', err);
            }
        },
        [state, sendCurrentAudio],
    );

    const stopRecording = useCallback(({ isLastPage }: { isLastPage?: boolean }) => {
        if (!mediaRecorderRef.current) {
            return;
        }

        isLastPageRef.current = isLastPage || false;

        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
        setState(RecorderState.Idle);
        console.log('⏹️ Enregistrement arrêté');
    }, []);

    const clearRecorder = useCallback(() => {
        setSectionId('');
        setStepRecorder(0);
        setState(RecorderState.Idle);

        if (!mediaRecorderRef.current) {
            return;
        }
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
        setState(RecorderState.Idle);
        console.log('⏹️ Enregistrement annulé');
    }, []);

    // Méthode pour libérer uniquement le micro sans affecter l'état
    const releaseMicrophone = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach((track) => {
                track.stop();
                console.log('🎤 Micro libéré:', track.kind);
            });
            mediaRecorderRef.current = null;
            console.log('🎤 Micro complètement libéré');
        }
    }, []);

    useEffect(() => {
        if (state === RecorderState.Stopped) {
            console.log('@@releasing microphone');
            mediaRecorderRef.current = null;
            // releaseMicrophone();
        }
    }, [state, releaseMicrophone]);

    return {
        isStopped,
        state,
        startRecording,
        stopRecording,
        setIsStopped,
        setState,
        clearRecorder,
        releaseMicrophone,
        sectionId,
        setSectionId,
    };
};

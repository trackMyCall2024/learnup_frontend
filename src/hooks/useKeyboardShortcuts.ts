import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setNavbarEnlarged } from '../store/global';
import { globalSelector, State } from '../store/selector';
import { userSelector } from '../store/selector';

export const useKeyboardShortcuts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const global = useSelector<State, any>(globalSelector);
    const user = useSelector<State, any>(userSelector);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {

            // cmd + k
            if (e.key === 'k' && e.metaKey) {   
                dispatch(setNavbarEnlarged(!global.navbar.isEnlarged));
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [dispatch, navigate, global.navbar.isEnlarged, user._id]);
};

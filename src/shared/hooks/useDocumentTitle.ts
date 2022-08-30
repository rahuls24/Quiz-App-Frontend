import { useEffect, useRef } from 'react';

function useDocumentTitle(title: string, prevailOnUnmount = false) {
    const defaultTitle = useRef('Quiz App');

    useEffect(() => {
        document.title = title;
    }, [title]);

    useEffect(
        () => () => {
            if (!prevailOnUnmount) {
                document.title = defaultTitle.current;
            }
        },
        // eslint-disable-next-line
        []
    );
}

export default useDocumentTitle;

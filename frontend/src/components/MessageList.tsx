import React, { useCallback, useEffect } from 'react';
import { IMessage } from '../types/message';

type Props = {
  messages: IMessage[];
  messageListRef: React.RefObject<HTMLDivElement>;
};

const MessageList = ({ messages, messageListRef }: Props) => {
  const scroll = useCallback(() => {
    const { offsetHeight, scrollHeight, scrollTop } =
      messageListRef.current as HTMLDivElement;

    if (scrollHeight <= scrollTop + offsetHeight + 100) {
      messageListRef.current?.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messageListRef]);

  useEffect(() => {
    scroll();
  }, [messages, scroll]);

  return (
    <div
      ref={messageListRef}
      className='flex flex-col gap-2 overflow-auto max-h-[400px]'
    >
      {' '}
      {messages.map((message, index) => (
        <div
          key={message.text + index}
          className='flex flex-col justify-evenly w-52 px-2 py-1 border-[1px] rounded border-black'
        >
          <div className='flex'>
            <span className='font-medium'>{message.name}</span>: {message.text}
          </div>
          <div className='text-right text-xs'>
            {message.date.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;

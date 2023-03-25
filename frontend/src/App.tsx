import { useEffect, useRef, useState } from 'react';
import './App.css';
import MessageList from './components/MessageList';
import { IMessage } from './types/message';
import io from 'socket.io-client';
import { socketAPI } from './constants';

const messageInit = {
  name: '',
  text: '',
  date: new Date(),
};

const socket = io(socketAPI, { autoConnect: true });

function App() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState<IMessage>(messageInit);

  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected');
    });

    socket.on('receive_message', (receivedMessage) => {
      setMessages((prev) => [
        ...prev,
        { ...receivedMessage, date: new Date(receivedMessage.date) },
      ]);
    });

    return () => {
      socket.off('connect');
      socket.off('receive_message');
    };
  }, []);

  const onMessageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMessage({ ...newMessage, [name]: value });
  };

  const onSendHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newMessage.name && newMessage.text) {
      setMessages([...messages, { ...newMessage, date: new Date() }]);
      socket.emit('send_message', { ...newMessage, date: new Date() });
      setNewMessage((prev) => ({ ...prev, text: '' }));
    }
  };

  return (
    <form
      onSubmit={onSendHandler}
      className='flex flex-col justify-center items-center gap-[5px]'
    >
      <input
        type='text'
        className='w-fit border-[1px] rounded text-center border-black focus:outline-none'
        placeholder='Your name'
        name='name'
        value={newMessage.name}
        onChange={onMessageHandler}
      />
      <input
        className='w-fit border-[1px] rounded text-center border-black focus:outline-none'
        type='text'
        name='text'
        placeholder='Your message'
        required
        value={newMessage.text}
        onChange={onMessageHandler}
      />
      <button
        className='w-fit px-1 rounded border-[1px] border-black'
        type='submit'
      >
        Send
      </button>
      <MessageList messageListRef={messageListRef} messages={messages} />
    </form>
  );
}

export default App;

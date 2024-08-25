import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importerar useNavigate för att navigera till login

const sanitizeText = (text) => {
  const element = document.createElement('div');
  element.innerText = text;
  return element.innerHTML;
};

const Chat = ({ token, setToken, userId }) => { // Tar emot setToken som en prop
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [activeConversation, setActiveConversation] = useState(localStorage.getItem('conversationId') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [conversations, setConversations] = useState(JSON.parse(localStorage.getItem('conversations')) || []);
  const navigate = useNavigate(); // Definierar navigate

  const [fakeChat, setFakeChat] = useState([
    {
      "text": "Tjena Mike, hur mår du?",
      "avatar": "https://i.pravatar.cc/100",
      "username": "Koshin",
      "userId": "fakeId1",
      "conversationId": null
    },
    {
      "text": "Det är bara bra hur mår du?",
      "avatar": "https://i.pravatar.cc/100",
      "username": "Mike",
      "userId": "fakeId1",
      "conversationId": null
    },
    {
      "text": "Det är bara bra tack!",
      "avatar": "https://i.pravatar.cc/101",
      "username": "Koshin",
      "userId": userId,
      "conversationId": null
    }
  ]);

  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://chatify-api.up.railway.app/messages?conversationId=${activeConversation}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Kunde inte hämta meddelanden');

        const messagesData = await response.json();
        setMessages(messagesData);
        localStorage.setItem('messages', JSON.stringify(messagesData));

        const conversationExists = conversations.some((convo) => convo.id === activeConversation);
        if (!conversationExists) {
          const newConversation = {
            id: activeConversation,
            name: 'Ny konversation',
          };
          const updatedConversations = [...conversations, newConversation];
          setConversations(updatedConversations);
          localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        }
      } catch (error) {
        setError('Kunde inte hämta meddelanden');
      }
    };

    fetchMessages();
  }, [activeConversation, token, conversations]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sanitizeText(newMessage),
          conversationId: activeConversation,
        }),
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte skickas');

      const { latestMessage } = await response.json();
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { ...latestMessage, userId, username }];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      setNewMessage('');
    } catch (error) {
      setError('Meddelandet kunde inte skickas');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte raderas');

      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.filter((message) => message.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      setError('Meddelandet kunde inte raderas');
    }
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation.id);
    localStorage.setItem('conversationId', conversation.id);
  };

  const handleLogout = () => {
    // Rensa all lokal lagring och logga ut användaren
    localStorage.clear();
    setToken(''); // Nollställ token
    navigate('/login'); // Skicka användaren till inloggningssidan
  };

  return (
    <div className="container-fluid d-flex flex-column min-vh-100" style={{ backgroundImage: "url('/src/components/Assets/ChatBackground.svg')" }}>
      {/* Logga ut knapp för enklare enkel använding, ENBART FÖR DEGEN */}
      <button className="btn btn-danger mb-3 align-self-end" onClick={handleLogout}>
        Logga ut
      </button>
      
      <div className="row flex-grow-1">
        <div className="col-md-12 d-flex flex-column">
          <h2 className="mb-4">Chat: {conversations.find((convo) => convo.id === activeConversation)?.name || ''}</h2>
          <div className="flex-grow-1 overflow-auto bg-white p-3 rounded">
            <div className="d-flex flex-column gap-2">
              {fakeChat.map((message, index) => (
                <div
                  key={index}
                  className={`d-flex ${message.userId?.toString() === userId?.toString() ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div className={`d-flex align-items-start ${message.userId?.toString() === userId?.toString() ? 'flex-row-reverse' : ''}`}>
                    <img src={message.avatar} alt="avatar" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                    <div className={`p-2 rounded ${message.userId?.toString() === userId?.toString() ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
                      <div className="fw-bold">{message.username}</div>
                      <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeText(message.text) }}></p>
                    </div>
                  </div>
                </div>
              ))}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`d-flex ${message.userId?.toString() === userId?.toString() ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div className={`d-flex align-items-start ${message.userId?.toString() === userId?.toString() ? 'flex-row-reverse' : ''}`}>
                    <img src={message.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                    <div className={`p-2 rounded ${message.userId?.toString() === userId?.toString() ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
                      <div className="fw-bold">{message.username}</div>
                      <p className="mb-0" dangerouslySetInnerHTML={{ __html: sanitizeText(message.text) }}></p>
                      {message.userId?.toString() === userId?.toString() && (
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="btn btn-link text-danger ms-2"
                        >
                          Radera
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex mt-4">
            <input
              id="newMessageInput"
              name="newMessage"
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Skriv ett meddelande..."
              className="form-control me-2"
            />
            <button
              onClick={handleSendMessage}
              className="btn btn-success"
            >
              Skicka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

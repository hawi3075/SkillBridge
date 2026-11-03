import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { chatApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import { MessageSquare, Send, Check, CheckCheck, Circle, User } from 'lucide-react';

export const ChatPage = () => {
  const { user } = useAuth();
  const { socket, isUserOnline } = useSocket();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const queryConvId = searchParams.get('conversationId');

  // Load conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await chatApi.getConversations();
      if (res.success) {
        const convs = res.data || [];
        setConversations(convs);

        // Select initial conversation
        if (queryConvId) {
          const found = convs.find(c => c.id === queryConvId);
          if (found) selectConversation(found);
          else if (convs.length > 0) selectConversation(convs[0]);
        } else if (convs.length > 0) {
          selectConversation(convs[0]);
        }
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Socket listener registrations
  useEffect(() => {
    if (!socket || !activeConversation) return;

    // Join room
    socket.emit('join_conversation', { conversationId: activeConversation.id });

    // Handle new incoming messages
    const handleNewMessage = (msg) => {
      if (msg.conversationId === activeConversation.id) {
        setMessages(prev => [...prev, msg]);
        scrollToBottom();
      }
    };

    // Handle typing events
    const handleUserTyping = (data) => {
      if (data.conversationId === activeConversation.id && data.userId !== user.id) {
        setPartnerTyping(data.isTyping);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.emit('leave_conversation', { conversationId: activeConversation.id });
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, activeConversation, user]);

  const selectConversation = async (conv) => {
    setActiveConversation(conv);
    setSearchParams({ conversationId: conv.id });
    try {
      const res = await chatApi.getMessages(conv.id);
      if (res.success) {
        setMessages(res.data || []);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (!socket || !activeConversation) return;

    // Emit typing start
    socket.emit('typing_start', { conversationId: activeConversation.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { conversationId: activeConversation.id });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation) return;

    const content = inputMessage.trim();
    setInputMessage('');

    if (socket) {
      socket.emit('typing_stop', { conversationId: activeConversation.id });
      // Send real-time via socket
      socket.emit('send_message', { conversationId: activeConversation.id, content });
    } else {
      // HTTP API fallback
      try {
        const res = await chatApi.sendMessage(activeConversation.id, content);
        if (res.success) {
          setMessages(prev => [...prev, res.data]);
          scrollToBottom();
        }
      } catch (err) {
        showToast('Failed to send message', 'error');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold text-dark mb-0">Messages & Real-Time Chat</h4>
          <span className="text-muted small">Collaborate with your matched skill exchange partners.</span>
        </div>
      </div>

      <div className="chat-window shadow-sm">
        {/* Left: Conversation List */}
        <div className="border-end d-flex flex-column" style={{ width: '300px', minWidth: '260px' }}>
          <div className="p-3 border-bottom bg-white fw-bold small text-dark d-flex align-items-center justify-content-between">
            <span>Conversations</span>
            <span className="badge bg-light text-muted border">{conversations.length}</span>
          </div>

          <div className="overflow-auto flex-grow-1" style={{ maxHeight: 'calc(100vh - 270px)' }}>
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted small">
                No active conversations. Accept an exchange proposal to start chatting!
              </div>
            ) : (
              conversations.map((c) => {
                const partner = c.partner || {};
                const isSelected = activeConversation?.id === c.id;
                const isOnline = partner.id ? isUserOnline(partner.id) : false;

                return (
                  <div
                    key={c.id}
                    onClick={() => selectConversation(c)}
                    className={`p-3 border-bottom d-flex align-items-center gap-3 cursor-pointer ${isSelected ? 'bg-primary-subtle' : 'bg-white'}`}
                    style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                  >
                    <div className="position-relative flex-shrink-0">
                      <img
                        src={partner.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.username || 'user'}`}
                        alt={partner.fullName || partner.username}
                        className="rounded-circle border"
                        style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                      />
                      <span
                        className="position-absolute bottom-0 end-0 rounded-circle border border-white"
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: isOnline ? '#10B981' : '#94A3B8'
                        }}
                        title={isOnline ? 'Online' : 'Offline'}
                      ></span>
                    </div>

                    <div className="overflow-hidden flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold small text-dark text-truncate">
                          {partner.fullName || partner.username}
                        </span>
                        {c.unreadCount > 0 && (
                          <span className="badge rounded-pill bg-primary" style={{ fontSize: '0.65rem' }}>
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="text-muted small text-truncate" style={{ fontSize: '0.78rem' }}>
                        {c.lastMessage?.content || 'Started conversation'}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Message Window */}
        {activeConversation ? (
          <div className="d-flex flex-column flex-grow-1 bg-white">
            {/* Active Header */}
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-white">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={activeConversation.partner?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation.partner?.username}`}
                  alt={activeConversation.partner?.fullName}
                  className="rounded-circle border"
                  style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                />
                <div>
                  <div className="fw-bold text-dark small">{activeConversation.partner?.fullName || activeConversation.partner?.username}</div>
                  <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
                    <Circle
                      size={8}
                      fill={isUserOnline(activeConversation.partner?.id) ? '#10B981' : '#94A3B8'}
                      color={isUserOnline(activeConversation.partner?.id) ? '#10B981' : '#94A3B8'}
                    />
                    <span>{isUserOnline(activeConversation.partner?.id) ? 'Active now' : 'Offline'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message History Bubble Container */}
            <div className="chat-messages-container flex-grow-1">
              {messages.length === 0 ? (
                <div className="text-center text-muted small py-5">
                  Say hello! Coordinate your first learning session together.
                </div>
              ) : (
                messages.map((m) => {
                  const isOutgoing = m.senderId === user?.id;
                  const time = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div
                      key={m.id}
                      className={`message-bubble ${isOutgoing ? 'message-outgoing' : 'message-incoming'}`}
                    >
                      <div>{m.content}</div>
                      <div
                        className={`d-flex align-items-center gap-1 mt-1 justify-content-end ${isOutgoing ? 'text-white-50' : 'text-muted'}`}
                        style={{ fontSize: '0.68rem' }}
                      >
                        <span>{time}</span>
                        {isOutgoing && (
                          m.isRead ? <CheckCheck size={13} color="#FFFFFF" /> : <Check size={13} />
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Partner Typing Indicator */}
              {partnerTyping && (
                <div className="text-muted small fst-italic mb-2" style={{ fontSize: '0.8rem' }}>
                  {activeConversation.partner?.fullName || 'Partner'} is typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-top bg-white d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="btn btn-primary d-inline-flex align-items-center gap-1 px-3">
                <Send size={16} />
                <span className="d-none d-sm-inline">Send</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center flex-grow-1 text-muted small p-4">
            Select a conversation on the left to start messaging.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

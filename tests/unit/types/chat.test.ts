import { Chat, ChatMessage, ChatCount } from '../../../src/types/chat';
import { test, expect, describe } from 'bun:test';

describe('Chat Types', () => {
  describe('ChatMessage interface', () => {
    test('should accept valid ChatMessage object', () => {
      const message: ChatMessage = {
        chatter: 'test@example.com',
        text: 'Hello world',
        date: 1623456789,
        is_from_me: 1,
        handle_id: 123
      };
      
      expect(message.chatter).toBe('test@example.com');
      expect(message.text).toBe('Hello world');
      expect(message.date).toBe(1623456789);
      expect(message.is_from_me).toBe(1);
      expect(message.handle_id).toBe(123);
    });
    
    test('should work with minimal required properties', () => {
      const message: ChatMessage = {
        chatter: 'test@example.com',
        text: 'Hello world'
      };
      
      expect(message.chatter).toBe('test@example.com');
      expect(message.text).toBe('Hello world');
    });
  });
  
  describe('Chat interface', () => {
    test('should accept valid Chat object', () => {
      const chat: Chat = {
        name: 'chat123',
        friendlyName: 'Group Chat',
        chat_identifier: 'chat123',
        display_name: 'Group Chat'
      };
      
      expect(chat.name).toBe('chat123');
      expect(chat.friendlyName).toBe('Group Chat');
      expect(chat.chat_identifier).toBe('chat123');
      expect(chat.display_name).toBe('Group Chat');
    });
    
    test('should accept Chat object with null friendlyName', () => {
      const chat: Chat = {
        name: '+11234567890',
        friendlyName: null
      };
      
      expect(chat.name).toBe('+11234567890');
      expect(chat.friendlyName).toBeNull();
    });
  });
  
  describe('ChatCount interface', () => {
    test('should accept valid ChatCount object', () => {
      const chatCount: ChatCount = {
        friendlyName: 'John Doe',
        count: 42
      };
      
      expect(chatCount.friendlyName).toBe('John Doe');
      expect(chatCount.count).toBe(42);
    });
  });
}); 
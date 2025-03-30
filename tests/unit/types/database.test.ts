import { DatabaseRow, ChatRow, MessageRow, HandleRow } from '../../../src/types/database';
import { test, expect, describe } from 'bun:test';

describe('Database Types', () => {
  describe('DatabaseRow interface', () => {
    test('should allow accessing arbitrary properties', () => {
      const row: DatabaseRow = {};
      row.any_property = 'test';
      row.another_property = 123;
      
      expect(row.any_property).toBe('test');
      expect(row.another_property).toBe(123);
    });
  });

  describe('ChatRow interface', () => {
    test('should define the expected properties from chat table', () => {
      const chatRow: ChatRow = {
        ROWID: 1,
        chat_identifier: 'chat123',
        display_name: 'Group Chat',
        service_name: 'iMessage',
        room_name: 'chat123',
        account_login: 'E:test@example.com'
      };
      
      expect(chatRow.ROWID).toBe(1);
      expect(chatRow.chat_identifier).toBe('chat123');
      expect(chatRow.display_name).toBe('Group Chat');
      expect(chatRow.service_name).toBe('iMessage');
    });
  });

  describe('MessageRow interface', () => {
    test('should define the expected properties from message table', () => {
      const messageRow: MessageRow = {
        ROWID: 42,
        date: 1623456789,
        text: 'Hello, world!',
        is_from_me: 1,
        handle_id: 123,
        cache_roomnames: 'chat123',
        service: 'iMessage'
      };
      
      expect(messageRow.ROWID).toBe(42);
      expect(messageRow.date).toBe(1623456789);
      expect(messageRow.text).toBe('Hello, world!');
      expect(messageRow.is_from_me).toBe(1);
      expect(messageRow.handle_id).toBe(123);
    });
  });

  describe('HandleRow interface', () => {
    test('should define the expected properties from handle table', () => {
      const handleRow: HandleRow = {
        ROWID: 123,
        id: '+11234567890',
        service: 'iMessage'
      };
      
      expect(handleRow.ROWID).toBe(123);
      expect(handleRow.id).toBe('+11234567890');
      expect(handleRow.service).toBe('iMessage');
    });
  });
}); 
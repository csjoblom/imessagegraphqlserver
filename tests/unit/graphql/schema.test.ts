import { test, expect, describe } from 'bun:test';
import { typeDefs } from '../../../src/graphql/typeDefs';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';

describe('GraphQL Schema', () => {
  let schema: GraphQLSchema;
  
  test('should compile without errors', () => {
    expect(() => {
      schema = makeExecutableSchema({ typeDefs });
    }).not.toThrow();
  });
  
  test('should define Chat type with required fields', () => {
    schema = makeExecutableSchema({ typeDefs });
    const chatType = schema.getType('Chat');
    
    expect(chatType).toBeDefined();
  });
  
  test('should define ChatMessage type with required fields', () => {
    schema = makeExecutableSchema({ typeDefs });
    const chatMessageType = schema.getType('ChatMessage');
    
    expect(chatMessageType).toBeDefined();
  });
  
  test('should define Query type with required fields', () => {
    schema = makeExecutableSchema({ typeDefs });
    const queryType = schema.getQueryType();
    
    expect(queryType).toBeDefined();
    expect(queryType?.getFields().getChats).toBeDefined();
    expect(queryType?.getFields().getMessages).toBeDefined();
  });
}); 
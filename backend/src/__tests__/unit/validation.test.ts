import { describe, it, expect } from '@jest/globals';
import { 
  createAgentSchema, 
  createSimulationSchema,
  createTaskSchema,
  createGovernorRuleSchema,
  sanitizeString 
} from '../validation';

describe('Validation Schemas', () => {
  describe('createAgentSchema', () => {
    it('should validate correct agent data', () => {
      const validData = {
        org_id: 1,
        name: 'Test Agent',
        role: 'support',
        description: 'A test agent',
        tools: ['email', 'search'],
        cost_per_task: 5.0
      };

      const result = createAgentSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject negative org_id', () => {
      const invalidData = {
        org_id: -1,
        name: 'Test Agent',
        role: 'support'
      };

      expect(() => createAgentSchema.parse(invalidData)).toThrow();
    });

    it('should reject empty name', () => {
      const invalidData = {
        org_id: 1,
        name: '',
        role: 'support'
      };

      expect(() => createAgentSchema.parse(invalidData)).toThrow();
    });

    it('should trim whitespace from name', () => {
      const data = {
        org_id: 1,
        name: '  Test Agent  ',
        role: 'support'
      };

      const result = createAgentSchema.parse(data);
      expect(result.name).toBe('Test Agent');
    });
  });

  describe('createSimulationSchema', () => {
    it('should validate correct simulation data', () => {
      const validData = {
        org_id: 1,
        agent_id: 5
      };

      const result = createSimulationSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject missing agent_id', () => {
      const invalidData = {
        org_id: 1
      };

      expect(() => createSimulationSchema.parse(invalidData)).toThrow();
    });
  });

  describe('createTaskSchema', () => {
    it('should validate correct task data', () => {
      const validData = {
        org_id: 1,
        agent_id: 5,
        input: 'Process this request'
      };

      const result = createTaskSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject input longer than 10000 characters', () => {
      const invalidData = {
        org_id: 1,
        agent_id: 5,
        input: 'a'.repeat(10001)
      };

      expect(() => createTaskSchema.parse(invalidData)).toThrow();
    });

    it('should trim input whitespace', () => {
      const data = {
        org_id: 1,
        agent_id: 5,
        input: '  Process this  '
      };

      const result = createTaskSchema.parse(data);
      expect(result.input).toBe('Process this');
    });
  });

  describe('createGovernorRuleSchema', () => {
    it('should validate correct governor rule data', () => {
      const validData = {
        org_id: 1,
        agent_id: 5,
        budget_cap: 1000,
        rate_limit: 100,
        accuracy_threshold: 75.5
      };

      const result = createGovernorRuleSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should reject accuracy_threshold > 100', () => {
      const invalidData = {
        org_id: 1,
        agent_id: 5,
        accuracy_threshold: 101
      };

      expect(() => createGovernorRuleSchema.parse(invalidData)).toThrow();
    });

    it('should reject negative budget_cap', () => {
      const invalidData = {
        org_id: 1,
        agent_id: 5,
        budget_cap: -100
      };

      expect(() => createGovernorRuleSchema.parse(invalidData)).toThrow();
    });
  });

  describe('sanitizeString', () => {
    it('should remove < and > characters', () => {
      const input = '<script>alert("xss")</script>';
      const result = sanitizeString(input);
      expect(result).toBe('scriptalert("xss")/script');
    });

    it('should trim whitespace', () => {
      const input = '  test string  ';
      const result = sanitizeString(input);
      expect(result).toBe('test string');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitizeString(input);
      expect(result).toBe('');
    });
  });
});

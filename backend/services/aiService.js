const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeDocumentClauses(documentText) {
    try {
      const prompt = `
        Analyze the following legal document and provide a clause-by-clause breakdown. 
        For each clause, identify:
        1. The clause text
        2. The type of clause (liability, termination, payment, confidentiality, indemnification, force-majeure, etc.)
        3. Risk level (low, medium, high, critical)
        4. Whether it's standard or non-standard
        5. Analysis and recommendations
        6. Suggested improvements if needed

        Document:
        ${documentText}

        Return the response in JSON format with the following structure:
        {
          "clauses": [
            {
              "clause": "exact clause text",
              "type": "clause type",
              "riskLevel": "low|medium|high|critical",
              "status": "standard|non-standard|missing|risky",
              "analysis": "detailed analysis",
              "recommendations": ["recommendation1", "recommendation2"],
              "standardClause": "suggested standard clause if applicable"
            }
          ],
          "overallRisk": "percentage",
          "summary": "overall document analysis"
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a legal AI assistant specializing in contract analysis and clause review. Provide accurate, professional legal analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze document clauses');
    }
  }

  async simplifyLegalDocument(documentText) {
    try {
      const prompt = `
        Simplify the following legal document by:
        1. Replacing legal jargon with plain language
        2. Breaking up long, complex sentences
        3. Using simpler vocabulary while maintaining legal accuracy
        4. Keeping the same meaning and legal effect
        5. Maintaining the document structure

        Original Document:
        ${documentText}

        Return only the simplified version without any additional commentary.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a legal document simplification expert. Convert complex legal language into clear, understandable text while preserving legal meaning."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 3000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Document Simplification Error:', error);
      throw new Error('Failed to simplify document');
    }
  }

  async chatWithAI(message, context = '') {
    try {
      const systemPrompt = `
        You are Clario, an AI legal assistant. You help users with:
        - Legal document analysis
        - Clause-by-clause explanations
        - Legal term definitions
        - Risk assessment
        - Compliance guidance
        - Document simplification

        Always provide accurate, helpful legal information. If you're unsure about something, say so.
        Be professional but approachable. Focus on practical legal advice.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: context ? `${context}\n\nUser question: ${message}` : message
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to process chat message');
    }
  }

  async generateDocument(type, parameters = {}) {
    try {
      const templates = {
        'nda': `
          Generate a comprehensive Non-Disclosure Agreement (NDA) with the following parameters:
          - Parties: ${parameters.parties || 'Company and Recipient'}
          - Purpose: ${parameters.purpose || 'Business discussions'}
          - Duration: ${parameters.duration || '2 years'}
          - Jurisdiction: ${parameters.jurisdiction || 'State of incorporation'}
          
          Include standard NDA clauses for confidentiality, exceptions, return of information, and remedies.
        `,
        'employment': `
          Generate an Employment Agreement with the following parameters:
          - Position: ${parameters.position || 'Employee'}
          - Salary: ${parameters.salary || 'To be determined'}
          - Start Date: ${parameters.startDate || 'Upon execution'}
          - Location: ${parameters.location || 'Company offices'}
          
          Include standard employment clauses for duties, compensation, benefits, confidentiality, and termination.
        `,
        'privacy': `
          Generate a Privacy Policy for a ${parameters.businessType || 'technology'} company that:
          - Collects: ${parameters.dataTypes || 'personal information, usage data'}
          - Uses data for: ${parameters.purposes || 'service provision, analytics'}
          - Shares with: ${parameters.sharing || 'service providers, legal requirements'}
          
          Include standard privacy policy sections for data collection, use, sharing, and user rights.
        `
      };

      const prompt = templates[type] || `
        Generate a legal document of type: ${type}
        Parameters: ${JSON.stringify(parameters)}
        
        Create a comprehensive, professional legal document with all necessary clauses and provisions.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a legal document generation expert. Create professional, comprehensive legal documents that are legally sound and well-structured."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Document Generation Error:', error);
      throw new Error('Failed to generate document');
    }
  }

  async checkStandardClauses(documentText) {
    try {
      const prompt = `
        Analyze the following legal document and check for standard clauses. 
        Identify:
        1. Which standard clauses are present
        2. Which standard clauses are missing
        3. Any non-standard or unusual clauses
        4. Risk assessment for each clause
        5. Recommendations for improvement

        Standard clauses to check for:
        - Liability limitation
        - Indemnification
        - Termination
        - Force majeure
        - Confidentiality
        - Governing law
        - Dispute resolution
        - Payment terms
        - Intellectual property
        - Data protection

        Document:
        ${documentText}

        Return in JSON format:
        {
          "standardClauses": [
            {
              "name": "clause name",
              "present": true/false,
              "text": "clause text if present",
              "riskLevel": "low|medium|high|critical",
              "recommendation": "suggestion"
            }
          ],
          "missingClauses": ["list of missing standard clauses"],
          "nonStandardClauses": ["list of unusual clauses"],
          "overallRisk": "percentage"
        }
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a legal compliance expert specializing in standard contract clauses and risk assessment."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 3000
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('Standard Clause Check Error:', error);
      throw new Error('Failed to check standard clauses');
    }
  }
}

module.exports = new AIService();

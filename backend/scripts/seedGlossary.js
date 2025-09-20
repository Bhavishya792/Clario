const mongoose = require('mongoose');
const LegalTerm = require('../models/LegalTerm');
require('dotenv').config();

const legalTerms = [
  {
    term: 'indemnification',
    displayTerm: 'Indemnification',
    definition: 'A contractual obligation where one party agrees to compensate another party for any losses, damages, or expenses that may arise from specified circumstances or actions.',
    category: 'liability',
    complexity: 'intermediate',
    examples: [
      'The contractor shall indemnify the client against any claims arising from the contractor\'s negligence.',
      'Each party agrees to indemnify the other for any third-party intellectual property claims.'
    ],
    relatedTerms: [],
    synonyms: ['hold harmless', 'defend', 'compensate'],
    usage: {
      frequency: 'common',
      contexts: ['contracts', 'agreements', 'insurance']
    }
  },
  {
    term: 'force-majeure',
    displayTerm: 'Force Majeure',
    definition: 'A contractual clause that excuses a party from performing its obligations when circumstances beyond their control make performance impossible or impracticable.',
    category: 'contract',
    complexity: 'intermediate',
    examples: [
      'The pandemic was declared a force majeure event, excusing delayed delivery.',
      'Natural disasters, war, and government actions are typically included in force majeure clauses.'
    ],
    relatedTerms: [],
    synonyms: ['act of god', 'impossibility', 'frustration'],
    usage: {
      frequency: 'common',
      contexts: ['contracts', 'supply agreements', 'service agreements']
    }
  },
  {
    term: 'confidentiality-agreement',
    displayTerm: 'Confidentiality Agreement',
    definition: 'A legal contract that establishes a confidential relationship between parties and protects sensitive information from being disclosed to third parties.',
    category: 'contract',
    complexity: 'basic',
    examples: [
      'Before discussing the merger, both companies signed confidentiality agreements.',
      'The employee signed a confidentiality agreement to protect trade secrets.'
    ],
    relatedTerms: [],
    synonyms: ['non-disclosure agreement', 'nda', 'secrecy agreement'],
    usage: {
      frequency: 'common',
      contexts: ['employment', 'business negotiations', 'partnerships']
    }
  },
  {
    term: 'liability-limitation',
    displayTerm: 'Liability Limitation',
    definition: 'A contractual provision that restricts or caps the amount of damages one party can recover from another party, often excluding certain types of damages.',
    category: 'liability',
    complexity: 'intermediate',
    examples: [
      'The software license limits liability to the amount paid for the license.',
      'Liability limitation clauses often exclude consequential and indirect damages.'
    ],
    relatedTerms: [],
    synonyms: ['liability cap', 'damages limitation', 'liability exclusion'],
    usage: {
      frequency: 'common',
      contexts: ['software licenses', 'service agreements', 'product sales']
    }
  },
  {
    term: 'intellectual-property',
    displayTerm: 'Intellectual Property',
    definition: 'Intangible assets that are the result of creativity and innovation, including patents, trademarks, copyrights, and trade secrets.',
    category: 'intellectual-property',
    complexity: 'basic',
    examples: [
      'The company\'s intellectual property portfolio includes 15 patents and 3 trademarks.',
      'Intellectual property rights protect the company\'s competitive advantage.'
    ],
    relatedTerms: [],
    synonyms: ['ip', 'intangible assets', 'creative works'],
    usage: {
      frequency: 'common',
      contexts: ['business', 'technology', 'creative industries']
    }
  },
  {
    term: 'termination-clause',
    displayTerm: 'Termination Clause',
    definition: 'A contractual provision that specifies the conditions and procedures under which a contract can be ended by either party.',
    category: 'contract',
    complexity: 'basic',
    examples: [
      'The termination clause allows either party to end the agreement with 30 days notice.',
      'Material breach of contract triggers immediate termination rights.'
    ],
    relatedTerms: [],
    synonyms: ['cancellation clause', 'exit clause', 'termination provision'],
    usage: {
      frequency: 'common',
      contexts: ['employment', 'service agreements', 'partnerships']
    }
  },
  {
    term: 'due-diligence',
    displayTerm: 'Due Diligence',
    definition: 'The comprehensive investigation and analysis of a business, property, or investment opportunity before entering into a transaction.',
    category: 'corporate',
    complexity: 'intermediate',
    examples: [
      'The buyer conducted due diligence before acquiring the company.',
      'Due diligence revealed several undisclosed liabilities in the target company.'
    ],
    relatedTerms: [],
    synonyms: ['investigation', 'analysis', 'review'],
    usage: {
      frequency: 'common',
      contexts: ['mergers', 'acquisitions', 'investments']
    }
  },
  {
    term: 'non-compete-agreement',
    displayTerm: 'Non-Compete Agreement',
    definition: 'A contractual restriction that prevents an employee or contractor from competing with their employer or client for a specified period and within a defined geographic area.',
    category: 'employment',
    complexity: 'intermediate',
    examples: [
      'The executive signed a non-compete agreement preventing employment with competitors for 2 years.',
      'Non-compete agreements must be reasonable in scope and duration to be enforceable.'
    ],
    relatedTerms: [],
    synonyms: ['non-competition clause', 'restrictive covenant', 'competition restriction'],
    usage: {
      frequency: 'common',
      contexts: ['employment', 'business sales', 'partnerships']
    }
  },
  {
    term: 'material-breach',
    displayTerm: 'Material Breach',
    definition: 'A significant violation of contract terms that goes to the heart of the agreement and gives the non-breaching party the right to terminate the contract.',
    category: 'contract',
    complexity: 'intermediate',
    examples: [
      'Failure to deliver goods on time constituted a material breach of the supply agreement.',
      'A material breach allows the injured party to seek damages and terminate the contract.'
    ],
    relatedTerms: [],
    synonyms: ['substantial breach', 'fundamental breach', 'serious breach'],
    usage: {
      frequency: 'common',
      contexts: ['contract disputes', 'termination', 'litigation']
    }
  },
  {
    term: 'arbitration',
    displayTerm: 'Arbitration',
    definition: 'A method of dispute resolution where parties submit their dispute to a neutral third party (arbitrator) who makes a binding decision.',
    category: 'litigation',
    complexity: 'basic',
    examples: [
      'The contract requires arbitration instead of court litigation for disputes.',
      'Arbitration is often faster and more confidential than traditional litigation.'
    ],
    relatedTerms: [],
    synonyms: ['alternative dispute resolution', 'adr', 'binding arbitration'],
    usage: {
      frequency: 'common',
      contexts: ['contracts', 'dispute resolution', 'commercial agreements']
    }
  },
  {
    term: 'governing-law',
    displayTerm: 'Governing Law',
    definition: 'A contractual provision that specifies which jurisdiction\'s laws will be used to interpret and enforce the contract.',
    category: 'contract',
    complexity: 'basic',
    examples: [
      'The governing law clause specifies that New York law will apply to this agreement.',
      'Governing law clauses help avoid conflicts between different legal systems.'
    ],
    relatedTerms: [],
    synonyms: ['choice of law', 'applicable law', 'jurisdiction clause'],
    usage: {
      frequency: 'common',
      contexts: ['international contracts', 'cross-border agreements', 'commercial contracts']
    }
  },
  {
    term: 'severability-clause',
    displayTerm: 'Severability Clause',
    definition: 'A contractual provision that ensures if one part of the contract is found to be invalid or unenforceable, the rest of the contract remains in effect.',
    category: 'contract',
    complexity: 'basic',
    examples: [
      'The severability clause protects the contract if any provision is deemed unenforceable.',
      'Without a severability clause, an invalid provision could void the entire contract.'
    ],
    relatedTerms: [],
    synonyms: ['savings clause', 'separability clause', 'validity clause'],
    usage: {
      frequency: 'common',
      contexts: ['all contracts', 'risk management', 'contract protection']
    }
  }
];

const seedGlossary = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clario');
    console.log('Connected to MongoDB');

    // Clear existing terms
    await LegalTerm.deleteMany({});
    console.log('Cleared existing legal terms');

    // Insert new terms
    const createdTerms = await LegalTerm.insertMany(legalTerms);
    console.log(`Created ${createdTerms.length} legal terms`);

    // Update related terms (simplified - in production, you'd want more sophisticated relationships)
    for (let i = 0; i < createdTerms.length; i++) {
      const term = createdTerms[i];
      const relatedIndices = [];
      
      // Add some related terms (simplified logic)
      if (i > 0) relatedIndices.push(i - 1);
      if (i < createdTerms.length - 1) relatedIndices.push(i + 1);
      
      if (relatedIndices.length > 0) {
        term.relatedTerms = relatedIndices.map(index => createdTerms[index]._id);
        await term.save();
      }
    }

    console.log('Updated related terms');
    console.log('Glossary seeding completed successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding glossary:', error);
    process.exit(1);
  }
};

// Run the seed function
seedGlossary();

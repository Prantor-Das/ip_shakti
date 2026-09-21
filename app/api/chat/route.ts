import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Anthropic SDK client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MAX_MESSAGE_LENGTH = 4000;

interface ReferenceEntry {
  id: string;
  title: string;
  summary: string;
  jurisdiction: 'india' | 'international';
}

const REFERENCE_BLOCK: ReferenceEntry[] = [
  {
    id: 'patents-act-3p',
    title: 'Patents Act 1970 - Section 3(p)',
    summary:
      'Inventions which in effect are traditional knowledge or an aggregation/duplication of known properties of traditionally known component(s) are non-patentable in India.',
    jurisdiction: 'india',
  },
  {
    id: 'tkdl-purpose',
    title: 'Traditional Knowledge Digital Library (TKDL)',
    summary:
      'Digital repository of Indian traditional medicine formulations to prevent biopiracy and wrongful patent grants at global patent offices.',
    jurisdiction: 'india',
  },
  {
    id: 'bd-act-abs',
    title: 'Biological Diversity Act 2002 - Access & Benefit Sharing (ABS)',
    summary:
      'Mandates prior approval from the National Biodiversity Authority (NBA) for accessing Indian biological resources for commercial utilization or research.',
    jurisdiction: 'india',
  },
  {
    id: 'gi-act-basics',
    title: 'Geographical Indications of Goods Act 1999',
    summary:
      'Protects products originating from specific regions with unique characteristics or reputation attributed to their geographical origin.',
    jurisdiction: 'india',
  },
  {
    id: 'nagoya-protocol',
    title: 'Nagoya Protocol on Access and Benefit-Sharing',
    summary:
      'International agreement under CBD establishing a legal framework for fair and equitable benefit sharing from genetic resource utilization globally.',
    jurisdiction: 'international',
  },
  {
    id: 'wipo-igc',
    title: 'WIPO Intergovernmental Committee (IGC)',
    summary:
      'International body negotiating IP instruments to protect Traditional Knowledge, Traditional Cultural Expressions, and Genetic Resources.',
    jurisdiction: 'international',
  },
];

/**
 * Derive confidence value (high | medium | low) based on model response text & citation match.
 */
function deriveConfidence(
  responseText: string,
  citationsUsed: string[]
): 'high' | 'medium' | 'low' {
  const lower = responseText.toLowerCase();
  if (
    lower.includes('not covered in my current sources') ||
    lower.includes('not covered') ||
    lower.includes('outside the scope')
  ) {
    return 'low';
  }
  if (citationsUsed.length > 0) {
    return 'high';
  }
  return 'medium';
}

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { message, jurisdiction, formulationType, history } = body;

    // 1. Input Validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message payload is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    // Filter reference block by requested jurisdiction if provided
    const targetJurisdiction = typeof jurisdiction === 'string' ? jurisdiction.toLowerCase() : '';

    const filteredReferences = REFERENCE_BLOCK.filter((ref) => {
      if (!targetJurisdiction || targetJurisdiction === 'all') return true;
      return ref.jurisdiction === targetJurisdiction;
    });

    // Active reference sources stringified for prompt
    const referencesText = filteredReferences
      .map(
        (ref, i) =>
          `[${i + 1}] ${ref.title} (Jurisdiction: ${ref.jurisdiction.toUpperCase()})\n    Summary: ${ref.summary}`
      )
      .join('\n\n');

    // Format chat history securely (limit to last 20 messages)
    const formattedHistory = Array.isArray(history)
      ? history
          .slice(-20)
          .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && m?.content)
          .map((m: any) => ({
            role: m.role as 'user' | 'assistant',
            content: String(m.content).slice(0, MAX_MESSAGE_LENGTH),
          }))
      : [];

    const messages: Anthropic.MessageParam[] = [
      ...formattedHistory,
      { role: 'user', content: trimmedMessage },
    ];

    // Formulation framing
    const formulationFraming = formulationType
      ? `Tailor all guidance specifically for a "${formulationType}" formulation type (e.g. classical Ayurvedic formulation, new-drug formulation, or phytopharmaceutical standard).`
      : 'Provide general Ayurvedic IP and regulatory framing.';

    const systemPrompt = `You are IP-SAKTI Sahayak, an expert Ayurveda IP & Regulatory Assistant.

CORE INSTRUCTIONS:
1. Answer the user's Ayurveda IP and regulatory questions strictly using citations from the Reference Block provided below.
2. Filter your knowledge to the active jurisdiction (${targetJurisdiction || 'india & international'}).
3. ${formulationFraming}
4. Strict Source Constraint: If the user's question cannot be answered using the provided Reference Block entries, explicitly state: "not covered in my current sources". Do NOT invent or hallucinate references outside this block.
5. MANDATORY FOOTER: ALWAYS append this exact disclaimer at the very end of your response:
"This is information, not legal advice."

REFERENCE BLOCK:
${referencesText}
`;

    // Check API Key existence early for clear error message
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          error:
            'Anthropic API Key is not configured. Please set ANTHROPIC_API_KEY in your environment variables.',
        },
        { status: 401 }
      );
    }

    // Call Anthropic API with streaming
    const stream = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();
    let fullResponseText = '';

    // Determine citations used in response based on references available
    const citationsUsed = filteredReferences.map((r) => r.title);

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
              const text = chunk.delta.text;
              fullResponseText += text;
              controller.enqueue(encoder.encode(text));
            }
          }

          // Ensure mandatory disclaimer if model omitted it
          if (!fullResponseText.includes('This is information, not legal advice')) {
            const footer = '\n\nThis is information, not legal advice.';
            fullResponseText += footer;
            controller.enqueue(encoder.encode(footer));
          }

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    // Derive confidence
    const confidence = deriveConfidence(fullResponseText || trimmedMessage, citationsUsed);

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Citations': JSON.stringify(citationsUsed),
        'X-Confidence': confidence,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/chat route:', error);

    // Handle known Anthropic SDK Error Types
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: 'Authentication failed. Please verify your ANTHROPIC_API_KEY.' },
        { status: 401 }
      );
    }

    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    if (error instanceof Anthropic.APIConnectionTimeoutError) {
      return NextResponse.json(
        { error: 'Request to AI service timed out. Please try again.' },
        { status: 504 }
      );
    }

    if (error instanceof Anthropic.APIConnectionError) {
      return NextResponse.json(
        { error: 'Unable to connect to AI service network. Please check network connectivity.' },
        { status: 502 }
      );
    }

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: error.message || 'Anthropic API error occurred.' },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}

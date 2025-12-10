export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let requestBody;
  try {
    requestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }

  const { section, data, apiKey } = requestBody;

  // API 키 검증 (클라이언트에서 전달받거나 환경 변수 사용)
  const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    return res.status(400).json({ error: 'OpenAI API key is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a cybersecurity expert specializing in OSCP-style penetration testing reports. Generate professional, detailed, and technically accurate report sections. Always respond in Korean.`
          },
          {
            role: 'user',
            content: generatePrompt(section, data)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `OpenAI API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error.message || 'Unknown OpenAI API error');
    }

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return res.status(200).json({
      content: result.choices[0].message.content
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

function generatePrompt(section, data) {
  const prompts = {
    executive_summary: `
Generate an Executive Summary for a penetration test with the following details:
- Test Date: ${data.testDate}
- Tester: ${data.tester}
- Target: ${data.target}
- Number of Findings: ${data.findingsCount}
- Critical Issues: ${data.criticalCount}

Write a concise 2-3 paragraph executive summary suitable for C-level executives. Focus on business impact and risk assessment. Write in Korean.
`,

    methodology: `
Generate a Methodology section describing the penetration testing approach used for:
- Target: ${data.target}
- Scope: ${data.scope}

Include OSCP-style testing phases: Information Gathering, Vulnerability Analysis, Exploitation, Post-Exploitation. Write in Korean.
`,

    finding_detail: `
Generate a detailed technical finding report for:
- Title: ${data.title}
- Severity: ${data.severity}
- Description: ${data.description}

Include:
1. Technical Description (2-3 sentences)
2. Business Impact (1-2 sentences)
3. CVSS Score and Justification
4. Detailed Steps to Reproduce (numbered list)
5. Remediation Steps (specific and actionable)
6. References (CWE, OWASP, CVE if applicable)

Format in markdown with clear sections. Write in Korean.
`,

    attack_path: `
Generate an Attack Path narrative describing how the penetration tester compromised the system:
- Entry Point: ${data.entryPoint}
- Privilege Escalation Method: ${data.privescMethod}
- Final Access Level: ${data.finalAccess}

Write a clear, step-by-step narrative suitable for technical readers. Write in Korean.
`
  };

  return prompts[section] || prompts.finding_detail;
}


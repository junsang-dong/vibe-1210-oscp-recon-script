// OpenAI API 호출 유틸리티 함수

export async function callOpenAI(apiKey, section, data) {
  const prompt = generatePrompt(section, data)
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
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
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'OpenAI API 호출 실패')
  }

  const result = await response.json()
  
  if (result.error) {
    throw new Error(result.error.message)
  }

  return result.choices[0].message.content
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
  }

  return prompts[section] || prompts.finding_detail
}


// Secure API endpoint for code execution
// Proxies requests to Piston API to hide endpoint and add security
module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { language, code, stdin } = req.body;

    // Validate input
    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required' });
    }

    // Security: Limit code size (100KB)
    if (code.length > 100000) {
      return res.status(400).json({ error: 'Code too large (max 100KB)' });
    }

    // Get Piston API URL from environment or use default
    const PISTON_API = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

    // Language mappings for Piston
    const languageMap = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'c_cpp': 'cpp',
      'go': 'go',
      'rust': 'rust',
      'ruby': 'ruby',
      'php': 'php',
      'csharp': 'csharp',
      'swift': 'swift',
      'kotlin': 'kotlin',
      'typescript': 'typescript',
      'r': 'r',
      'perl': 'perl',
      'scala': 'scala',
      'haskell': 'haskell',
      'lua': 'lua',
      'elixir': 'elixir',
      'dart': 'dart',
      'sql': 'sql'
    };

    const pistonLanguage = languageMap[language] || language;

    // Execute code via Piston API
    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: pistonLanguage,
        version: '*', // Use latest version
        files: [{
          content: code
        }],
        stdin: stdin || '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1
      })
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('Piston API error:', details);
      return res.status(503).json({
        error: 'The code runner is currently unavailable.',
        details: details || `Execution provider returned HTTP ${response.status}.`,
        serviceUnavailable: true
      });
    }

    const result = await response.json();
    const compileOutput = result.compile?.output || result.compile?.stderr || '';
    const runOutput = result.run?.output || '';
    const runStderr = result.run?.stderr || '';

    if (result.compile && result.compile.code !== 0) {
      return res.status(200).json({
        success: false,
        error: compileOutput || 'Compilation failed without an error message.',
        stage: 'compile',
        code: result.compile.code
      });
    }

    if (result.run && result.run.code !== 0) {
      return res.status(200).json({
        success: false,
        error: runOutput || runStderr || 'The program exited with an error.',
        stage: 'run',
        code: result.run.code,
        signal: result.run.signal
      });
    }

    // Return execution result
    return res.status(200).json({
      success: true,
      output: runOutput,
      stdout: result.run?.stdout || '',
      stderr: runStderr,
      code: result.run?.code,
      signal: result.run?.signal,
      compile_output: compileOutput
    });

  } catch (error) {
    console.error('Error executing code:', error);
    return res.status(503).json({
      error: 'The code runner is currently unavailable.',
      details: error.message,
      serviceUnavailable: true
    });
  }
}

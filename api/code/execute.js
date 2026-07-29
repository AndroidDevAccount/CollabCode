// Server-side proxy for code execution providers.
const executionRequests = new Map();

function allowExecutionRequest(req) {
  const key = String(
    req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  ).split(',')[0].trim();
  const now = Date.now();
  const recent = (executionRequests.get(key) || [])
    .filter(timestamp => now - timestamp < 60000);
  if (recent.length >= 12) return false;
  recent.push(now);
  executionRequests.set(key, recent);
  return true;
}

async function executeCSharp(code, stdin) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        compiler: 'mono-6.12.0.199',
        code,
        stdin: stdin || ''
      })
    });
    if (!response.ok) {
      throw new Error(`C# execution provider returned HTTP ${response.status}`);
    }

    const result = await response.json();
    const compilerError = [
      result.compiler_error,
      result.compiler_output
    ].filter(Boolean).join('');
    const programError = [
      result.program_error,
      result.program_output
    ].filter(Boolean).join('');

    const compilationFailed =
      /Compilation failed|error CS\d+/i.test(compilerError) ||
      (result.status !== '0' && compilerError && !result.program_message);
    if (compilationFailed) {
      return {
        success: false,
        error: compilerError || result.compiler_message || 'Compilation failed.',
        stage: 'compile',
        code: Number(result.status) || 1
      };
    }
    if (result.status !== '0') {
      return {
        success: false,
        error: programError || result.program_message || 'The program exited with an error.',
        stage: 'run',
        code: Number(result.status) || 1,
        signal: result.signal || ''
      };
    }
    return {
      success: true,
      output: result.program_output || '',
      stderr: result.program_error || '',
      code: 0,
      provider: 'wandbox-mono'
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { language, code, stdin } = req.body;

    if (!allowExecutionRequest(req)) {
      return res.status(429).json({
        error: 'Too many Run requests. Please wait a minute and try again.'
      });
    }

    // Validate input
    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required' });
    }

    // Interview exercises are intentionally small.
    if (code.length > 25000) {
      return res.status(400).json({ error: 'Code too large (max 25KB)' });
    }

    if (language === 'csharp') {
      return res.status(200).json(await executeCSharp(code, stdin));
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

import { PythonShell } from 'python-shell';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration to handle preflight requests and multiple origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://192.168.1.104:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Load Vertex AI Key
const keyFile = join(__dirname, 'argos-backend/argos-vertex-ai-key.json');
let key;
try {
  key = JSON.parse(fs.readFileSync(keyFile, 'utf-8'));
  console.log('Vertex AI key loaded');
} catch (err) {
  console.error('Failed to load Vertex AI key:', err);
  key = {
    project_id: 'mock-project',
    private_key: 'mock-key',
    client_email: 'mock@example.com'
  };
}

const auth = new GoogleAuth({
  credentials: key,
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
});

// In-memory mock data stores
let templates = [
  {
    id: '1',
    name: 'Image Generation Pipeline',
    description: 'Generate and process images using AI models',
    workflow: [
      {
        source_tool: 'gpt-4',
        data: {
          prompt: 'Generate image description',
          temperature: 0.7
        }
      },
      {
        source_tool: 'stable_diffusion',
        data: {
          steps: 50,
          guidance_scale: 7.5
        }
      }
    ],
    tags: ['ai', 'image-generation', 'automation'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: {
      id: '1',
      name: 'Demo User'
    },
    workspaceId: '1'
  }
];

let adapters = [
  {
    id: '1',
    name: 'rest_api',
    version: '1.0.0',
    status: 'active',
    file_path: 'adapters/rest_api.py',
    last_updated: new Date().toISOString()
  }
];

// Template Routes
app.get('/api/templates', (req, res) => {
  res.json({ templates });
});

app.get('/api/templates/search', (req, res) => {
  const query = req.query.q?.toString().toLowerCase() || '';
  const filtered = templates.filter(template =>
    template.name.toLowerCase().includes(query) ||
    template.description?.toLowerCase().includes(query) ||
    template.tags.some(tag => tag.toLowerCase().includes(query))
  );
  res.json({ templates: filtered });
});

app.post('/api/templates', (req, res) => {
  const template = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  templates.push(template);
  res.status(201).json({ template });
});

app.put('/api/templates/:id', (req, res) => {
  const { id } = req.params;
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Template not found' });
  templates[index] = { ...templates[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json({ template: templates[index] });
});

app.delete('/api/templates/:id', (req, res) => {
  const { id } = req.params;
  templates = templates.filter(t => t.id !== id);
  res.status(204).send();
});

// Adapter Routes
app.get('/api/adapters', (req, res) => {
  res.json({ adapters });
});

app.post('/api/adapters/reload', (req, res) => {
  setTimeout(() => {
    adapters = adapters.map(adapter => ({
      ...adapter,
      last_updated: new Date().toISOString()
    }));
    res.json({ success: true, message: 'Adapters reloaded successfully' });
  }, 1000);
});

// Improved Vertex AI Transcode Route
app.post('/api/transcode', async (req, res) => {
  console.log('Transcode request received:', req.body);
  
  const { code, sourceLanguage, targetLanguage } = req.body;
  
  if (!code) {
    console.log('Missing required code parameter');
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    console.log(`Transcoding from ${sourceLanguage || 'auto'} to ${targetLanguage || 'auto'}`);
    
    // Mock transcode function - replace with actual implementation
    let mockOutput;
    if (code.includes('function')) {
      // JavaScript to Python conversion
      mockOutput = code
        .replace(/function\s+(\w+)\s*\(/g, 'def $1(')
        .replace(/return\s+/g, 'return ')
        .replace(/{/g, ':')
        .replace(/}/g, '')
        .replace(/;/g, '');
    } else if (code.includes('def')) {
      // Python to JavaScript conversion
      mockOutput = code
        .replace(/def\s+(\w+)\s*\(/g, 'function $1(')
        .replace(/return\s+/g, 'return ')
        .replace(/:/g, ' {')
        .split('\n')
        .map(line => line.endsWith('{') ? line : line + ';')
        .join('\n') + '\n}';
    } else {
      // Default fallback
      mockOutput = `// Transcoded code\n${code}`;
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Transcode successful');
    res.json({
      output: mockOutput,
      metadata: {
        timestamp: new Date().toISOString(),
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage: targetLanguage || 'auto'
      }
    });
  } catch (error) {
    console.error('Error during transcode:', error);
    res.status(500).json({ 
      error: 'An error occurred during transcoding',
      details: error.message 
    });
  }
});

// Python Integration (Ingest)
app.post('/ingest', async (req, res) => {
  try {
    let pyshell = new PythonShell('main.py', {
      mode: 'json',
      pythonPath: 'python3',
      args: ['--port', '8000']
    });

    pyshell.send(req.body);
    pyshell.on('message', function (message) {
      res.json(message);
    });
    pyshell.end(function (err) {
      if (err) {
        console.error('Python error:', err);
        res.status(500).json({ error: err.message });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
  console.log(`CORS enabled for multiple origins including localhost:5173 and localhost:5174`);
});
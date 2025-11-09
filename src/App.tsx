import { useState } from 'react';
import { Shield } from 'lucide-react';
import { JWTGenerator } from './components/JWTGenerator';
import { JWTDecoder } from './components/JWTDecoder';
import { EncodingTools } from './components/EncodingTools';
import { TokenHistory } from './components/TokenHistory';

type Tab = 'generator' | 'decoder' | 'encoding' | 'history';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generator');
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleTokenGenerated = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">JWT & Encoding Toolkit</h1>
          </div>
          <p className="text-gray-600">
            Generate, decode, and verify JWT tokens with support for multiple encoding schemes
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'generator'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              JWT Generator
            </button>
            <button
              onClick={() => setActiveTab('decoder')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'decoder'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              JWT Decoder
            </button>
            <button
              onClick={() => setActiveTab('encoding')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'encoding'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Encoding Tools
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              History
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTab === 'generator' && <JWTGenerator onTokenGenerated={handleTokenGenerated} />}
          {activeTab === 'decoder' && <JWTDecoder />}
          {activeTab === 'encoding' && <EncodingTools />}
          {activeTab === 'history' && <TokenHistory key={refreshHistory} />}
        </div>

        <footer className="mt-12 text-center text-gray-600 text-sm">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
            <ul className="text-left space-y-1">
              <li>✓ Generate JWT access and refresh tokens</li>
              <li>✓ Decode and verify JWT signatures</li>
              <li>✓ Base32, Base64, Base64URL encoding/decoding</li>
              <li>✓ Hexadecimal encoding support</li>
              <li>✓ Token history with database persistence</li>
            </ul>
          </div>
          <p className="mt-4">Built with React, TypeScript, Tailwind CSS, and Supabase</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

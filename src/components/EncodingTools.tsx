import { useState } from 'react';
import { Binary, ArrowRightLeft } from 'lucide-react';
import {
  encodeBase32,
  decodeBase32,
  encodeBase64,
  decodeBase64,
  encodeBase64Url,
  decodeBase64Url,
  encodeHex,
  decodeHex
} from '../utils/encoding';

type EncodingType = 'base32' | 'base64' | 'base64url' | 'hex';

export function EncodingTools() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [encodingType, setEncodingType] = useState<EncodingType>('base64');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleConvert = () => {
    let result = '';

    if (mode === 'encode') {
      switch (encodingType) {
        case 'base32':
          result = encodeBase32(inputText);
          break;
        case 'base64':
          result = encodeBase64(inputText);
          break;
        case 'base64url':
          result = encodeBase64Url(inputText);
          break;
        case 'hex':
          result = encodeHex(inputText);
          break;
      }
    } else {
      switch (encodingType) {
        case 'base32':
          result = decodeBase32(inputText);
          break;
        case 'base64':
          result = decodeBase64(inputText);
          break;
        case 'base64url':
          result = decodeBase64Url(inputText);
          break;
        case 'hex':
          result = decodeHex(inputText);
          break;
      }
    }

    setOutputText(result);
  };

  const toggleMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInputText(outputText);
    setOutputText(inputText);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Binary className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Encoding Tools</h2>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encoding Type
            </label>
            <select
              value={encodingType}
              onChange={(e) => setEncodingType(e.target.value as EncodingType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="base32">Base32</option>
              <option value="base64">Base64</option>
              <option value="base64url">Base64URL</option>
              <option value="hex">Hexadecimal</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode
            </label>
            <button
              onClick={toggleMode}
              className="w-full px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input {mode === 'encode' ? '(Plain Text)' : `(${encodingType.toUpperCase()})`}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Enter text to ${mode}...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            rows={6}
          />
        </div>

        <button
          onClick={handleConvert}
          className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
        >
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>

        {outputText && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Output {mode === 'decode' ? '(Plain Text)' : `(${encodingType.toUpperCase()})`}
            </label>
            <textarea
              readOnly
              value={outputText}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
              rows={6}
            />
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-2">Encoding Information</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Base32:</strong> Uses A-Z and 2-7, good for case-insensitive systems</p>
          <p><strong>Base64:</strong> Standard encoding using A-Z, a-z, 0-9, +, /</p>
          <p><strong>Base64URL:</strong> URL-safe variant using - and _ instead of + and /</p>
          <p><strong>Hexadecimal:</strong> Uses 0-9 and A-F, commonly used for binary data</p>
        </div>
      </div>
    </div>
  );
}

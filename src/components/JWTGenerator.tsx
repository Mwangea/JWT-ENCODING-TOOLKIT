import { useState } from 'react';
import { Copy, Check, Key } from 'lucide-react';
import { createJWT } from '../utils/jwt';
import { JWTPayload } from '../types/jwt';
import { supabase } from '../lib/supabase';

export function JWTGenerator({ onTokenGenerated }: { onTokenGenerated?: () => void }) {
  const [payloadFields, setPayloadFields] = useState<Array<{ key: string; value: string }>>([
    { key: 'sub', value: '1234567890' },
    { key: 'name', value: 'John Doe' }
  ]);
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [expiresIn, setExpiresIn] = useState('3600');
  const [generatedToken, setGeneratedToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [copied, setCopied] = useState<'access' | 'refresh' | null>(null);

  const addField = () => {
    setPayloadFields([...payloadFields, { key: '', value: '' }]);
  };

  const removeField = (index: number) => {
    setPayloadFields(payloadFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: 'key' | 'value', newValue: string) => {
    const updated = [...payloadFields];
    updated[index][field] = newValue;
    setPayloadFields(updated);
  };

  const generateTokens = async () => {
    const payload: JWTPayload = {};
    payloadFields.forEach(field => {
      if (field.key) {
        payload[field.key] = field.value;
      }
    });

    const expires = expiresIn ? parseInt(expiresIn) : undefined;
    const accessToken = await createJWT(payload, secret, expires);
    setGeneratedToken(accessToken);

    const refreshPayload = { ...payload, type: 'refresh' };
    const refreshExpires = expires ? expires * 24 : 86400 * 30;
    const refToken = await createJWT(refreshPayload, secret, refreshExpires);
    setRefreshToken(refToken);

    try {
      await supabase.from('token_history').insert([
        {
          token: accessToken,
          token_type: 'access',
          payload: payload,
          expires_at: expires ? new Date(Date.now() + expires * 1000).toISOString() : null
        },
        {
          token: refToken,
          token_type: 'refresh',
          payload: refreshPayload,
          expires_at: new Date(Date.now() + refreshExpires * 1000).toISOString()
        }
      ]);
      onTokenGenerated?.();
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const copyToClipboard = async (text: string, type: 'access' | 'refresh') => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">JWT Token Generator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payload Fields
          </label>
          {payloadFields.map((field, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Key"
                value={field.key}
                onChange={(e) => updateField(index, 'key', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Value"
                value={field.value}
                onChange={(e) => updateField(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeField(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={addField}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Add Field
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secret Key
          </label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expires In (seconds)
          </label>
          <input
            type="number"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={generateTokens}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Generate Tokens
        </button>

        {generatedToken && (
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token
              </label>
              <div className="relative">
                <textarea
                  readOnly
                  value={generatedToken}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                  rows={4}
                />
                <button
                  onClick={() => copyToClipboard(generatedToken, 'access')}
                  className="absolute top-2 right-2 p-2 bg-white rounded-md hover:bg-gray-100"
                >
                  {copied === 'access' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Token
              </label>
              <div className="relative">
                <textarea
                  readOnly
                  value={refreshToken}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                  rows={4}
                />
                <button
                  onClick={() => copyToClipboard(refreshToken, 'refresh')}
                  className="absolute top-2 right-2 p-2 bg-white rounded-md hover:bg-gray-100"
                >
                  {copied === 'refresh' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

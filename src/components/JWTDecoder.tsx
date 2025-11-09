import { useState } from 'react';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { decodeJWT, verifyJWT } from '../utils/jwt';

export function JWTDecoder() {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [decodedData, setDecodedData] = useState<{
    header: object;
    payload: object;
    signature: string;
  } | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const handleDecode = () => {
    setError('');
    setIsValid(null);
    const decoded = decodeJWT(token);

    if (!decoded) {
      setError('Invalid JWT token format');
      setDecodedData(null);
      return;
    }

    setDecodedData(decoded);
  };

  const handleVerify = async () => {
    if (!secret) {
      setError('Please enter a secret key');
      return;
    }

    const valid = await verifyJWT(token, secret);
    setIsValid(valid);
    setError(valid ? '' : 'Invalid signature');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lock className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">JWT Decoder & Validator</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            JWT Token
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your JWT token here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-sm"
            rows={4}
          />
        </div>

        <button
          onClick={handleDecode}
          className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          Decode Token
        </button>

        {decodedData && (
          <div className="space-y-4 mt-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Header</h3>
              <pre className="p-3 bg-gray-50 rounded-md border border-gray-300 text-sm overflow-x-auto">
                {JSON.stringify(decodedData.header, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Payload</h3>
              <pre className="p-3 bg-gray-50 rounded-md border border-gray-300 text-sm overflow-x-auto">
                {JSON.stringify(decodedData.payload, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Signature</h3>
              <pre className="p-3 bg-gray-50 rounded-md border border-gray-300 text-sm overflow-x-auto font-mono">
                {decodedData.signature}
              </pre>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key (for verification)
              </label>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret key to verify signature"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
              />
              <button
                onClick={handleVerify}
                className="w-full py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 font-medium"
              >
                Verify Signature
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {isValid !== null && (
          <div className={`flex items-center gap-2 p-3 rounded-md ${
            isValid
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            {isValid ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 text-sm">Valid signature</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700 text-sm">Invalid signature</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

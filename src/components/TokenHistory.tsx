import { useState, useEffect } from 'react';
import { History, Trash2, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TokenHistory as TokenHistoryType } from '../types/jwt';

export function TokenHistory() {
  const [history, setHistory] = useState<TokenHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('token_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteToken = async (id: string) => {
    try {
      const { error } = await supabase
        .from('token_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting token:', error);
    }
  };

  const clearHistory = async () => {
    try {
      const { error } = await supabase
        .from('token_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const copyToken = async (token: string, id: string) => {
    await navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-orange-600" />
          <h2 className="text-2xl font-bold text-gray-800">Token History</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tokens generated yet. Create your first token above!
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.token_type === 'access'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {item.token_type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-gray-700 break-all line-clamp-2">
                    {item.token}
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => copyToken(item.token, item.id)}
                    className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                    title="Copy token"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteToken(item.id)}
                    className="p-2 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete token"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

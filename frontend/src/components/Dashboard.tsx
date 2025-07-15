import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const plotsData = [
  { filename: 'meta1.png', title: 'Meta Analysis 1' },
  { filename: 'booth.png', title: 'Booth Function Analysis' },
  { filename: 'chankong.png', title: 'Chankong Analysis' },
  { filename: 'chankong2.png', title: 'Chankong Analysis 2' },
  { filename: 'chankong3.png', title: 'Chankong Analysis 3' },
  { filename: 'fit1.png', title: 'Fitness Analysis 1' },
  { filename: 'fit2.png', title: 'Fitness Analysis 2' },
  { filename: 'fit3.png', title: 'Fitness Analysis 3' },
  { filename: 'pareto.png', title: 'Pareto Front Analysis' },
  { filename: 'schaffer.png', title: 'Schaffer Function Analysis' },
  { filename: 'schaffer2.png', title: 'Schaffer Function Analysis 2' },
  { filename: 'te.png', title: 'Technical Efficiency Analysis' }
];

interface PredictionResult {
  prediction: number[];
  message: string;
  variables: number[][];
  solutions: number[][];
}

export default function Dashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState({
    blast_furnace_temp: '',
    hot_blast_pressure: '',
    oxygen_enrichment: '',
    humidity: '',
    coke_rate: '',
    pulverized_coal: '',
    slag_rate: '',
    sinter_rate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/predict',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 to-secondary-800">
      <nav className="bg-secondary-800 border-b border-primary-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-primary-500">Blast Furnace Optimizer</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-6 py-2 text-sm font-medium text-primary-500 hover:text-primary-400 border border-primary-500/20 rounded-md hover:bg-primary-500/10 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Parameter Input Form */}
          <div className="bg-secondary-800 shadow-xl rounded-lg p-8 border border-primary-500/20">
            <h2 className="text-xl font-semibold text-primary-500 mb-6">Enter Blast Furnace Parameters</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label htmlFor={key} className="block text-sm font-medium text-primary-400">
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </label>
                    <input
                      type="number"
                      name={key}
                      id={key}
                      value={value}
                      onChange={handleInputChange}
                      className="block w-full border border-secondary-600 rounded-md shadow-sm py-2 px-3 bg-secondary-700 text-primary-300 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      required
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className="rounded-md bg-red-900/20 border border-red-500/50 p-4">
                  <div className="text-sm text-red-400">{error}</div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-secondary-900 bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:scale-[1.02] ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : 'Predict'}
                </button>
              </div>
            </form>
          </div>

          {/* Prediction Results */}
          {result && (
            <div className="bg-secondary-800 shadow-xl rounded-lg p-8 border border-primary-500/20">
              <h3 className="text-xl font-semibold text-primary-500 mb-6">Prediction Results</h3>
              <ul className="bg-secondary-700 p-6 rounded-md border border-secondary-600 space-y-2">
                {Object.entries(formData).map(([key], idx) => (
                  <li key={key} className="text-primary-300">
                    <span className="font-medium text-primary-500">
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}:
                    </span>{' '}{result.prediction[idx]?.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-primary-400">
                Found <span className="font-medium text-primary-500">{result.solutions.length}</span> non-dominated solutions.
              </p>
            </div>
          )}

          {/* Plots Display */}
          <div className="bg-secondary-800 shadow-xl rounded-lg p-8 border border-primary-500/20">
            <h3 className="text-xl font-semibold text-primary-500 mb-6">Analysis Plots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plotsData.map((plot) => (
                <div key={plot.filename} className="bg-secondary-700 p-4 rounded-lg border border-secondary-600 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                  <h4 className="text-sm font-medium text-primary-400 mb-3">{plot.title}</h4>
                  <img
                    src={`/plots/${plot.filename}`}
                    alt={plot.title}
                    className="w-full h-auto rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
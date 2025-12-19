
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ReviewCard from './components/ReviewCard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { ReviewEntry } from './types';
import { analyzeReviewSentiment } from './services/geminiService';

const EXAMPLE_REVIEWS = [
  "The build quality of this laptop is absolutely stunning. It feels premium and the performance is snappy. Highly recommended!",
  "I'm disappointed with the shipping speed. It took three weeks to arrive, and the box was slightly crushed. Product itself is okay.",
  "Decent wireless earbuds for the price. Not the best sound quality, but they get the job done for the gym.",
  "STAY AWAY! The battery stopped charging after only 2 days. Customer support hasn't replied to my emails yet.",
  "Excellent customer service! They replaced my broken unit within 48 hours, no questions asked. The replacement works perfectly."
];

function App() {
  const [reviews, setReviews] = useState<ReviewEntry[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processReview = async (text: string) => {
    if (!text.trim()) return;

    const newReview: ReviewEntry = {
      id: crypto.randomUUID(),
      text: text.trim(),
      timestamp: Date.now(),
      status: 'analyzing'
    };

    setReviews(prev => [newReview, ...prev]);

    try {
      const result = await analyzeReviewSentiment(text);
      setReviews(prev => prev.map(r => 
        r.id === newReview.id 
          ? { ...r, status: 'completed', analysis: result } 
          : r
      ));
    } catch (err: any) {
      setReviews(prev => prev.map(r => 
        r.id === newReview.id 
          ? { ...r, status: 'error', error: err.message } 
          : r
      ));
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    
    setIsProcessing(true);
    await processReview(inputText);
    setInputText('');
    setIsProcessing(false);
  };

  const loadExampleData = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    for (const text of EXAMPLE_REVIEWS) {
      await processReview(text);
    }
    setIsProcessing(false);
  };

  const removeReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const clearAll = () => {
    if (window.confirm('Clear all reviews and analytics?')) {
      setReviews([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input and Analytics */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    <i className="fa-solid fa-pen-nib mr-2 text-indigo-500"></i>
                    Review Analysis Console
                  </h2>
                  <button 
                    onClick={loadExampleData}
                    disabled={isProcessing}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-tight flex items-center disabled:opacity-50"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles mr-1"></i>
                    Try Example Data
                  </button>
                </div>
                
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste a customer review here to analyze its sentiment..."
                    className="w-full h-32 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none outline-none text-slate-800"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                      Powered by Gemini 3 Flash
                    </p>
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isProcessing}
                      className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          Processing...
                        </>
                      ) : (
                        <>
                          Analyze Sentiment
                          <i className="fa-solid fa-paper-plane"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center">
                  <i className="fa-solid fa-chart-simple mr-2 text-indigo-500"></i>
                  Customer Opinion Dashboard
                </h2>
              </div>
              <AnalyticsDashboard reviews={reviews} />
            </section>
          </div>

          {/* Right Column: Feed */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-center sticky top-[80px] z-10 py-2 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center">
                <i className="fa-solid fa-comment-dots mr-2 text-indigo-500"></i>
                Analysis Feed
                <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] rounded-full">
                  {reviews.length}
                </span>
              </h2>
              {reviews.length > 0 && (
                <button 
                  onClick={clearAll}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-700 uppercase tracking-widest"
                >
                  Clear Feed
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <div className="py-12 px-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center">
                  <p className="text-slate-400 text-sm">No reviews analyzed yet.</p>
                </div>
              ) : (
                reviews.map(review => (
                  <ReviewCard 
                    key={review.id} 
                    review={review} 
                    onRemove={removeReview}
                  />
                ))
              )}
            </div>
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} SENTIX ANALYTICS • PRECISION CUSTOMER INSIGHTS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;


import React from 'react';
import { ReviewEntry, SentimentType } from '../types';

interface ReviewCardProps {
  review: ReviewEntry;
  onRemove: (id: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onRemove }) => {
  const isPositive = review.analysis?.sentiment === SentimentType.POSITIVE;
  const isNegative = review.analysis?.sentiment === SentimentType.NEGATIVE;
  const isNeutral = review.analysis?.sentiment === SentimentType.NEUTRAL;

  const getScoreColor = (score: number) => {
    if (score > 0.7) return 'bg-emerald-500';
    if (score < 0.4) return 'bg-rose-500';
    return 'bg-amber-500';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${
               isPositive ? 'bg-emerald-50 text-emerald-600' :
               isNegative ? 'bg-rose-50 text-rose-600' :
               'bg-slate-50 text-slate-500'
             }`}>
               {isPositive && <i className="fa-solid fa-thumbs-up"></i>}
               {isNegative && <i className="fa-solid fa-thumbs-down"></i>}
               {isNeutral && <i className="fa-solid fa-minus"></i>}
             </div>
             <div>
               <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
                 {review.analysis?.sentiment || 'Processing'}
               </h4>
               <span className="text-xs text-slate-400">
                 {new Date(review.timestamp).toLocaleTimeString()}
               </span>
             </div>
          </div>
          <button 
            onClick={() => onRemove(review.id)}
            className="text-slate-300 hover:text-rose-500 transition-colors"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <p className="text-slate-700 text-sm mb-4 line-clamp-3 italic">
          "{review.text}"
        </p>

        {review.status === 'analyzing' && (
          <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium animate-pulse">
            <i className="fa-solid fa-circle-notch fa-spin"></i>
            Analyzing sentiments...
          </div>
        )}

        {review.analysis && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {review.analysis.keyAspects.map((aspect, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded border border-slate-200">
                  {aspect}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-50">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">Sentiment Score</span>
                 <span className="text-xs font-bold text-slate-700">{Math.round(review.analysis.score * 100)}%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-1000 ${getScoreColor(review.analysis.score)}`}
                   style={{ width: `${review.analysis.score * 100}%` }}
                 ></div>
               </div>
               <p className="mt-2 text-xs text-slate-500 italic">
                 {review.analysis.reasoning}
               </p>
            </div>
          </div>
        )}

        {review.status === 'error' && (
          <div className="p-2 bg-rose-50 text-rose-600 text-xs rounded border border-rose-100">
            <i className="fa-solid fa-triangle-exclamation mr-1"></i>
            {review.error || 'Failed to process review'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;

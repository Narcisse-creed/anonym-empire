import React, { useState, useEffect, useRef } from 'react';
import { Review, StoreInfo } from '../types';
import { loadReviews, saveReviews } from '../utils/helpers';
import { Star, MessageCircle, Upload, Send, X } from 'lucide-react';

interface ReviewsSectionProps {
  storeInfo: StoreInfo;
  reviews?: Review[];
  onAddReview?: (reviewData: Omit<Review, 'id' | 'date'>) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  storeInfo,
  reviews: propReviews,
  onAddReview,
}) => {
  const [localReviews, setLocalReviews] = useState<Review[]>(loadReviews);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formComment, setFormComment] = useState('');
  const [formPhoto, setFormPhoto] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeReviews = propReviews !== undefined ? propReviews : localReviews;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    const reviewPayload = {
      rating: formRating,
      comment: formComment.trim(),
      authorName: formName.trim(),
      photoUrl: formPhoto || undefined,
      approved: false,
    };

    if (onAddReview) {
      onAddReview(reviewPayload);
    } else {
      const newReview: Review = {
        id: `review-${Date.now()}`,
        ...reviewPayload,
        date: new Date().toISOString(),
      };
      const updated = [newReview, ...localReviews];
      setLocalReviews(updated);
      saveReviews(updated);
    }

    setFormName('');
    setFormRating(5);
    setFormComment('');
    setFormPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowForm(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const approvedReviews = activeReviews.filter((r) => r.approved);

  return (
    <section id="reviews" className="py-16 bg-[#0B0B0B] text-white relative border-b border-[#D4AF37]/20">
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Avis Clients</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">Ce que nos clients disent</h2>
        </div>

        {submitSuccess && (
          <div className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm text-center shadow-lg animate-fadeIn">
            ✓ Merci pour votre avis ! Il a été envoyé avec succès et sera publié sur le site dès sa validation par l'administrateur.
          </div>
        )}

        {approvedReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {approvedReviews.map((review) => (
              <div key={review.id} className="bg-[#121212] rounded-2xl border border-[#D4AF37]/15 p-6 space-y-4 hover:border-[#D4AF37]/30 transition-all">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-700'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-300 font-sans leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-800">
                  {review.photoUrl && (
                    <img src={review.photoUrl} alt={review.authorName} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-white">{review.authorName}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{new Date(review.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#121212] rounded-2xl border border-gray-800 mb-10">
            <MessageCircle className="w-12 h-12 text-[#D4AF37]/30 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucun avis approuvé pour le moment.</p>
          </div>
        )}

        {!showForm ? (
          <div className="text-center">
            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 bg-[#1A160C] hover:bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold text-xs uppercase tracking-wider px-6 py-3 rounded-full transition-all cursor-pointer">
              <MessageCircle className="w-4 h-4" />
              Laisser un avis
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="bg-[#121212] rounded-2xl border border-[#D4AF37]/30 p-6 space-y-4 max-w-2xl mx-auto">
            <h3 className="text-lg font-serif font-bold text-[#D4AF37]">Votre Avis</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Votre Nom</label>
                <input type="text" required value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Marie D." className="w-full bg-black/80 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Note</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setFormRating(star)} className="p-1">
                      <Star className={`w-6 h-6 ${star <= formRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-700'}`} />
                    </button>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">{formRating}/5</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Commentaire</label>
              <textarea rows={3} required value={formComment} onChange={(e) => setFormComment(e.target.value)} placeholder="Partagez votre expérience..." className="w-full bg-black/80 border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Photo du produit (optionnel)</label>
              <div className="flex items-center gap-3">
                <label htmlFor="photo-upload" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A160C] border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold text-xs transition-all cursor-pointer shadow-md">
                  <Upload className="w-4 h-4" />
                  Choisir une photo
                </label>
                <input id="photo-upload" ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => setFormPhoto(reader.result as string);
                  reader.readAsDataURL(file);
                }} />
                {formPhoto && (
                  <div className="relative inline-flex items-center">
                    <img src={formPhoto} alt="Aperçu" className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30" />
                    <button type="button" onClick={() => { setFormPhoto(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-1 -right-1 bg-[#121212] border border-[#D4AF37]/30 text-[#D4AF37] rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-[#D4AF37] hover:text-black transition-all">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer">
                <Send className="w-4 h-4" />
                Envoyer l'avis
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-black border border-gray-700 text-gray-400 rounded-xl text-xs hover:text-white transition-all cursor-pointer">Annuler</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
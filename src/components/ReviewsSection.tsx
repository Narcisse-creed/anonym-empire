import React, { useState, useEffect, useRef } from 'react';
import { Review, StoreInfo } from '../types';
import { loadReviews, saveReviews } from '../utils/helpers';
import { Star, MessageCircle, Upload, Send, X } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { EditableText } from './editor/EditableText';

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
    <section id="reviews" className="py-16 bg-[#F8F6F2] relative border-b border-[#D4AF37]/20">
      <div className="max-w-7xl lg:max-w-[1400px] xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A160C] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            <EditableText path="pageTexts.reviews.badgeLabel" value={storeInfo.pageTexts?.reviews?.badgeLabel} defaultValue="Avis Clients" as="span" label="Badge Avis" />
          </div>
          <EditableText path="pageTexts.reviews.title" value={storeInfo.pageTexts?.reviews?.title} defaultValue="Ce que nos clients disent" as="h2" className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight" label="Titre Avis" />
        </div>

        {submitSuccess && (
          <div className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm text-center shadow-lg animate-fadeIn">
            ✓ Merci pour votre avis ! Il a été envoyé avec succès et sera publié sur le site dès sa validation par l'administrateur.
          </div>
        )}

        {approvedReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {approvedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-[#D4AF37]/15 p-6 space-y-4 hover:border-[#D4AF37]/35 transition-all shadow-sm">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-700 font-sans leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                  {review.photoUrl && (
                    <img src={review.photoUrl} alt={review.authorName} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{review.authorName}</p>
                    <p className="text-[10px] text-gray-500 font-mono">{new Date(review.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-200 mb-10">
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
          <form onSubmit={handleSubmitReview} className="bg-white rounded-2xl border border-[#D4AF37]/30 p-6 space-y-4 max-w-2xl mx-auto shadow-sm">
            <h3 className="text-lg font-serif font-bold text-[#D4AF37]">Votre Avis</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Votre Nom</label>
                <input type="text" required maxLength={80} value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Marie D." className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Note</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setFormRating(star)} className="p-1">
                      <Star className={`w-6 h-6 ${star <= formRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs text-gray-400 ml-2">{formRating}/5</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">Commentaire</label>
              <textarea rows={3} required maxLength={500} value={formComment} onChange={(e) => setFormComment(e.target.value)} placeholder="Partagez votre expérience..." className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:outline-none focus:border-[#D4AF37] placeholder:text-gray-400" />
            </div>

            <div>
              <ImageUploader
                label="Photo du produit (optionnel)"
                value={formPhoto || ''}
                onChange={(val) => setFormPhoto(val || null)}
                placeholder="Sélectionner une photo depuis votre galerie..."
                helperText="Format image (JPG, PNG, WEBP) — Max 5 Mo"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer">
                <Send className="w-4 h-4" />
                Envoyer l'avis
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 border border-gray-300 text-gray-600 rounded-xl text-xs hover:text-gray-900 transition-all cursor-pointer">Annuler</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
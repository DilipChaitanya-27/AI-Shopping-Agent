export default function FeatureCard({ icon, title, description, className = '' }) {
  return (
    <div className={`group bg-white/70 backdrop-blur-sm border border-white/50 rounded-3xl p-8 text-center shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 hover:border-indigo-200 ${className}`}>
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-xl mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
    </div>
  );
}


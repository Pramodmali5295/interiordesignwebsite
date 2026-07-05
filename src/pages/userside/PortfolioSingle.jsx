import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Tag, User, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const isVideoUrl = (url) => {
  if (!url) return false;
  const cleaned = url.trim();
  return (
    cleaned.includes("youtube.com") ||
    cleaned.includes("youtu.be") ||
    cleaned.includes("instagram.com") ||
    /\.(mp4|webm|ogg)$/i.test(cleaned)
  );
};

// Helper to determine cover image with fallback for video projects
const getProjectImage = (project) => {
  // If project.image is a direct image URL
  if (project.image && !isVideoUrl(project.image)) {
    return project.image;
  }
  // If project.image is a video URL
  if (project.image && isVideoUrl(project.image)) {
    const ytMatch = project.image.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  }
  // Backward compatibility check
  if (project.videoUrl) {
    const ytMatch = project.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  }
  // Fallback to first gallery image
  if (project.gallery && project.gallery.length > 0) {
    return project.gallery[0];
  }
  return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
};
import { fetchProjectBySlug, fetchProjects } from "../../services/portfolioService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Helper to parse YouTube, Instagram or direct video URLs
function getVideoEmbed(url) {
  if (!url) return null;

  const trimmedUrl = url.trim();

  // YouTube
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
  const ytMatch = trimmedUrl.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`
    };
  }

  // Instagram
  const igRegex = /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i;
  const igMatch = trimmedUrl.match(igRegex);
  if (igMatch && igMatch[1]) {
    return {
      type: "instagram",
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`
    };
  }

  // Direct video URL
  if (trimmedUrl.match(/\.(mp4|webm|ogg)$/i) || trimmedUrl.includes("storage.googleapis.com") || trimmedUrl.includes("firebasestorage.googleapis.com")) {
    return {
      type: "direct",
      embedUrl: trimmedUrl
    };
  }

  return null;
}

export default function PortfolioSingle() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [nextProject, setNextProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    async function loadProjectData() {
      setLoading(true);
      try {
        const currentProject = await fetchProjectBySlug(slug);
        setProject(currentProject);
        
        if (currentProject) {
          const allProjects = await fetchProjects();
          const currentIdx = allProjects.findIndex((p) => p.slug === slug);
          if (currentIdx !== -1) {
            const nextIdx = (currentIdx + 1) % allProjects.length;
            setNextProject(allProjects[nextIdx]);
          }
        }
      } catch (err) {
        console.error("Error loading project detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjectData();
  }, [slug]);

  // Premium Skeleton Loader for Single Project Details
  if (loading) {
    return (
      <div className="animate-pulse relative">
        {/* Banner Shimmer */}
        <div className="bg-stone-900 pt-36 pb-24 md:pt-44 md:pb-32 text-center">
          <div className="max-w-4xl mx-auto px-6 space-y-4 flex flex-col items-center">
            <div className="h-4 bg-stone-850 w-24 rounded" />
            <div className="h-10 bg-stone-850 w-1/2 rounded" />
            <div className="w-16 h-[1.5px] bg-studio-accent/30 mt-6" />
          </div>
        </div>
        {/* Gallery Shimmer */}
        <div className="bg-stone-950 py-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="aspect-[21/9] w-full bg-stone-900" />
          </div>
        </div>
        {/* Details Shimmer */}
        <div className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-8 bg-stone-200 w-1/3 rounded" />
              <div className="h-[1px] bg-stone-100 w-24" />
              <div className="h-4 bg-stone-100 w-full rounded" />
              <div className="h-4 bg-stone-100 w-5/6 rounded" />
              <div className="h-4 bg-stone-100 w-4/5 rounded" />
            </div>
            <div className="lg:col-span-4 bg-stone-50 border border-stone-200 p-8 space-y-6">
              <div className="h-6 bg-stone-200 w-1/2 rounded" />
              <div className="h-4 bg-stone-150 w-3/4 rounded" />
              <div className="h-4 bg-stone-150 w-2/3 rounded" />
              <div className="h-4 bg-stone-150 w-1/2 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where project isn't found
  if (!project) {
    return (
      <div className="pt-36 pb-24 text-center">
        <h2 className="text-3xl font-serif mb-6 text-stone-900">Project Not Found</h2>
        <Link to="/portfolio" className="text-xs uppercase tracking-widest text-studio-accent font-semibold border-b border-studio-accent pb-1">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Dynamic Project Hero Banner */}
      <section className="bg-stone-950 pt-36 pb-24 md:pt-44 md:pb-32 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url('${getProjectImage(project)}')` }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center md:items-start text-center md:text-left">
          <Link
            to="/portfolio"
            className="text-xs tracking-widest uppercase text-stone-300 hover:text-white flex items-center gap-2 transition-colors group mb-6"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Portfolio
          </Link>
          <span className="text-xs uppercase tracking-[0.3em] text-studio-accent block mb-3">{project.category} Commission</span>
          <h1 className="text-4xl md:text-6xl font-serif font-light tracking-wide uppercase">{project.title}</h1>
          <div className="w-16 h-[1px] bg-studio-accent mt-6"></div>
        </div>
      </section>

      {/* Premium Video Walkthrough Section */}
      {(() => {
        const targetVideoUrl = isVideoUrl(project.image) ? project.image : project.videoUrl;
        const videoData = getVideoEmbed(targetVideoUrl);
        if (!videoData) return null;
        return (
          <section className="bg-stone-950 pt-16 pb-8">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
              <div className="text-center mb-8">
                <span className="text-[10px] uppercase tracking-[0.3em] text-studio-accent block mb-2">Walkthrough</span>
                <h2 className="text-2xl md:text-3xl font-serif text-white font-light uppercase tracking-wider">
                  Project Video Showcase
                </h2>
                <div className="w-12 h-[1px] bg-studio-accent/50 mx-auto mt-4"></div>
              </div>
              
              <div className={`relative w-full shadow-2xl bg-stone-900 border border-stone-800 overflow-hidden ${
                videoData.type === "instagram" ? "max-w-md mx-auto aspect-[9/16]" : "aspect-video"
              }`}>
                {videoData.type === "youtube" && (
                  <iframe
                    src={videoData.embedUrl}
                    title="YouTube video player"
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                )}
                {videoData.type === "instagram" && (
                  <iframe
                    src={videoData.embedUrl}
                    title="Instagram post embed"
                    className="absolute inset-0 w-full h-full border-0"
                    allowTransparency="true"
                    allow="encrypted-media"
                    scrolling="no"
                    frameBorder="0"
                  ></iframe>
                )}
                {videoData.type === "direct" && (
                  <video
                    src={videoData.embedUrl}
                    controls
                    className="absolute inset-0 w-full h-full object-cover"
                  ></video>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Premium Gallery Grid (5 columns per row on desktop) */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="bg-stone-950 py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-studio-accent block mb-2">Gallery</span>
              <h2 className="text-2xl md:text-3xl font-serif text-white font-light uppercase tracking-wider">
                Project Gallery
              </h2>
              <div className="w-12 h-[1px] bg-studio-accent/50 mx-auto mt-4"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {project.gallery.map((imgUrl, index) => (
                <div
                  key={index}
                  className="overflow-hidden bg-stone-900 border border-stone-850 shadow-lg aspect-square relative group cursor-pointer"
                  onClick={() => setLightboxImage(imgUrl)}
                >
                  <img
                    src={imgUrl}
                    alt={`${project.title} detail ${index + 1}`}
                    className="object-cover w-full h-full transform scale-100 group-hover:scale-105 transition-all duration-500 brightness-90 group-hover:brightness-100"
                  />
                  {/* Subtle Elegant Hover Overlay */}
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-[9px] uppercase tracking-widest border border-white/30 px-3 py-1.5 backdrop-blur-sm">
                      Enlarge
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project Details Columns */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Description */}
          <div className="lg:col-span-8 space-y-6" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl font-serif text-stone-900 font-light uppercase tracking-wider mb-2">
              {project.title}
            </h1>
            <div className="gold-divider w-24 mb-6"></div>
            <p className="text-stone-600 font-light leading-relaxed text-base md:text-lg">
              {project.description}
            </p>
          </div>

          {/* Right Column: Spec Card */}
          <div className="lg:col-span-4" data-aos="fade-left">
            <div className="bg-studio-light border border-stone-200 p-8 space-y-6 sticky top-28">
              <h3 className="font-serif text-xl text-stone-900 tracking-wide border-b border-stone-200 pb-4">
                Project Details
              </h3>
              
              <ul className="space-y-4 text-sm font-light text-stone-600">
                {project.client && (
                  <li className="flex items-start gap-4">
                    <User size={16} className="text-studio-accent mt-1 shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-stone-400">Client</span>
                      <span className="text-stone-900 font-normal">{project.client}</span>
                    </div>
                  </li>
                )}
                {project.location && (
                  <li className="flex items-start gap-4">
                    <MapPin size={16} className="text-studio-accent mt-1 shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-stone-400">Location</span>
                      <span className="text-stone-900 font-normal">{project.location}</span>
                    </div>
                  </li>
                )}
                {project.scope && (
                  <li className="flex items-start gap-4">
                    <Tag size={16} className="text-studio-accent mt-1 shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-stone-400">Scope</span>
                      <span className="text-stone-900 font-normal">{project.scope}</span>
                    </div>
                  </li>
                )}
                {project.year && (
                  <li className="flex items-start gap-4">
                    <Calendar size={16} className="text-studio-accent mt-1 shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-stone-400">Year</span>
                      <span className="text-stone-900 font-normal">{project.year}</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Next Project & Navigation */}
      {nextProject && (
        <section className="border-t border-stone-200 bg-studio-light py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <Link
              to="/portfolio"
              className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 border-b border-stone-300 pb-1 hover:border-stone-900 transition-colors"
            >
              All Portfolios
            </Link>

            <Link
              to={`/portfolio/${nextProject.slug}`}
              className="group flex flex-col items-center md:items-end text-center md:text-right"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Next Project</span>
              <span className="font-serif text-2xl text-stone-900 group-hover:text-studio-accent transition-colors flex items-center gap-2 mt-1">
                {nextProject.title}
                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300 text-studio-accent" />
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* Consultation Banner */}
      <section className="bg-stone-950 text-center py-20 border-t border-stone-900">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center">
          <span className="text-xs uppercase tracking-[0.3em] text-studio-accent block mb-4">Interested in a similar approach?</span>
          <h2 className="text-3xl md:text-4xl font-serif text-white font-light uppercase tracking-wider mb-8">
            Create Your Custom Space
          </h2>
          <Link
            to="/contact"
            className="group relative inline-flex items-center justify-center bg-studio-accent text-stone-950 px-10 py-4 text-xs tracking-widest uppercase transition-all duration-500 overflow-hidden shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-2 pointer-events-none transition-colors duration-500 group-hover:text-white">
              Initiate Consultation
              <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </span>
            <span className="absolute inset-0 bg-stone-900 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0 pointer-events-none" />
          </Link>
        </div>
      </section>

      {/* Premium Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-stone-950/95 backdrop-blur-md z-[9999] flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 text-xs tracking-widest font-sans uppercase focus:outline-none"
            onClick={() => setLightboxImage(null)}
          >
            ✕ Close
          </button>
          
          <img
            src={lightboxImage}
            alt="Enlarged gallery item"
            className="max-w-full max-h-[85vh] object-contain shadow-2xl border border-stone-800"
          />
        </div>
      )}
    </div>
  );
}

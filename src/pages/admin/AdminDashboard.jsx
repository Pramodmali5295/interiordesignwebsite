import { useState, useEffect } from "react";
import { fetchProjects, addProject, updateProject, deleteProject } from "../../services/portfolioService";
import { fetchServices, addService, updateService, deleteService } from "../../services/serviceService";
import { fetchTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from "../../services/testimonialService";
import { fetchInquiries, deleteInquiry } from "../../services/inquiryService";
import { fetchStats, addStat, updateStat, deleteStat, fetchAboutContent, updateAboutContent, fetchTimeline, addTimelineStep, updateTimelineStep, deleteTimelineStep } from "../../services/aboutService";
import { fetchContactSettings, updateContactSettings, defaultContactSettings } from "../../services/contactService";
import { LogOut, Plus, Trash2, Edit2, ShieldAlert, ArrowRight, Eye, Mail, Calendar, MapPin, Briefcase } from "lucide-react";

export default function AdminDashboard() {
  // Authentication State
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("about-content");

  // Data States
  const [projectsList, setProjectsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [inquiriesList, setInquiriesList] = useState([]);
  const [statsList, setStatsList] = useState([]);
  const [timelineList, setTimelineList] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);
  const [contactSettings, setContactSettings] = useState(null);
  const [isContentSaving, setIsContentSaving] = useState(false);
  const [isContactSaving, setIsContactSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals & Form States
  const [showModal, setShowModal] = useState(false); // "add" | "edit" | null
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({});

  // View Inquiry Modal State
  const [activeInquiry, setActiveInquiry] = useState(null);

  // Authentication Check
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === "aura2026") {
      setIsAuthenticated(true);
      setAuthError(false);
      localStorage.setItem("aura_admin_auth", "true");
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("aura_admin_auth");
  };

  useEffect(() => {
    const isAuthed = localStorage.getItem("aura_admin_auth");
    if (isAuthed === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadData() {
      setLoading(true);
      setErrorMsg(null);
      try {
        if (activeTab === "projects") {
          const data = await fetchProjects();
          setProjectsList(data);
        } else if (activeTab === "services") {
          const data = await fetchServices();
          setServicesList(data);
        } else if (activeTab === "testimonials") {
          const data = await fetchTestimonials();
          setTestimonialsList(data);
        } else if (activeTab === "inquiries") {
          const data = await fetchInquiries();
          setInquiriesList(data);
        } else if (activeTab === "stats") {
          const data = await fetchStats();
          setStatsList(data);
        } else if (activeTab === "timeline") {
          const data = await fetchTimeline();
          setTimelineList(data);
        } else if (activeTab === "about-content") {
          const data = await fetchAboutContent();
          setAboutContent(data || {});
        } else if (activeTab === "contact-settings") {
          let data = await fetchContactSettings();
          if (!data) {
            data = defaultContactSettings;
            await updateContactSettings(data);
          }
          setContactSettings(data);
        }
      } catch (err) {
        console.error("Error loading admin data:", err);
        setErrorMsg("Failed to synchronize with Firestore. Error: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated, activeTab]);

  // Handle Form Open for Add/Edit
  const openForm = (type, item = null) => {
    setShowModal(type);
    if (type === "edit" && item) {
      setEditId(item.id);
      if (activeTab === "projects") {
        setFormData({
          title: item.title,
          category: item.category,
          client: item.client,
          year: item.year,
          location: item.location,
          scope: item.scope,
          shortDesc: item.shortDesc,
          description: item.description,
          image: item.image,
          gallery: item.gallery ? item.gallery.join(", ") : "",
          videoUrl: item.videoUrl || "",
        });
      } else if (activeTab === "services") {
        setFormData({
          title: item.title,
          icon: item.icon || "Home",
          shortDesc: item.shortDesc,
          longDesc: item.longDesc,
          image: item.image,
        });
      } else if (activeTab === "testimonials") {
        setFormData({
          name: item.name,
          company: item.company,
          role: item.role || "",
          text: item.text,
          category: item.category || "Residential",
          rating: item.rating || 5,
        });
      } else if (activeTab === "stats") {
        setFormData({
          label: item.label,
          value: item.value,
          suffix: item.suffix || "",
        });
      } else if (activeTab === "timeline") {
        setFormData({
          step: item.step,
          title: item.title,
          desc: item.desc,
        });
      }
    } else {
      setEditId(null);
      if (activeTab === "projects") {
        setFormData({
          title: "",
          category: "Residential",
          client: "",
          year: new Date().getFullYear().toString(),
          location: "",
          scope: "",
          shortDesc: "",
          description: "",
          image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&h=800&q=85",
          gallery: "",
          videoUrl: "",
        });
      } else if (activeTab === "services") {
        setFormData({
          title: "",
          icon: "Home",
          shortDesc: "",
          longDesc: "",
          image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&h=800&q=85",
        });
      } else if (activeTab === "testimonials") {
        setFormData({
          name: "",
          company: "",
          role: "",
          text: "",
          category: "Residential",
          rating: 5,
        });
      } else if (activeTab === "stats") {
        setFormData({
          label: "",
          value: "",
          suffix: "",
        });
      } else if (activeTab === "timeline") {
        setFormData({
          step: "",
          title: "",
          desc: "",
        });
      }
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === "projects") {
        const parsedGallery = formData.gallery
          ? formData.gallery.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
          : [];

        const projectPayload = {
          ...formData,
          gallery: parsedGallery,
          image: parsedGallery[0] || "",
        };

        if (showModal === "add") {
          const added = await addProject(projectPayload);
          setProjectsList([added, ...projectsList]);
        } else {
          await updateProject(editId, projectPayload);
          setProjectsList(
            projectsList.map((p) => (p.id === editId ? { ...p, ...projectPayload } : p))
          );
        }
      } else if (activeTab === "services") {
        if (showModal === "add") {
          const added = await addService(formData);
          setServicesList([added, ...servicesList]);
        } else {
          await updateService(editId, formData);
          setServicesList(
            servicesList.map((s) => (s.id === editId ? { ...s, ...formData } : s))
          );
        }
      } else if (activeTab === "testimonials") {
        const payload = {
          ...formData,
          rating: Number(formData.rating || 5)
        };
        if (showModal === "add") {
          const added = await addTestimonial(payload);
          setTestimonialsList([added, ...testimonialsList]);
        } else {
          await updateTestimonial(editId, payload);
          setTestimonialsList(
            testimonialsList.map((t) => (t.id === editId ? { ...t, ...payload } : t))
          );
        }
      } else if (activeTab === "stats") {
        const payload = {
          ...formData,
          value: Number(formData.value || 0)
        };
        if (showModal === "add") {
          const added = await addStat(payload);
          setStatsList([...statsList, added]);
        } else {
          await updateStat(editId, payload);
          setStatsList(
            statsList.map((s) => (s.id === editId ? { ...s, ...payload } : s))
          );
        }
      } else if (activeTab === "timeline") {
        if (showModal === "add") {
          const added = await addTimelineStep(formData);
          setTimelineList([...timelineList, added].sort((a, b) => a.step.localeCompare(b.step)));
        } else {
          await updateTimelineStep(editId, formData);
          setTimelineList(
            timelineList.map((s) => (s.id === editId ? { ...s, ...formData } : s)).sort((a, b) => a.step.localeCompare(b.step))
          );
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error("Form submit failed:", err);
      alert("Action failed. Please verify console log.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item? This action is permanent.")) return;
    setLoading(true);
    try {
      if (activeTab === "projects") {
        await deleteProject(id);
        setProjectsList(projectsList.filter((p) => p.id !== id));
      } else if (activeTab === "services") {
        await deleteService(id);
        setServicesList(servicesList.filter((s) => s.id !== id));
      } else if (activeTab === "testimonials") {
        await deleteTestimonial(id);
        setTestimonialsList(testimonialsList.filter((t) => t.id !== id));
      } else if (activeTab === "inquiries") {
        await deleteInquiry(id);
        setInquiriesList(inquiriesList.filter((i) => i.id !== id));
      } else if (activeTab === "stats") {
        await deleteStat(id);
        setStatsList(statsList.filter((s) => s.id !== id));
      } else if (activeTab === "timeline") {
        await deleteTimelineStep(id);
        setTimelineList(timelineList.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    setIsContentSaving(true);
    try {
      await updateAboutContent(aboutContent);
      alert("About content saved successfully.");
    } catch (err) {
      console.error("Save content failed", err);
      alert("Failed to save content.");
    } finally {
      setIsContentSaving(false);
    }
  };

  const handleSaveContactSettings = async (e) => {
    e.preventDefault();
    setIsContactSaving(true);
    try {
      await updateContactSettings(contactSettings);
      alert("Contact settings saved successfully.");
    } catch (err) {
      console.error("Save contact settings failed", err);
      alert("Failed to save contact settings.");
    } finally {
      setIsContactSaving(false);
    }
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
        {/* Soft Background Radial Light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-stone-950 opacity-90 z-0" />
        
        <div className="relative z-10 w-full max-w-md bg-stone-900/60 backdrop-blur-md border border-stone-800 p-8 md:p-10 shadow-2xl text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-studio-accent block mb-3">AURA Admin Gateway</span>
          <h2 className="text-3xl font-serif text-white uppercase tracking-wider font-light mb-8">Studio Portal</h2>
          
          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-stone-400 mb-2">Access Passcode</label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="ENTER ACCESS CODE"
                className="w-full bg-stone-950 border border-stone-850 px-4 py-3 text-sm text-white focus:outline-none focus:border-studio-accent transition-colors tracking-widest text-center"
                required
              />
            </div>
            
            {authError && (
              <p className="text-red-500 text-xs tracking-wider uppercase text-center flex items-center justify-center gap-2">
                <ShieldAlert size={14} /> Incorrect Passcode
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-studio-accent text-stone-950 font-sans text-xs tracking-widest uppercase py-3.5 hover:bg-white hover:text-stone-900 transition-luxury font-semibold cursor-pointer flex items-center justify-center gap-2"
            >
              Sign In <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-stone-200 pb-8 mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-stone-400 block mb-2">Design Studio Platform</span>
            <h1 className="text-4xl font-serif text-stone-900 font-light uppercase tracking-wider">AURA Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs tracking-widest uppercase border border-stone-300 hover:border-stone-900 text-stone-600 hover:text-stone-900 px-5 py-2.5 transition-colors cursor-pointer"
            >
              <LogOut size={14} /> Log Out
            </button>
          </div>
        </div>

        {/* Dashboard Tabs & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 mb-8 border-b border-stone-200 pb-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "about-content", label: "About Content" },
              { id: "timeline", label: "About Timeline" },
              { id: "stats", label: "About Stats" },
              { id: "services", label: "Design Services" },
              { id: "projects", label: "Projects" },
              { id: "testimonials", label: "Testimonials" },
              { id: "contact-settings", label: "Contact Settings" },
              { id: "inquiries", label: "Contact Inquiries" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs tracking-widest uppercase py-2.5 px-4 relative focus:outline-none transition-colors ${
                  activeTab === tab.id
                    ? "text-studio-accent font-semibold"
                    : "text-stone-400 hover:text-stone-800"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-studio-accent" />
                )}
              </button>
            ))}
          </div>

          {activeTab !== "inquiries" && activeTab !== "about-content" && activeTab !== "contact-settings" && (
            <button
              onClick={() => openForm("add")}
              className="bg-stone-900 text-white hover:bg-studio-accent hover:text-stone-950 px-6 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md font-semibold"
            >
              <Plus size={16} /> Add {activeTab === "projects" ? "Project" : activeTab === "services" ? "Service" : activeTab === "testimonials" ? "Testimonial" : activeTab === "stats" ? "Stat" : "Timeline Step"}
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-250 text-red-800 p-4 mb-8 text-sm flex flex-col gap-1 uppercase tracking-wider">
            <span className="font-semibold flex items-center gap-2">
              <ShieldAlert size={16} /> Database Connection Alert
            </span>
            <span className="font-light text-xs font-mono normal-case break-all">{errorMsg}</span>
          </div>
        )}

        {/* Content Loading Overlay */}
        {loading && !showModal && (
          <div className="text-center py-20 text-stone-400 animate-pulse uppercase text-xs tracking-widest">
            Synchronizing data with Cloud Firestore...
          </div>
        )}

        {/* Dynamic Panels */}
        {!loading && (
          <div>
            {/* PROJECTS PANEL */}
            {activeTab === "projects" && (
              <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-[10px] tracking-widest uppercase text-stone-400">
                      <th className="py-4 px-6 font-semibold">Image</th>
                      <th className="py-4 px-6 font-semibold">Title</th>
                      <th className="py-4 px-6 font-semibold">Category</th>
                      <th className="py-4 px-6 font-semibold">Location</th>
                      <th className="py-4 px-6 font-semibold">Year</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-stone-150">
                    {projectsList.map((proj) => (
                      <tr key={proj.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <img src={proj.image} alt={proj.title} className="w-12 h-8 object-cover border border-stone-200" />
                        </td>
                        <td className="py-4 px-6 font-medium text-stone-900">{proj.title}</td>
                        <td className="py-4 px-6 text-stone-600">{proj.category}</td>
                        <td className="py-4 px-6 text-stone-500">{proj.location}</td>
                        <td className="py-4 px-6 text-stone-500">{proj.year}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openForm("edit", proj)}
                            className="p-2 text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-colors cursor-pointer inline-flex"
                            title="Edit Project"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id)}
                            className="p-2 text-stone-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors cursor-pointer inline-flex"
                            title="Delete Project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {projectsList.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-stone-400">No project items found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* SERVICES PANEL */}
            {activeTab === "services" && (
              <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-[10px] tracking-widest uppercase text-stone-400">
                      <th className="py-4 px-6 font-semibold">Image</th>
                      <th className="py-4 px-6 font-semibold">Title</th>
                      <th className="py-4 px-6 font-semibold">Icon</th>
                      <th className="py-4 px-6 font-semibold">Description Snippet</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-stone-150">
                    {servicesList.map((service) => (
                      <tr key={service.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <img src={service.image} alt={service.title} className="w-12 h-8 object-cover border border-stone-200" />
                        </td>
                        <td className="py-4 px-6 font-medium text-stone-900">{service.title}</td>
                        <td className="py-4 px-6 text-stone-500 font-mono text-xs">{service.icon}</td>
                        <td className="py-4 px-6 text-stone-500 max-w-xs truncate">{service.shortDesc}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openForm("edit", service)}
                            className="p-2 text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-colors cursor-pointer inline-flex"
                            title="Edit Service"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="p-2 text-stone-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors cursor-pointer inline-flex"
                            title="Delete Service"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {servicesList.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-stone-400">No service items found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TESTIMONIALS PANEL */}
            {activeTab === "testimonials" && (
              <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-[10px] tracking-widest uppercase text-stone-400">
                      <th className="py-4 px-6 font-semibold">Client Name</th>
                      <th className="py-4 px-6 font-semibold">Company / Role</th>
                      <th className="py-4 px-6 font-semibold">Review Text</th>
                      <th className="py-4 px-6 font-semibold">Category</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-stone-150">
                    {testimonialsList.map((t) => (
                      <tr key={t.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-stone-900">{t.name}</td>
                        <td className="py-4 px-6">
                          <div className="text-stone-900">{t.company}</div>
                          <div className="text-[10px] text-stone-400 uppercase tracking-widest">{t.role}</div>
                        </td>
                        <td className="py-4 px-6 text-stone-500 max-w-sm truncate italic">“{t.text}”</td>
                        <td className="py-4 px-6 text-stone-500">{t.category}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openForm("edit", t)}
                            className="p-2 text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-colors cursor-pointer inline-flex"
                            title="Edit Testimonial"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-2 text-stone-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors cursor-pointer inline-flex"
                            title="Delete Testimonial"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {testimonialsList.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-stone-400">No testimonials found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* STATS PANEL */}
            {activeTab === "stats" && (
              <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-[10px] tracking-widest uppercase text-stone-400">
                      <th className="py-4 px-6 font-semibold">Label</th>
                      <th className="py-4 px-6 font-semibold">Value</th>
                      <th className="py-4 px-6 font-semibold">Suffix</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-stone-150">
                    {statsList.map((s) => (
                      <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-stone-900">{s.label}</td>
                        <td className="py-4 px-6 text-stone-500">{s.value}</td>
                        <td className="py-4 px-6 text-stone-500">{s.suffix}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openForm("edit", s)}
                            className="p-2 text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-colors cursor-pointer inline-flex"
                            title="Edit Stat"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 text-stone-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors cursor-pointer inline-flex"
                            title="Delete Stat"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {statsList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-stone-400">No stats found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TIMELINE PANEL */}
            {activeTab === "timeline" && (
              <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-[10px] tracking-widest uppercase text-stone-400">
                      <th className="py-4 px-6 font-semibold w-16">Step</th>
                      <th className="py-4 px-6 font-semibold w-1/4">Title</th>
                      <th className="py-4 px-6 font-semibold">Description</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-stone-150">
                    {timelineList.map((s) => (
                      <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6 font-bold text-stone-900">{s.step}</td>
                        <td className="py-4 px-6 font-medium text-stone-900">{s.title}</td>
                        <td className="py-4 px-6 text-stone-500 max-w-sm truncate">{s.desc}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openForm("edit", s)}
                            className="p-2 text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-colors cursor-pointer inline-flex"
                            title="Edit Step"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2 text-stone-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors cursor-pointer inline-flex"
                            title="Delete Step"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {timelineList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-stone-400">No timeline steps found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ABOUT CONTENT PANEL */}
            {activeTab === "about-content" && aboutContent && (
              <div className="bg-white border border-stone-200 p-8 shadow-sm">
                <form onSubmit={handleSaveContent} className="space-y-10">
                  {/* Hero Banner */}
                  <div className="space-y-4">
                    <h4 className="text-sm uppercase tracking-widest text-stone-900 font-semibold border-b border-stone-100 pb-2">Hero Banner Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Subtitle</label>
                        <input
                          type="text"
                          value={aboutContent.heroSubtitle || ""}
                          onChange={(e) => setAboutContent({ ...aboutContent, heroSubtitle: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Main Title</label>
                        <input
                          type="text"
                          value={aboutContent.heroTitle || ""}
                          onChange={(e) => setAboutContent({ ...aboutContent, heroTitle: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Banner Background Image URL</label>
                      <input
                        type="url"
                        value={aboutContent.heroBannerImage || ""}
                        onChange={(e) => setAboutContent({ ...aboutContent, heroBannerImage: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-xs font-mono focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                  </div>

                  {/* Story & Philosophy */}
                  <div className="space-y-4">
                    <h4 className="text-sm uppercase tracking-widest text-stone-900 font-semibold border-b border-stone-100 pb-2">Story & Philosophy Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Subtitle</label>
                        <input
                          type="text"
                          value={aboutContent.storySubtitle || ""}
                          onChange={(e) => setAboutContent({ ...aboutContent, storySubtitle: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Main Heading</label>
                        <input
                          type="text"
                          value={aboutContent.storyTitle || ""}
                          onChange={(e) => setAboutContent({ ...aboutContent, storyTitle: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Paragraph 1</label>
                      <textarea
                        value={aboutContent.storyParagraph1 || ""}
                        onChange={(e) => setAboutContent({ ...aboutContent, storyParagraph1: e.target.value })}
                        rows="3"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Paragraph 2</label>
                      <textarea
                        value={aboutContent.storyParagraph2 || ""}
                        onChange={(e) => setAboutContent({ ...aboutContent, storyParagraph2: e.target.value })}
                        rows="3"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Side Image URL</label>
                      <input
                        type="url"
                        value={aboutContent.storyImage || ""}
                        onChange={(e) => setAboutContent({ ...aboutContent, storyImage: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-xs font-mono focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Image Quote (Overlay)</label>
                      <input
                        type="text"
                        value={aboutContent.storyQuote || ""}
                        onChange={(e) => setAboutContent({ ...aboutContent, storyQuote: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                  </div>

                  {/* Founder Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm uppercase tracking-widest text-stone-900 font-semibold border-b border-stone-100 pb-2">Founder Section</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Role / Subtitle</label>
                        <input
                          type="text"
                          value={aboutContent.founderSubtitle || ""}
                          onChange={(e) => setAboutContent({ ...aboutContent, founderSubtitle: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Founder Name</label>
                        <input
                          type="text"
                          value={aboutContent.founderName || ""}
                          onChange={(e) => setAboutContent({ ...aboutContent, founderName: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Credentials / Titles</label>
                      <input
                        type="text"
                        value={aboutContent.founderTitle || ""}
                        onChange={(e) => setAboutContent({ ...aboutContent, founderTitle: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Paragraph 1</label>
                      <textarea
                        value={aboutContent.founderParagraph1 || ""}
                        onChange={(e) => setAboutContent({ ...aboutContent, founderParagraph1: e.target.value })}
                        rows="3"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Paragraph 2 (Quote block)</label>
                      <textarea
                        value={aboutContent.founderParagraph2 || ""}
                        onChange={(e) => setAboutContent({ ...aboutContent, founderParagraph2: e.target.value })}
                        rows="3"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Founder Image URL</label>
                      <input
                        type="url"
                        value={aboutContent.founderImage || ""}
                        onChange={(e) => setAboutContent({ ...aboutContent, founderImage: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-xs font-mono focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                  </div>

                  {/* Timeline Header */}
                  <div className="space-y-4">
                    <h4 className="text-sm uppercase tracking-widest text-stone-900 font-semibold border-b border-stone-100 pb-2">Timeline Header</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Subtitle</label>
                        <input
                          type="text"
                          value={aboutContent.timelineSubtitle || ""}
                          onChange={(e) => setAboutContent({ ...aboutContent, timelineSubtitle: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Main Heading</label>
                        <input
                          type="text"
                          value={aboutContent.timelineTitle || ""}
                          onChange={(e) => setAboutContent({ ...aboutContent, timelineTitle: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-6">
                    <button
                      type="submit"
                      disabled={isContentSaving}
                      className="bg-stone-900 text-white hover:bg-studio-accent hover:text-stone-950 px-8 py-3 text-xs tracking-widest uppercase font-semibold transition-all duration-300 w-full md:w-auto cursor-pointer disabled:opacity-50"
                    >
                      {isContentSaving ? "Saving Content..." : "Save About Content"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* CONTACT SETTINGS PANEL */}
            {activeTab === "contact-settings" && contactSettings && (
              <div className="bg-white border border-stone-200 p-8 shadow-sm">
                <form onSubmit={handleSaveContactSettings} className="space-y-10">
                  {/* Basic Contact Info */}
                  <div className="space-y-4">
                    <h4 className="text-sm uppercase tracking-widest text-stone-900 font-semibold border-b border-stone-100 pb-2">HQ Contact Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Address Line 1</label>
                        <input
                          type="text"
                          value={contactSettings.addressLine1 || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, addressLine1: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Address Line 2 (City, Zip)</label>
                        <input
                          type="text"
                          value={contactSettings.addressLine2 || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, addressLine2: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Direct Phone Line</label>
                        <input
                          type="text"
                          value={contactSettings.phone || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, phone: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Electronic Mail</label>
                        <input
                          type="email"
                          value={contactSettings.email || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, email: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Business Hours Line 1</label>
                        <input
                          type="text"
                          value={contactSettings.hoursLine1 || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, hoursLine1: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Business Hours Line 2</label>
                        <input
                          type="text"
                          value={contactSettings.hoursLine2 || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, hoursLine2: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-sm focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-4">
                    <h4 className="text-sm uppercase tracking-widest text-stone-900 font-semibold border-b border-stone-100 pb-2">Social Media Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Instagram URL</label>
                        <input
                          type="url"
                          value={contactSettings.social_instagram || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, social_instagram: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-xs font-mono focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Facebook URL</label>
                        <input
                          type="url"
                          value={contactSettings.social_facebook || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, social_facebook: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-xs font-mono focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">LinkedIn URL</label>
                        <input
                          type="url"
                          value={contactSettings.social_linkedin || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, social_linkedin: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-xs font-mono focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">YouTube URL</label>
                        <input
                          type="url"
                          value={contactSettings.social_youtube || ""}
                          onChange={(e) => setContactSettings({ ...contactSettings, social_youtube: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-xs font-mono focus:outline-none focus:border-studio-accent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Google Map Embedded iframe source */}
                  <div className="space-y-4">
                    <h4 className="text-sm uppercase tracking-widest text-stone-900 font-semibold border-b border-stone-100 pb-2">Location Map</h4>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Google Maps Embed URL (src)</label>
                      <textarea
                        value={contactSettings.mapUrl || ""}
                        onChange={(e) => setContactSettings({ ...contactSettings, mapUrl: e.target.value })}
                        rows="3"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 text-xs font-mono focus:outline-none focus:border-studio-accent"
                        placeholder="https://www.google.com/maps/embed?pb=..."
                      ></textarea>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 pt-6">
                    <button
                      type="submit"
                      disabled={isContactSaving}
                      className="bg-stone-900 text-white hover:bg-studio-accent hover:text-stone-950 px-8 py-3 text-xs tracking-widest uppercase font-semibold transition-all duration-300 w-full md:w-auto cursor-pointer disabled:opacity-50"
                    >
                      {isContactSaving ? "Saving Settings..." : "Save Contact Settings"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* INQUIRIES PANEL */}
            {activeTab === "inquiries" && (
              <div className="bg-white border border-stone-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-stone-200 bg-stone-50 text-[10px] tracking-widest uppercase text-stone-400">
                      <th className="py-4 px-6 font-semibold">Date</th>
                      <th className="py-4 px-6 font-semibold">Client</th>
                      <th className="py-4 px-6 font-semibold">Subject</th>
                      <th className="py-4 px-6 font-semibold">Message Snippet</th>
                      <th className="py-4 px-6 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-stone-150">
                    {inquiriesList.map((inq) => (
                      <tr key={inq.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-4 px-6 text-stone-500 text-xs">
                          {inq.timestamp ? new Date(inq.timestamp).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-stone-900">{inq.name}</div>
                          <div className="text-stone-400 text-xs font-mono">{inq.email}</div>
                        </td>
                        <td className="py-4 px-6 text-stone-800 font-medium">{inq.subject}</td>
                        <td className="py-4 px-6 text-stone-500 max-w-xs truncate">{inq.message}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => setActiveInquiry(inq)}
                            className="p-2 text-stone-500 hover:text-stone-900 border border-transparent hover:border-stone-200 transition-colors cursor-pointer inline-flex"
                            title="View Message"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(inq.id)}
                            className="p-2 text-stone-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors cursor-pointer inline-flex"
                            title="Delete Message"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {inquiriesList.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-stone-400">No contact messages received.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE & EDIT MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white border border-stone-200 w-full max-w-2xl p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <h3 className="font-serif text-2xl text-stone-900 uppercase tracking-wider mb-6 border-b border-stone-200 pb-4">
              {showModal === "add" ? "Create New" : "Edit"} {activeTab === "projects" ? "Project" : activeTab === "services" ? "Service" : activeTab === "testimonials" ? "Testimonial" : activeTab === "stats" ? "Stat" : "Timeline Step"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              {/* Form fields for Projects */}
              {activeTab === "projects" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Project Title</label>
                      <input
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Category</label>
                      <select
                        value={formData.category || "Residential"}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Renovation">Renovation</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Client</label>
                      <input
                        type="text"
                        value={formData.client || ""}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location || ""}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Year</label>
                      <input
                        type="text"
                        value={formData.year || ""}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Scope of Work</label>
                    <input
                      type="text"
                      value={formData.scope || ""}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      placeholder="e.g. Full-scale interior architecture, bespoke curation"
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Short Teaser Summary</label>
                    <input
                      type="text"
                      value={formData.shortDesc || ""}
                      onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Detailed Narrative Description</label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">
                      Gallery Images (comma separated list of URLs. First URL will be automatically used as the Cover Image)
                    </label>
                    <textarea
                      value={formData.gallery || ""}
                      onChange={(e) => setFormData({ ...formData, gallery: e.target.value })}
                      rows="2"
                      placeholder="https://image1.com, https://image2.com"
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent font-mono text-xs"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">
                      Video URL (YouTube, Instagram, or direct video link)
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl || ""}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent font-mono text-xs"
                    />
                  </div>
                </>
              )}

              {/* Form fields for Services */}
              {activeTab === "services" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Service Title</label>
                      <input
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Lucide Icon Name</label>
                      <select
                        value={formData.icon || "Home"}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      >
                        <option value="Home">Home</option>
                        <option value="Briefcase">Briefcase</option>
                        <option value="LayoutGrid">LayoutGrid</option>
                        <option value="Compass">Compass</option>
                        <option value="Hammer">Hammer</option>
                        <option value="Layers">Layers</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Short Description Teaser</label>
                    <input
                      type="text"
                      value={formData.shortDesc || ""}
                      onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Long Description</label>
                    <textarea
                      value={formData.longDesc || ""}
                      onChange={(e) => setFormData({ ...formData, longDesc: e.target.value })}
                      rows="4"
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Service Image URL</label>
                    <input
                      type="url"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent font-mono text-xs"
                      required
                    />
                  </div>
                </>
              )}

              {/* Form fields for Testimonials */}
              {activeTab === "testimonials" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Client Name</label>
                      <input
                        type="text"
                        value={formData.name || ""}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={formData.company || ""}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Client Role / Profession</label>
                      <input
                        type="text"
                        value={formData.role || ""}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. Art Curator, Managing Director"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Project Category</label>
                      <select
                        value={formData.category || "Residential"}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Renovation">Renovation</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Review Quote Content</label>
                    <textarea
                      value={formData.text || ""}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      rows="4"
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      required
                    ></textarea>
                  </div>
                </>
              )}

              {/* Form fields for Stats */}
              {activeTab === "stats" && (
                <>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Label</label>
                    <input
                      type="text"
                      value={formData.label || ""}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Value</label>
                      <input
                        type="number"
                        value={formData.value || ""}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Suffix (Optional)</label>
                      <input
                        type="text"
                        value={formData.suffix || ""}
                        onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                        placeholder="e.g. +, %"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form fields for Timeline */}
              {activeTab === "timeline" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Step Number / Code</label>
                      <input
                        type="text"
                        value={formData.step || ""}
                        onChange={(e) => setFormData({ ...formData, step: e.target.value })}
                        placeholder="e.g. 01, 02"
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Step Title</label>
                      <input
                        type="text"
                        value={formData.title || ""}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider uppercase text-stone-500 mb-2">Description</label>
                    <textarea
                      value={formData.desc || ""}
                      onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                      rows="4"
                      className="w-full bg-stone-50 border border-stone-200 px-4 py-2 focus:outline-none focus:border-studio-accent"
                      required
                    ></textarea>
                  </div>
                </>
              )}

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-stone-200 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-xs tracking-widest uppercase border border-stone-300 hover:border-stone-900 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-stone-900 hover:bg-studio-accent text-white hover:text-stone-950 px-8 py-2.5 text-xs tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW SINGLE INQUIRY DETAIL MODAL */}
      {activeInquiry && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-stone-200 w-full max-w-xl p-8 shadow-2xl relative">
            <h3 className="font-serif text-2xl text-stone-900 uppercase tracking-wider mb-6 border-b border-stone-200 pb-4">
              Client Message
            </h3>

            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4 border-b border-stone-100 pb-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">From</span>
                  <span className="font-medium text-stone-900">{activeInquiry.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Date Recieved</span>
                  <span className="text-stone-800">
                    {activeInquiry.timestamp ? new Date(activeInquiry.timestamp).toLocaleString() : "N/A"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-stone-100 pb-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Email Address</span>
                  <a href={`mailto:${activeInquiry.email}`} className="text-studio-accent hover:underline font-mono">
                    {activeInquiry.email}
                  </a>
                </div>
                {activeInquiry.phone && (
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Phone Number</span>
                    <span className="text-stone-800">{activeInquiry.phone}</span>
                  </div>
                )}
              </div>

              <div className="border-b border-stone-100 pb-4">
                <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Subject</span>
                <span className="font-medium text-stone-900 text-base">{activeInquiry.subject}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Inquiry Details</span>
                <p className="text-stone-600 bg-stone-50 border border-stone-200 p-4 rounded text-sm leading-relaxed whitespace-pre-wrap">
                  {activeInquiry.message}
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setActiveInquiry(null)}
                  className="bg-stone-900 hover:bg-studio-accent text-white hover:text-stone-950 px-8 py-2.5 text-xs tracking-widest uppercase font-semibold transition-all duration-300 cursor-pointer"
                >
                  Close Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";



type Post = { id: number; category: string; title: string; text: string; image: string; date: string };

const SECTIONS = [
  { id: "bosh-sahifa", label: "Bosh sahifa" },
  { id: "yangiliklar", label: "Yangiliklar" },
  { id: "rahbariyat", label: "Rahbariyat" },
  { id: "muassasalar", label: "Muassasalar" },
  { id: "statistika", label: "Statistika" },
  { id: "vakansiyalar", label: "Vakansiyalar" },
  { id: "virtual-qabulxona", label: "Virtual Qabulxona" },
  { id: "galereya", label: "Galereya" },
];

const ADMIN = { user: "admin", pass: "admin123" };

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [active, setActive] = useState("bosh-sahifa");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [slide, setSlide] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [login, setLogin] = useState({ user: "", pass: "" });
  const [form, setForm] = useState({ category: "yangiliklar", title: "", text: "", image: "" });

  useEffect(() => {
    const saved = localStorage.getItem("chortoq_posts");
    if (saved) setPosts(JSON.parse(saved));
    if (localStorage.getItem("chortoq_admin") === "1") setIsAdmin(true);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % 4), 6000);
    return () => clearInterval(t);
  }, []);

  const save = (list: Post[]) => {
    setPosts(list);
    localStorage.setItem("chortoq_posts", JSON.stringify(list));
  };

  const notify = (msg: string, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const go = (id: string) => {
    setActive(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const doLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login.user === ADMIN.user && login.pass === ADMIN.pass) {
      setIsAdmin(true);
      localStorage.setItem("chortoq_admin", "1");
      notify("Xush kelibsiz, administrator!", "success");
    } else {
      notify("Login yoki parol noto\u0027g\u0027ri!", "error");
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("chortoq_admin");
    notify("Tizimdan chiqdingiz", "info");
  };

  const addPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return notify("Sarlavha kiriting!", "error");
    const post: Post = {
      id: Date.now(),
      category: form.category,
      title: form.title,
      text: form.text,
      image: form.image || "https://picsum.photos/seed/" + Date.now() + "/600/400",
      date: new Date().toLocaleDateString("uz-UZ"),
    };
    save([post, ...posts]);
    setForm({ category: "yangiliklar", title: "", text: "", image: "" });
    notify("Yangilik qo\u0027shildi!", "success");
  };

  const del = (id: number) => {
    save(posts.filter((p) => p.id !== id));
    notify("O\u0027chirildi", "info");
  };

  const labelOf = (id: string) => SECTIONS.find((s) => s.id === id)?.label || id;

  const visible = (cat: string) => {
    let list = cat === "bosh-sahifa" ? posts : posts.filter((p) => p.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.text.toLowerCase().includes(q));
    }
    return list;
  };

  const Card = (p: Post) => (
    <div className="news-card" key={p.id}>
      {isAdmin && (
        <button className="delete-btn" onClick={() => del(p.id)} title="O\u0027chirish">\u2715</button>
      )}
      <img className="news-img" src={p.image} alt={p.title} />
      <div className="news-title">{p.title}</div>
      <div className="news-text">{p.text}</div>
      <div className="news-meta">
        <span className="category-badge">{labelOf(p.category)}</span>
        <small style={{ color: "var(--muted)" }}>{p.date}</small>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-slider">
        {[1, 2, 3, 4].map((n, idx) => (
          <div key={n} className={"slide slide-" + n + (idx === slide ? " active" : "")} />
        ))}
      </div>

      <header>
        <div className="logo-area" id="brandLogo">
          <div className="logo-placeholder">CM</div>
          <div className="logo-title">CHORTOQ MMTB</div>
        </div>
        <div className="search-container">
          <span className="search-icon">\u2315</span>
          <input id="searchInput" placeholder="Qidirish..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="menu-toggle menu-btn" id="menuBtn" onClick={() => setMenuOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </header>

      <nav id="navMenu" className={menuOpen ? "active" : ""}>
        <ul className="catalog-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href="#" className={"nav-link" + (active === s.id ? " active-tab" : "")}
                 onClick={(e) => { e.preventDefault(); go(s.id); }}>{s.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        {SECTIONS.map((s) => (
          <section key={s.id} className={"page-section" + (active === s.id ? " active-section" : "")}>
            <h2>{s.label}</h2>
            {isAdmin && (
              <form className="auth-form" onSubmit={addPost} style={{ margin: "0 0 28px" }}>
                <div className="form-group">
                  <label>Bo\u0027lim</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {SECTIONS.filter((x) => x.id !== "bosh-sahifa").map((x) => (
                      <option key={x.id} value={x.id}>{x.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group"><label>Sarlavha</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="form-group"><label>Matn</label>
                  <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></div>
                <div className="form-group"><label>Rasm URL (ixtiyoriy)</label>
                  <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
                <button className="btn btn-success" type="submit">Qo\u0027shish</button>
              </form>
            )}
            <div className="news-grid">
              {visible(s.id).length === 0
                ? <p style={{ color: "#eaf1fb" }}>Hozircha ma\u0027lumot yo\u0027q.</p>
                : visible(s.id).map((p) => Card(p))}
            </div>
          </section>
        ))}

        {!isAdmin ? (
          <form className="auth-form" onSubmit={doLogin}>
            <div className="auth-tabs"><button type="button" className="auth-tab-btn active-auth">Admin kirish</button></div>
            <div className="form-group"><label>Login</label>
              <input value={login.user} onChange={(e) => setLogin({ ...login, user: e.target.value })} /></div>
            <div className="form-group"><label>Parol</label>
              <input type="password" value={login.pass} onChange={(e) => setLogin({ ...login, pass: e.target.value })} /></div>
            <button className="btn" type="submit">Kirish</button>
            <p style={{ marginTop: 12, fontSize: ".8rem", color: "var(--muted)" }}>Demo: admin / admin123</p>
          </form>
        ) : (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <button className="btn btn-danger" onClick={logout}>Chiqish</button>
          </div>
        )}
      </main>

      <footer>
        <p>\u00A9 {new Date().getFullYear()} Chortoq tumani MMTB. Barcha huquqlar himoyalangan.</p>
        <p><a href="#">chortoq@umkt.uz</a> \u00B7 +998 (00) 000-00-00</p>
      </footer>

      {toast && <div id="customToast" className={"show toast-" + toast.type}>{toast.msg}</div>}
    </>
  );
}

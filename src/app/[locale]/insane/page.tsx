"use client";

import { useState, useEffect, useRef, useMemo, type CSSProperties } from "react";
import { FaStar, FaRegStar, FaLock, FaPen, FaPlus, FaTrash, FaTimes, FaSave, FaSignOutAlt } from "react-icons/fa";

// ==================== TYPES ====================
type StageKey = "MIRAGE" | "CLOUD" | "ALTF4" | "TECHNOBUS";
type DayKey = "jeu" | "ven" | "sam";
type SetEntry = { s: string; e: string; a: string };
type Lineup = Record<DayKey, Record<StageKey, SetEntry[]>>;

// ==================== DATA ====================
const STAGES: StageKey[] = ["MIRAGE", "CLOUD", "ALTF4", "TECHNOBUS"];

const STAGE_META: Record<StageKey, { color: string; glow: string; label: string }> = {
    MIRAGE:    { color: "#a78bfa", glow: "rgba(167,139,250,0.45)", label: "Mirage" },
    CLOUD:     { color: "#60a5fa", glow: "rgba(96,165,250,0.45)",  label: "Cloud" },
    ALTF4:     { color: "#f472b6", glow: "rgba(244,114,182,0.45)", label: "AltF4" },
    TECHNOBUS: { color: "#34d399", glow: "rgba(52,211,153,0.45)",  label: "Technobus" },
};

const DAYS: { id: DayKey; label: string; date: string; full: string }[] = [
    { id: "jeu", label: "Jeu", date: "14 mai", full: "Jeudi 14 mai" },
    { id: "ven", label: "Ven", date: "15 mai", full: "Vendredi 15 mai" },
    { id: "sam", label: "Sam", date: "16 mai", full: "Samedi 16 mai" },
];

const INITIAL_LINEUP: Lineup = {
    jeu: {
        MIRAGE: [
            { s: "16:00", e: "17:30", a: "Kichta" },
            { s: "17:30", e: "19:00", a: "2hot2play" },
            { s: "19:00", e: "20:30", a: "Majes" },
            { s: "20:30", e: "22:00", a: "Vortek's b2b Byorn" },
            { s: "22:00", e: "23:00", a: "Toxic Machinery" },
            { s: "23:00", e: "00:30", a: "Vieze Asbak" },
            { s: "00:30", e: "01:30", a: "Holy Priest" },
            { s: "01:30", e: "02:00", a: "Secret B2B" },
            { s: "02:00", e: "03:00", a: "Lil Texas" },
            { s: "03:00", e: "04:00", a: "Lekkerfaces" },
        ],
        CLOUD: [
            { s: "16:00", e: "16:45", a: "Le F" },
            { s: "16:45", e: "17:30", a: "Lowbass" },
            { s: "17:30", e: "18:30", a: "Baron" },
            { s: "18:30", e: "19:30", a: "Solere" },
            { s: "19:30", e: "21:00", a: "Yann Muller" },
            { s: "21:00", e: "22:15", a: "Amor" },
            { s: "22:15", e: "23:30", a: "Petit Biscuit" },
            { s: "23:30", e: "01:00", a: "Upsilone" },
            { s: "01:00", e: "02:30", a: "Mandragora" },
            { s: "02:30", e: "04:00", a: "Bennett" },
        ],
        ALTF4: [
            { s: "12:00", e: "12:45", a: "Kavaleur" },
            { s: "12:45", e: "13:30", a: "La Torgnole" },
            { s: "13:30", e: "14:15", a: "Redlair" },
            { s: "14:15", e: "15:15", a: "Eyes" },
            { s: "15:15", e: "16:00", a: "Medusa" },
            { s: "16:15", e: "18:00", a: "Hortense de Beauharnais f2f Gonzi" },
            { s: "18:00", e: "19:45", a: "Relajadita f2f Dvaid" },
            { s: "19:45", e: "21:30", a: "A5km f2f Teksa" },
            { s: "21:30", e: "22:45", a: "Nure f2f Vlb" },
            { s: "22:45", e: "00:30", a: "Caravel f2f Uphoria" },
            { s: "00:30", e: "02:15", a: "Jayron f2f Rubiø" },
            { s: "02:15", e: "04:00", a: "Jo3y3t f2f Santøs" },
        ],
        TECHNOBUS: [
            { s: "16:00", e: "17:00", a: "Octo One" },
            { s: "17:00", e: "18:00", a: "Fraîche" },
            { s: "18:00", e: "19:00", a: "Heartreaver b2b Mido" },
            { s: "19:00", e: "20:00", a: "Anthony Capaldi" },
            { s: "20:00", e: "21:00", a: "David Bouts" },
            { s: "21:00", e: "22:00", a: "Melina" },
            { s: "22:00", e: "23:00", a: "Anduj b2b Paulskye" },
            { s: "23:00", e: "00:00", a: "Twist" },
            { s: "00:00", e: "01:00", a: "Prost b2b Zep" },
            { s: "01:00", e: "02:00", a: "Evander b2b May-Li" },
            { s: "02:00", e: "03:00", a: "Noyse" },
            { s: "03:00", e: "04:00", a: "Blakeys b2b Blasty" },
        ],
    },
    ven: {
        MIRAGE: [
            { s: "16:00", e: "16:45", a: "Ardente" },
            { s: "16:45", e: "17:30", a: "Chasm" },
            { s: "17:30", e: "18:30", a: "KX CHR" },
            { s: "18:30", e: "20:00", a: "Notmytype" },
            { s: "20:00", e: "21:00", a: "Nicolas Julian" },
            { s: "21:00", e: "22:00", a: "Eczodia" },
            { s: "22:00", e: "23:00", a: "Karah" },
            { s: "23:00", e: "00:30", a: "Restricted" },
            { s: "00:30", e: "01:30", a: "Kruelty" },
            { s: "01:30", e: "03:00", a: "Reinier Zonneveld b2b Angerfist" },
            { s: "03:00", e: "04:00", a: "Rooler" },
        ],
        CLOUD: [
            { s: "16:00", e: "17:00", a: "Ga4sy" },
            { s: "17:00", e: "18:00", a: "AMR" },
            { s: "18:00", e: "19:30", a: "Tars" },
            { s: "19:30", e: "20:30", a: "DJ_Dave" },
            { s: "20:30", e: "22:00", a: "Fjusha" },
            { s: "22:00", e: "23:00", a: "Cara Elizabeth b2b Arman John" },
            { s: "23:00", e: "00:30", a: "Hortense de Beauharnais" },
            { s: "00:30", e: "02:00", a: "Daria Kolosova" },
            { s: "02:00", e: "04:00", a: "Luciid" },
        ],
        ALTF4: [
            { s: "12:00", e: "13:00", a: "Very Bad Kicks" },
            { s: "13:00", e: "14:00", a: "Dice b2b Kø:Lab" },
            { s: "14:00", e: "15:00", a: "Acidpach b2b L'Art Cène" },
            { s: "15:00", e: "16:00", a: "Vernex b2b Sandy Warez" },
            { s: "16:00", e: "17:00", a: "Obses" },
            { s: "17:00", e: "18:00", a: "Klinical" },
            { s: "18:00", e: "19:00", a: "Visages" },
            { s: "19:00", e: "20:00", a: "The Caracal Project" },
            { s: "20:00", e: "21:00", a: "Imanu" },
            { s: "21:00", e: "22:00", a: "Skantia" },
            { s: "22:00", e: "23:00", a: "Vici" },
            { s: "23:00", e: "00:00", a: "Theezer" },
        ],
        TECHNOBUS: [
            { s: "16:00", e: "17:00", a: "DLN" },
            { s: "17:00", e: "18:00", a: "Jejeje" },
            { s: "18:00", e: "19:30", a: "DJ Princesse b2b El Santu" },
            { s: "19:30", e: "20:30", a: "RV" },
            { s: "20:30", e: "21:30", a: "Keuss" },
            { s: "21:30", e: "22:30", a: "La Torgnole" },
            { s: "22:30", e: "23:30", a: "Klöss" },
            { s: "23:30", e: "01:00", a: "Noyse" },
            { s: "01:00", e: "02:00", a: "Restricted" },
            { s: "02:00", e: "03:00", a: "A5km" },
            { s: "03:00", e: "04:00", a: "Afterdeath" },
        ],
    },
    sam: {
        MIRAGE: [
            { s: "16:00", e: "17:00", a: "Rave Crew" },
            { s: "17:00", e: "18:00", a: "Zorza" },
            { s: "18:00", e: "19:00", a: "Samuel Moriero" },
            { s: "19:00", e: "20:00", a: "Le Wanski b2b Sköne" },
            { s: "20:00", e: "21:00", a: "Zapravka" },
            { s: "21:00", e: "22:00", a: "Todiefor" },
            { s: "22:00", e: "23:00", a: "Klofama" },
            { s: "23:00", e: "00:00", a: "SLVL b2b USH" },
            { s: "00:00", e: "01:00", a: "RDØ" },
            { s: "01:00", e: "02:00", a: "Krowdexx" },
            { s: "02:00", e: "03:00", a: "Billx" },
            { s: "03:00", e: "04:00", a: "GPF b2b Unicorn On Ketamine" },
        ],
        CLOUD: [
            { s: "16:00", e: "16:45", a: "Rogs" },
            { s: "16:45", e: "17:30", a: "Noops" },
            { s: "17:45", e: "18:45", a: "Flins" },
            { s: "19:00", e: "20:00", a: "Clément Matrat" },
            { s: "20:00", e: "21:30", a: "Jack Ollins" },
            { s: "21:30", e: "23:00", a: "Tigerhead" },
            { s: "23:00", e: "00:30", a: "Two Dots" },
            { s: "00:30", e: "02:00", a: "Ascendant Vierge" },
            { s: "02:00", e: "03:00", a: "Evil Grimace" },
            { s: "03:00", e: "04:00", a: "A5km" },
        ],
        ALTF4: [
            { s: "12:00", e: "13:00", a: "Evänder b2b Blasty" },
            { s: "13:00", e: "14:00", a: "Soraä" },
            { s: "14:00", e: "15:00", a: "Fiikra b2b Otah" },
            { s: "15:00", e: "16:00", a: "Pinotello" },
            { s: "16:00", e: "17:00", a: "C-Joo b2b DNA" },
            { s: "17:00", e: "18:00", a: "Kara" },
            { s: "18:00", e: "19:00", a: "Synergy" },
            { s: "19:00", e: "20:00", a: "[Ivy]" },
            { s: "20:00", e: "21:00", a: "Basstripper" },
            { s: "21:00", e: "22:00", a: "Sota" },
            { s: "22:00", e: "23:00", a: "Youphoria" },
            { s: "23:00", e: "00:00", a: "Zorel" },
        ],
        TECHNOBUS: [
            { s: "16:00", e: "17:00", a: "Noyse" },
            { s: "17:00", e: "19:00", a: "Nexøs" },
            { s: "19:00", e: "20:30", a: "KSLtech" },
            { s: "20:30", e: "21:30", a: "Slackreb" },
            { s: "21:30", e: "23:00", a: "Bødru b2b Furious" },
            { s: "23:00", e: "00:30", a: "Disrupt Tchaï b2b Vinzz" },
            { s: "00:30", e: "02:00", a: "Isaline" },
            { s: "02:00", e: "03:00", a: "Leardcore" },
            { s: "03:00", e: "04:00", a: "Sergastek" },
        ],
    },
};

// ==================== HELPERS ====================
const DAY_START_MIN = 12 * 60;
const DAY_END_MIN = 12 * 60 + 16 * 60;
const TOTAL_MIN = DAY_END_MIN - DAY_START_MIN;
const PX_PER_MIN = 1.6;
const TIMELINE_HEIGHT = TOTAL_MIN * PX_PER_MIN;

function tToMin(t: string): number {
    const [h, m] = t.split(":").map(Number);
    let total = h * 60 + m;
    if (total < 12 * 60) total += 24 * 60;
    return total - DAY_START_MIN;
}

function setsOverlap(a: SetEntry, b: SetEntry): boolean {
    return tToMin(a.s) < tToMin(b.e) && tToMin(b.s) < tToMin(a.e);
}

function cloneLineup(l: Lineup): Lineup {
    return JSON.parse(JSON.stringify(l));
}

const HOUR_LABELS = Array.from({ length: 17 }, (_, i) => {
    const h = (12 + i) % 24;
    return { h, label: `${String(h).padStart(2, "0")}:00`, top: i * 60 * PX_PER_MIN };
});

const STORAGE_KEY = "insane-festival-favorites";
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

// ==================== PAGE ====================
export default function InsaneFestivalPage() {
    const [day, setDay] = useState<DayKey>("jeu");
    const [favs, setFavs] = useState<Set<string>>(new Set());
    const [favsOnly, setFavsOnly] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [hiddenStages, setHiddenStages] = useState<Set<StageKey>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);

    // Lineup data (fetched, falls back to initial)
    const [lineup, setLineup] = useState<Lineup>(INITIAL_LINEUP);
    const [lastSavedLineup, setLastSavedLineup] = useState<Lineup>(INITIAL_LINEUP);
    const [lineupLoaded, setLineupLoaded] = useState(false);

    // Admin / edit
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [loginPwd, setLoginPwd] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginBusy, setLoginBusy] = useState(false);

    // Editing a specific set
    const [editing, setEditing] = useState<{
        day: DayKey;
        stage: StageKey;
        index: number; // -1 means new, append
        draft: SetEntry;
    } | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Load favorites
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setFavs(new Set(JSON.parse(raw) as string[]));
        } catch {
            /* no favs yet */
        }
    }, []);

    // Fetch lineup + auth status on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [lineupRes, meRes] = await Promise.all([
                    fetch("/api/insane/lineup", { cache: "no-store" }),
                    fetch("/api/insane/me", { cache: "no-store" }),
                ]);
                if (cancelled) return;
                if (lineupRes.ok) {
                    const data = (await lineupRes.json()) as { lineup: Lineup | null };
                    if (data.lineup) {
                        setLineup(data.lineup);
                        setLastSavedLineup(data.lineup);
                    }
                }
                if (meRes.ok) {
                    const me = (await meRes.json()) as { admin: boolean };
                    setIsAdmin(me.admin);
                }
            } catch {
                /* keep fallback */
            } finally {
                if (!cancelled) setLineupLoaded(true);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const toggleFav = (key: string) => {
        const next = new Set(favs);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        setFavs(next);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
        } catch {
            /* storage may be unavailable */
        }
    };

    const toggleStage = (stage: StageKey) => {
        const next = new Set(hiddenStages);
        if (next.has(stage)) next.delete(stage);
        else next.add(stage);
        setHiddenStages(next);
    };

    const visibleStages = STAGES.filter((s) => !hiddenStages.has(s));
    const dayData = lineup[day];
    const favsCount = favs.size;
    const dirty = useMemo(() => JSON.stringify(lineup) !== JSON.stringify(lastSavedLineup), [lineup, lastSavedLineup]);

    // Overlap map for current day: stage → Set of indices that overlap with another in same stage
    const overlapMap = useMemo(() => {
        const out: Record<StageKey, Set<number>> = {
            MIRAGE: new Set(),
            CLOUD: new Set(),
            ALTF4: new Set(),
            TECHNOBUS: new Set(),
        };
        for (const stage of STAGES) {
            const sets = lineup[day][stage];
            for (let i = 0; i < sets.length; i++) {
                for (let j = i + 1; j < sets.length; j++) {
                    if (setsOverlap(sets[i], sets[j])) {
                        out[stage].add(i);
                        out[stage].add(j);
                    }
                }
            }
        }
        return out;
    }, [lineup, day]);

    // ----- Login -----
    const submitLogin = async () => {
        setLoginBusy(true);
        setLoginError(null);
        try {
            const res = await fetch("/api/insane/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: loginPwd }),
            });
            if (res.ok) {
                setIsAdmin(true);
                setLoginOpen(false);
                setLoginPwd("");
                setEditMode(true);
            } else {
                const data = (await res.json().catch(() => ({}))) as { error?: string };
                setLoginError(data.error ?? "Login failed");
            }
        } catch {
            setLoginError("Network error");
        } finally {
            setLoginBusy(false);
        }
    };

    const logout = async () => {
        await fetch("/api/insane/login", { method: "DELETE" }).catch(() => undefined);
        setIsAdmin(false);
        setEditMode(false);
    };

    // ----- Edit operations -----
    const openEdit = (d: DayKey, stage: StageKey, index: number) => {
        const set = lineup[d][stage][index];
        setEditing({ day: d, stage, index, draft: { ...set } });
    };
    const openAdd = (d: DayKey, stage: StageKey) => {
        setEditing({ day: d, stage, index: -1, draft: { s: "20:00", e: "21:00", a: "" } });
    };
    const closeEdit = () => setEditing(null);

    const commitEdit = () => {
        if (!editing) return;
        const { draft, day: editDay, stage: editStage, index } = editing;
        if (!TIME_RE.test(draft.s) || !TIME_RE.test(draft.e) || !draft.a.trim()) return;
        const next = cloneLineup(lineup);
        const arr = next[editDay][editStage];
        if (index === -1) arr.push({ ...draft, a: draft.a.trim() });
        else arr[index] = { ...draft, a: draft.a.trim() };
        arr.sort((a, b) => tToMin(a.s) - tToMin(b.s));
        setLineup(next);
        setEditing(null);
    };

    const deleteEdit = () => {
        if (!editing || editing.index === -1) {
            setEditing(null);
            return;
        }
        const next = cloneLineup(lineup);
        next[editing.day][editing.stage].splice(editing.index, 1);
        setLineup(next);
        setEditing(null);
    };

    const moveEdit = (newDay: DayKey, newStage: StageKey) => {
        if (!editing) return;
        setEditing({ ...editing, day: newDay, stage: newStage, index: -1 });
    };

    // Compute overlaps in the editor's working state (for warning display)
    const editingOverlaps = useMemo(() => {
        if (!editing) return [] as { time: string; artist: string }[];
        const { day: ed, stage: es, index, draft } = editing;
        if (!TIME_RE.test(draft.s) || !TIME_RE.test(draft.e)) return [];
        const peers = lineup[ed][es];
        const result: { time: string; artist: string }[] = [];
        peers.forEach((peer, i) => {
            if (i === index) return;
            if (setsOverlap(peer, draft)) result.push({ time: `${peer.s}–${peer.e}`, artist: peer.a });
        });
        return result;
    }, [editing, lineup]);

    // ----- Save -----
    const save = async () => {
        setSaving(true);
        setSaveError(null);
        try {
            const res = await fetch("/api/insane/lineup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lineup }),
            });
            if (!res.ok) {
                const data = (await res.json().catch(() => ({}))) as { error?: string };
                setSaveError(data.error ?? "Save failed");
                return;
            }
            setLastSavedLineup(lineup);
        } catch {
            setSaveError("Network error");
        } finally {
            setSaving(false);
        }
    };

    const revert = () => setLineup(lastSavedLineup);

    return (
        <div style={styles.root}>
            <style>{globalCss}</style>

            <header className="insane-sticky-header" style={styles.header}>
                <div style={styles.brand}>
                    <div style={styles.brandLine1}>INSANE FESTIVAL</div>
                    <div style={styles.brandLine2}>
                        <span style={{ opacity: 0.5 }}>Beyond</span>
                        <span style={styles.brandGlyph}>✦</span>
                        <span style={{ opacity: 0.5 }}>Reality</span>
                    </div>
                    <div style={styles.adminCorner}>
                        {!isAdmin && (
                            <button style={styles.iconBtn} onClick={() => setLoginOpen(true)} title="Admin login">
                                <FaLock size={11} />
                            </button>
                        )}
                        {isAdmin && (
                            <>
                                <button
                                    style={{ ...styles.iconBtn, ...(editMode ? styles.iconBtnActive : {}) }}
                                    onClick={() => setEditMode(!editMode)}
                                    title={editMode ? "Exit edit mode" : "Enter edit mode"}
                                >
                                    <FaPen size={11} />
                                </button>
                                <button style={styles.iconBtn} onClick={logout} title="Sign out">
                                    <FaSignOutAlt size={11} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div style={styles.dayTabs}>
                    {DAYS.map((d) => (
                        <button
                            key={d.id}
                            onClick={() => setDay(d.id)}
                            style={{
                                ...styles.dayTab,
                                ...(day === d.id ? styles.dayTabActive : {}),
                            }}
                        >
                            <span style={styles.dayTabLabel}>{d.label}</span>
                            <span style={styles.dayTabDate}>{d.date}</span>
                        </button>
                    ))}
                </div>

                <div style={styles.controlsRow}>
                    <div style={styles.stageToggles}>
                        {STAGES.map((s) => {
                            const hidden = hiddenStages.has(s);
                            const meta = STAGE_META[s];
                            return (
                                <button
                                    key={s}
                                    onClick={() => toggleStage(s)}
                                    style={{
                                        ...styles.stageToggle,
                                        borderColor: hidden ? "rgba(255,255,255,0.1)" : meta.color,
                                        color: hidden ? "rgba(255,255,255,0.3)" : meta.color,
                                        opacity: hidden ? 0.4 : 1,
                                    }}
                                >
                                    <span
                                        style={{
                                            ...styles.stageDot,
                                            background: hidden ? "transparent" : meta.color,
                                            borderColor: meta.color,
                                        }}
                                    />
                                    {meta.label}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => setFavsOnly(!favsOnly)}
                        style={{
                            ...styles.favFilter,
                            ...(favsOnly ? styles.favFilterActive : {}),
                        }}
                    >
                        {favsOnly ? <FaStar size={11} color="#fbbf24" /> : <FaRegStar size={11} color="#fbbf24" />}
                        {favsCount}
                    </button>
                </div>

                {editMode && (
                    <div style={styles.editBar}>
                        <span style={styles.editBarLabel}>EDIT MODE</span>
                        {dirty ? (
                            <span style={styles.editBarStatusDirty}>● Unsaved changes</span>
                        ) : (
                            <span style={styles.editBarStatusClean}>Saved</span>
                        )}
                        <div style={{ flex: 1 }} />
                        {dirty && (
                            <button style={styles.editBarBtn} onClick={revert} disabled={saving}>
                                Revert
                            </button>
                        )}
                        <button
                            style={{ ...styles.editBarBtn, ...styles.editBarBtnPrimary }}
                            onClick={save}
                            disabled={!dirty || saving}
                        >
                            <FaSave size={10} /> {saving ? "Saving…" : "Save"}
                        </button>
                        {saveError && <span style={styles.editBarError}>{saveError}</span>}
                    </div>
                )}
            </header>

            <div style={styles.timelineWrap} ref={scrollRef}>
                <div style={{ ...styles.timeline, height: TIMELINE_HEIGHT + 24 }}>
                    {HOUR_LABELS.map((hl) => (
                        <div key={hl.h} style={{ ...styles.hourLine, top: hl.top }} />
                    ))}

                    <div style={styles.timeCol}>
                        {HOUR_LABELS.map((hl) => (
                            <div key={hl.h} style={{ ...styles.hourLabel, top: hl.top - 7 }}>
                                {hl.label}
                            </div>
                        ))}
                    </div>

                    <div style={styles.stagesContainer}>
                        {visibleStages.map((stage) => {
                            const meta = STAGE_META[stage];
                            const sets = dayData[stage];
                            return (
                                <div key={stage} style={styles.stageCol}>
                                    {editMode && (
                                        <button
                                            style={{ ...styles.addBtn, borderColor: meta.color, color: meta.color }}
                                            onClick={() => openAdd(day, stage)}
                                            title={`Add set on ${meta.label}`}
                                        >
                                            <FaPlus size={9} /> {meta.label}
                                        </button>
                                    )}
                                    {sets.map((set, idx) => {
                                        const top = tToMin(set.s) * PX_PER_MIN;
                                        const height = (tToMin(set.e) - tToMin(set.s)) * PX_PER_MIN;
                                        const key = `${day}|${stage}|${set.s}|${set.a}`;
                                        const isFav = favs.has(key);
                                        const isSelected = selected === key;
                                        const dimmed = favsOnly && !isFav && !editMode;
                                        const isOverlap = overlapMap[stage].has(idx);

                                        const blockStyle: CSSProperties = {
                                            position: "absolute",
                                            top: top + 2,
                                            left: 2,
                                            right: 2,
                                            height: height - 4,
                                            borderLeft: `2px solid ${meta.color}`,
                                            outline: isOverlap && editMode ? "1.5px solid #f59e0b" : undefined,
                                            outlineOffset: -1,
                                            background: isFav
                                                ? `linear-gradient(135deg, ${meta.color}38, ${meta.color}18)`
                                                : `linear-gradient(135deg, ${meta.color}1f, ${meta.color}0a)`,
                                            boxShadow: isSelected
                                                ? `0 0 0 1px ${meta.color}, 0 8px 24px ${meta.glow}`
                                                : isFav
                                                  ? `0 2px 12px ${meta.glow}`
                                                  : "none",
                                            opacity: dimmed ? 0.18 : 1,
                                            padding: "4px 5px",
                                            borderRadius: 4,
                                            cursor: "pointer",
                                            overflow: "hidden",
                                            transition: "all 180ms ease",
                                            color: "white",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 2,
                                        };

                                        return (
                                            <div
                                                key={`${stage}-${idx}-${set.s}-${set.a}`}
                                                onClick={() => {
                                                    if (editMode) openEdit(day, stage, idx);
                                                    else setSelected(isSelected ? null : key);
                                                }}
                                                className="set-block"
                                                style={blockStyle}
                                            >
                                                <div style={styles.setTime}>{set.s}</div>
                                                <div
                                                    style={{
                                                        ...styles.setArtist,
                                                        fontSize: height < 35 ? 9 : height < 60 ? 10 : 11,
                                                        lineHeight: 1.15,
                                                    }}
                                                >
                                                    {set.a}
                                                </div>
                                                {isFav && !editMode && (
                                                    <div style={styles.favBadge}>
                                                        <FaStar size={9} color="#fbbf24" />
                                                    </div>
                                                )}
                                                {isOverlap && editMode && (
                                                    <div style={styles.overlapBadge} title="Overlaps with another set">
                                                        ⚠
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {!lineupLoaded && (
                <div style={styles.loadingBadge}>Loading…</div>
            )}

            {selected &&
                !editMode &&
                (() => {
                    const parts = selected.split("|");
                    const stage = parts[1] as StageKey;
                    const start = parts[2];
                    const set = dayData[stage].find((x) => x.s === start);
                    if (!set) return null;
                    const meta = STAGE_META[stage];
                    const isFav = favs.has(selected);
                    return (
                        <div style={styles.detailPanel} onClick={() => setSelected(null)}>
                            <div
                                style={{ ...styles.detailCard, borderColor: meta.color }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ ...styles.detailStage, color: meta.color }}>
                                    <span
                                        style={{
                                            ...styles.stageDot,
                                            background: meta.color,
                                            borderColor: meta.color,
                                        }}
                                    />
                                    {meta.label.toUpperCase()}
                                </div>
                                <div style={styles.detailArtist}>{set.a}</div>
                                <div style={styles.detailTime}>
                                    {set.s} → {set.e}
                                </div>
                                <div style={styles.detailDay}>{DAYS.find((d) => d.id === day)!.full}</div>
                                <button
                                    onClick={() => toggleFav(selected)}
                                    style={{
                                        ...styles.detailFavBtn,
                                        background: isFav ? "#fbbf24" : "transparent",
                                        color: isFav ? "#000" : "#fbbf24",
                                        borderColor: "#fbbf24",
                                    }}
                                >
                                    {isFav ? <FaStar size={14} /> : <FaRegStar size={14} />}
                                    {isFav ? "Favori" : "Ajouter aux favoris"}
                                </button>
                            </div>
                        </div>
                    );
                })()}

            {/* Login modal */}
            {loginOpen && (
                <div style={styles.detailPanel} onClick={() => setLoginOpen(false)}>
                    <div style={styles.detailCard} onClick={(e) => e.stopPropagation()}>
                        <div style={{ ...styles.detailStage, color: "#a78bfa" }}>
                            <FaLock size={11} /> ADMIN
                        </div>
                        <input
                            type="password"
                            value={loginPwd}
                            onChange={(e) => setLoginPwd(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submitLogin()}
                            placeholder="Password"
                            autoFocus
                            style={styles.input}
                        />
                        {loginError && <div style={styles.errorText}>{loginError}</div>}
                        <button
                            style={{ ...styles.detailFavBtn, borderColor: "#a78bfa", color: "#a78bfa" }}
                            onClick={submitLogin}
                            disabled={loginBusy || !loginPwd}
                        >
                            {loginBusy ? "Signing in…" : "Sign in"}
                        </button>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {editing && (
                <div style={styles.detailPanel} onClick={closeEdit}>
                    <div
                        style={{ ...styles.detailCard, borderColor: STAGE_META[editing.stage].color }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ ...styles.detailStage, color: STAGE_META[editing.stage].color }}>
                            <span
                                style={{
                                    ...styles.stageDot,
                                    background: STAGE_META[editing.stage].color,
                                    borderColor: STAGE_META[editing.stage].color,
                                }}
                            />
                            {editing.index === -1 ? "NEW SET" : "EDIT SET"}
                        </div>

                        <label style={styles.fieldLabel}>Artist</label>
                        <input
                            type="text"
                            value={editing.draft.a}
                            onChange={(e) =>
                                setEditing({ ...editing, draft: { ...editing.draft, a: e.target.value } })
                            }
                            placeholder="Artist name"
                            autoFocus
                            style={styles.input}
                        />

                        <div style={styles.row2}>
                            <div style={{ flex: 1 }}>
                                <label style={styles.fieldLabel}>Start</label>
                                <input
                                    type="time"
                                    value={editing.draft.s}
                                    onChange={(e) =>
                                        setEditing({ ...editing, draft: { ...editing.draft, s: e.target.value } })
                                    }
                                    style={styles.input}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={styles.fieldLabel}>End</label>
                                <input
                                    type="time"
                                    value={editing.draft.e}
                                    onChange={(e) =>
                                        setEditing({ ...editing, draft: { ...editing.draft, e: e.target.value } })
                                    }
                                    style={styles.input}
                                />
                            </div>
                        </div>

                        <div style={styles.row2}>
                            <div style={{ flex: 1 }}>
                                <label style={styles.fieldLabel}>Day</label>
                                <select
                                    value={editing.day}
                                    onChange={(e) => moveEdit(e.target.value as DayKey, editing.stage)}
                                    style={styles.input}
                                >
                                    {DAYS.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.full}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={styles.fieldLabel}>Stage</label>
                                <select
                                    value={editing.stage}
                                    onChange={(e) => moveEdit(editing.day, e.target.value as StageKey)}
                                    style={styles.input}
                                >
                                    {STAGES.map((s) => (
                                        <option key={s} value={s}>
                                            {STAGE_META[s].label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {editingOverlaps.length > 0 && (
                            <div style={styles.overlapWarn}>
                                <strong>Overlap{editingOverlaps.length > 1 ? "s" : ""}:</strong>
                                {editingOverlaps.map((o, i) => (
                                    <div key={i} style={{ fontSize: 11, opacity: 0.85 }}>
                                        {o.time} — {o.artist}
                                    </div>
                                ))}
                                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
                                    Saving will keep both sets.
                                </div>
                            </div>
                        )}

                        <div style={styles.editBtnRow}>
                            <button
                                onClick={closeEdit}
                                style={{ ...styles.editActionBtn, borderColor: "rgba(255,255,255,0.2)" }}
                            >
                                <FaTimes size={11} /> Cancel
                            </button>
                            {editing.index !== -1 && (
                                <button
                                    onClick={deleteEdit}
                                    style={{ ...styles.editActionBtn, borderColor: "#ef4444", color: "#ef4444" }}
                                >
                                    <FaTrash size={11} /> Delete
                                </button>
                            )}
                            <button
                                onClick={commitEdit}
                                disabled={
                                    !TIME_RE.test(editing.draft.s) ||
                                    !TIME_RE.test(editing.draft.e) ||
                                    !editing.draft.a.trim()
                                }
                                style={{
                                    ...styles.editActionBtn,
                                    borderColor: STAGE_META[editing.stage].color,
                                    color: STAGE_META[editing.stage].color,
                                }}
                            >
                                {editing.index === -1 ? "Add" : "Apply"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==================== STYLES ====================
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700&display=swap');
  .set-block:active { transform: scale(0.98); }
  @media (max-width: 767px) {
    .insane-sticky-header { top: 56px !important; }
  }
`;

const styles: Record<string, CSSProperties> = {
    root: {
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #1a1530 0%, #0a0814 50%, #050309 100%)",
        color: "#fff",
        fontFamily: "Outfit, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(10,8,20,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "14px 12px 10px",
    },
    brand: { textAlign: "center", marginBottom: 12, position: "relative" },
    brandLine1: {
        fontFamily: "Bebas Neue, sans-serif",
        fontSize: 22,
        letterSpacing: "0.18em",
        background: "linear-gradient(180deg, #fff, #a78bfa)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
    },
    brandLine2: {
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 9,
        letterSpacing: "0.4em",
        color: "#a78bfa",
        marginTop: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    brandGlyph: { color: "#a78bfa", fontSize: 12 },
    adminCorner: {
        position: "absolute",
        top: 0,
        right: 0,
        display: "flex",
        gap: 4,
    },
    iconBtn: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8,
        width: 26,
        height: 26,
        color: "rgba(255,255,255,0.5)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 150ms",
    },
    iconBtnActive: {
        background: "rgba(167,139,250,0.18)",
        borderColor: "rgba(167,139,250,0.5)",
        color: "#a78bfa",
    },
    dayTabs: { display: "flex", gap: 6, marginBottom: 10 },
    dayTab: {
        flex: 1,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8,
        padding: "8px 4px",
        color: "rgba(255,255,255,0.55)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        transition: "all 150ms",
        fontFamily: "inherit",
    },
    dayTabActive: {
        background: "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(96,165,250,0.10))",
        borderColor: "rgba(167,139,250,0.45)",
        color: "#fff",
        boxShadow: "0 0 18px rgba(167,139,250,0.18)",
    },
    dayTabLabel: { fontFamily: "Bebas Neue, sans-serif", fontSize: 16, letterSpacing: "0.1em" },
    dayTabDate: { fontFamily: "JetBrains Mono, monospace", fontSize: 9, opacity: 0.7, textTransform: "uppercase" },
    controlsRow: { display: "flex", gap: 8, alignItems: "center" },
    stageToggles: { display: "flex", gap: 4, flex: 1, flexWrap: "wrap" },
    stageToggle: {
        background: "rgba(255,255,255,0.02)",
        border: "1px solid",
        borderRadius: 999,
        padding: "4px 8px",
        fontSize: 9.5,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 5,
        transition: "all 150ms",
        fontFamily: "inherit",
    },
    stageDot: { width: 7, height: 7, borderRadius: "50%", border: "1px solid", display: "inline-block" },
    favFilter: {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(251,191,36,0.3)",
        borderRadius: 999,
        padding: "4px 9px",
        color: "#fbbf24",
        fontSize: 10,
        fontWeight: 700,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 4,
        fontFamily: "JetBrains Mono, monospace",
    },
    favFilterActive: {
        background: "rgba(251,191,36,0.15)",
        borderColor: "#fbbf24",
        boxShadow: "0 0 12px rgba(251,191,36,0.25)",
    },
    editBar: {
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(167,139,250,0.08)",
        border: "1px solid rgba(167,139,250,0.3)",
        borderRadius: 10,
        padding: "6px 10px",
        fontSize: 11,
        flexWrap: "wrap",
    },
    editBarLabel: {
        fontFamily: "JetBrains Mono, monospace",
        letterSpacing: "0.18em",
        color: "#a78bfa",
        fontWeight: 700,
    },
    editBarStatusDirty: { color: "#fbbf24", fontFamily: "JetBrains Mono, monospace" },
    editBarStatusClean: { color: "rgba(255,255,255,0.5)", fontFamily: "JetBrains Mono, monospace" },
    editBarBtn: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 6,
        padding: "5px 10px",
        color: "#fff",
        fontSize: 11,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: 5,
    },
    editBarBtnPrimary: {
        background: "rgba(167,139,250,0.2)",
        borderColor: "rgba(167,139,250,0.6)",
    },
    editBarError: { color: "#ef4444", fontSize: 10, width: "100%" },
    timelineWrap: { flex: 1, overflow: "auto", padding: "12px 8px 40px" },
    timeline: { position: "relative", display: "flex", minHeight: "100%" },
    timeCol: { width: 38, flexShrink: 0, position: "relative" },
    hourLabel: {
        position: "absolute",
        left: 0,
        fontSize: 9.5,
        fontFamily: "JetBrains Mono, monospace",
        color: "rgba(255,255,255,0.4)",
        fontWeight: 500,
    },
    hourLine: {
        position: "absolute",
        left: 38,
        right: 0,
        height: 1,
        background: "rgba(255,255,255,0.04)",
        pointerEvents: "none",
    },
    stagesContainer: { flex: 1, display: "flex", gap: 2, position: "relative" },
    stageCol: { flex: 1, minWidth: 0, position: "relative", background: "rgba(255,255,255,0.015)", borderRadius: 4 },
    addBtn: {
        position: "absolute",
        top: -28,
        left: 0,
        right: 0,
        background: "rgba(0,0,0,0.4)",
        border: "1px dashed",
        borderRadius: 6,
        padding: "3px 4px",
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily: "inherit",
        zIndex: 5,
    },
    setTime: {
        fontSize: 8.5,
        fontFamily: "JetBrains Mono, monospace",
        color: "rgba(255,255,255,0.55)",
        letterSpacing: "0.02em",
    },
    setArtist: { fontWeight: 600, color: "#fff", wordBreak: "break-word", overflow: "hidden" },
    favBadge: { position: "absolute", top: 3, right: 3 },
    overlapBadge: {
        position: "absolute",
        top: 3,
        right: 3,
        color: "#f59e0b",
        fontSize: 11,
        fontWeight: 700,
        textShadow: "0 0 4px rgba(245,158,11,0.6)",
    },
    loadingBadge: {
        position: "fixed",
        bottom: 16,
        right: 16,
        background: "rgba(167,139,250,0.18)",
        border: "1px solid rgba(167,139,250,0.4)",
        borderRadius: 999,
        padding: "5px 12px",
        fontSize: 10,
        color: "#a78bfa",
        fontFamily: "JetBrains Mono, monospace",
    },
    detailPanel: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
    },
    detailCard: {
        background: "linear-gradient(160deg, #181030, #0a0814)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: 22,
        width: "100%",
        maxWidth: 360,
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    detailStage: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.18em",
        fontFamily: "JetBrains Mono, monospace",
    },
    detailArtist: {
        fontFamily: "Bebas Neue, sans-serif",
        fontSize: 28,
        letterSpacing: "0.04em",
        lineHeight: 1.05,
        color: "#fff",
    },
    detailTime: {
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 16,
        color: "rgba(255,255,255,0.85)",
        letterSpacing: "0.04em",
    },
    detailDay: {
        fontSize: 11,
        color: "rgba(255,255,255,0.45)",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        fontFamily: "JetBrains Mono, monospace",
    },
    detailFavBtn: {
        marginTop: 10,
        padding: "10px 14px",
        border: "1px solid",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "inherit",
        transition: "all 150ms",
        background: "transparent",
    },
    fieldLabel: {
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: "rgba(255,255,255,0.5)",
        fontFamily: "JetBrains Mono, monospace",
        marginBottom: -4,
    },
    input: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 8,
        padding: "9px 11px",
        color: "#fff",
        fontSize: 14,
        fontFamily: "inherit",
        width: "100%",
        boxSizing: "border-box",
    },
    row2: { display: "flex", gap: 8 },
    overlapWarn: {
        background: "rgba(245,158,11,0.1)",
        border: "1px solid rgba(245,158,11,0.4)",
        borderRadius: 8,
        padding: "8px 10px",
        fontSize: 12,
        color: "#fbbf24",
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },
    editBtnRow: { display: "flex", gap: 6, marginTop: 6 },
    editActionBtn: {
        flex: 1,
        background: "transparent",
        border: "1px solid",
        borderRadius: 8,
        padding: "8px 10px",
        color: "#fff",
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    errorText: {
        color: "#ef4444",
        fontSize: 12,
        fontFamily: "JetBrains Mono, monospace",
    },
};

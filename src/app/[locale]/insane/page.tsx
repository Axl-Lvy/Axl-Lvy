"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

// ==================== TYPES ====================
type StageKey = "MIRAGE" | "CLOUD" | "ALTF4" | "TECHNOBUS";
type DayKey = "jeu" | "ven" | "sam";
type SetEntry = { s: string; e: string; a: string };

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

const LINEUP: Record<DayKey, Record<StageKey, SetEntry[]>> = {
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

const HOUR_LABELS = Array.from({ length: 17 }, (_, i) => {
    const h = (12 + i) % 24;
    return { h, label: `${String(h).padStart(2, "0")}:00`, top: i * 60 * PX_PER_MIN };
});

const STORAGE_KEY = "insane-festival-favorites";

// ==================== PAGE ====================
export default function InsaneFestivalPage() {
    const [day, setDay] = useState<DayKey>("jeu");
    const [favs, setFavs] = useState<Set<string>>(new Set());
    const [favsOnly, setFavsOnly] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [hiddenStages, setHiddenStages] = useState<Set<StageKey>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load favorites from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setFavs(new Set(JSON.parse(raw) as string[]));
        } catch {
            /* no favs yet */
        }
    }, []);

    const toggleFav = (key: string) => {
        const next = new Set(favs);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        setFavs(next);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
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
    const dayData = LINEUP[day];
    const favsCount = favs.size;

    return (
        <div style={styles.root}>
            <style>{globalCss}</style>

            <header style={styles.header}>
                <div style={styles.brand}>
                    <div style={styles.brandLine1}>INSANE FESTIVAL</div>
                    <div style={styles.brandLine2}>
                        <span style={{ opacity: 0.5 }}>Beyond</span>
                        <span style={styles.brandGlyph}>✦</span>
                        <span style={{ opacity: 0.5 }}>Reality</span>
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
                                    {sets.map((set) => {
                                        const top = tToMin(set.s) * PX_PER_MIN;
                                        const height = (tToMin(set.e) - tToMin(set.s)) * PX_PER_MIN;
                                        const key = `${day}|${stage}|${set.s}|${set.a}`;
                                        const isFav = favs.has(key);
                                        const isSelected = selected === key;
                                        const dimmed = favsOnly && !isFav;

                                        const blockStyle: CSSProperties = {
                                            position: "absolute",
                                            top: top + 2,
                                            left: 2,
                                            right: 2,
                                            height: height - 4,
                                            borderLeft: `2px solid ${meta.color}`,
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
                                                key={key}
                                                onClick={() => setSelected(isSelected ? null : key)}
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
                                                {isFav && (
                                                    <div style={styles.favBadge}>
                                                        <FaStar size={9} color="#fbbf24" />
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

            {selected &&
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
        </div>
    );
}

// ==================== STYLES ====================
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@400;500;600;700&display=swap');
  .set-block:active { transform: scale(0.98); }
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
    brand: { textAlign: "center", marginBottom: 12 },
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
    setTime: {
        fontSize: 8.5,
        fontFamily: "JetBrains Mono, monospace",
        color: "rgba(255,255,255,0.55)",
        letterSpacing: "0.02em",
    },
    setArtist: { fontWeight: 600, color: "#fff", wordBreak: "break-word", overflow: "hidden" },
    favBadge: { position: "absolute", top: 3, right: 3 },
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
        border: "1px solid",
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
    },
};

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/onboarding/page.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add state variables
content = content.replace(
  'const [memberReason, setMemberReason] = useState("");',
  'const [memberReason, setMemberReason] = useState("");\n  const [memberResumeUrl, setMemberResumeUrl] = useState("");\n  const [memberCollege, setMemberCollege] = useState("");\n  const [memberQualification, setMemberQualification] = useState("");'
);

// 2. Add handleGate2MemberSubmit
content = content.replace(
  'const handleMemberApply = async (e) => {',
  `const handleGate2MemberSubmit = async (e) => {
    e.preventDefault();
    if (!memberResumeUrl || !memberCollege || !memberQualification) {
      setError("Please fill all required fields.");
      return;
    }
    setError("");
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      setGate(3);
    }, 400);
  };

  const handleMemberApply = async (e) => {`
);

// 3. Fix handleMemberApply timeout
content = content.replace(
  'setTimeout(() => setGate(3), 2000);',
  'setTimeout(() => { fetch("/api/onboarding/complete", { method: "POST" }); setCompleted(true); }, 2000);'
);

// 4. Extract Gate 2 MEMBER chunk and replace
const gate2MemberStart = `                ) : (
                  <>
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                      <h2 style={{ fontSize: "2rem", fontWeight: 800, color: INK, letterSpacing: "-0.03em", margin: "0 0 0.5rem" }}>
                        Join a company
                      </h2>`;

const gate2MemberEnd = `                      </>
                    )}
                  </>
                )}`;

const gate2Regex = new RegExp(
  gate2MemberStart.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + gate2MemberEnd.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&')
);

// We save the matched chunk for Gate 3
let oldGate2ContentMatch = content.match(gate2Regex);

const newGate2Content = `                ) : (
                  <>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: INK, letterSpacing: "-0.03em", margin: "0 0 0.25rem" }}>
                      Your Details
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: INK_LIGHT, margin: "0 0 1.75rem" }}>
                      Provide your professional and educational background.
                    </p>

                    {error && <div style={{ color: "#EF4444", fontSize: "0.85rem", marginBottom: "1rem", fontWeight: 600 }}>{error}</div>}

                    <form onSubmit={handleGate2MemberSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      <div>
                        <label style={{ fontSize: "0.85rem", fontWeight: 700, color: INK_MID, marginBottom: "0.4rem", display: "block" }}>Resume / Portfolio URL *</label>
                        <KzInput value={memberResumeUrl} onChange={e => setMemberResumeUrl(e.target.value)} placeholder="https://..." icon={LinkIcon} required />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.85rem", fontWeight: 700, color: INK_MID, marginBottom: "0.4rem", display: "block" }}>College / University *</label>
                        <KzInput value={memberCollege} onChange={e => setMemberCollege(e.target.value)} placeholder="e.g. Stanford University" icon={Building2} required />
                      </div>
                      <div>
                        <label style={{ fontSize: "0.85rem", fontWeight: 700, color: INK_MID, marginBottom: "0.4rem", display: "block" }}>Current Qualification *</label>
                        <KzInput value={memberQualification} onChange={e => setMemberQualification(e.target.value)} placeholder="e.g. B.Tech Computer Science" icon={FileText} required />
                      </div>
                      <KzButton type="submit" loading={actionLoading} style={{ marginTop: "0.5rem" }}>
                        Continue <ArrowRight size={18} />
                      </KzButton>
                    </form>
                  </>
                )}`;

if (oldGate2ContentMatch) {
  content = content.replace(gate2Regex, newGate2Content);
} else {
  console.log("Could not find Gate 2 member block!");
}

// 5. Replace Gate 3 MEMBER chunk
const gate3MemberStart = `                ) : (
                  <>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: INK, letterSpacing: "-0.03em", margin: "0 0 0.25rem" }}>
                      Your First Standup
                    </h2>`;

const gate3MemberEnd = `                      </KzButton>
                    </form>
                  </>
                )}`;

const gate3Regex = new RegExp(
  gate3MemberStart.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + gate3MemberEnd.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&')
);

if (oldGate2ContentMatch) {
  // We need to modify oldGate2ContentMatch slightly for Gate 3 (e.g. WaitingState should set completed)
  let newGate3Content = oldGate2ContentMatch[0];
  newGate3Content = newGate3Content.replace('setGate(3)', 'setCompleted(true); fetch("/api/onboarding/complete", { method: "POST", credentials: "include" })');
  
  // Remove "Full Name, Email, Phone" from the old Gate 2 since it's no longer needed or they should be hidden
  // The user just said "make the third step completely for choosing a company and browsing"
  // Let's strip out the Full Name, Email, Phone block
  
  const basicInfoRegex = /<div style=\{\{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" \}\}>\s*<div>\s*<label[^>]*>Email \*<\/label>[\s\S]*?<\/div>\s*<\/div>/;
  newGate3Content = newGate3Content.replace(/<div>\s*<label[^>]*>Full Name \*<\/label>[\s\S]*?<\/div>/, '');
  newGate3Content = newGate3Content.replace(basicInfoRegex, '');
  
  // Also change the button text to "Finish & Join"
  newGate3Content = newGate3Content.replace('Submit Application <ArrowRight size={18} />', 'Finish & Join <ArrowRight size={18} />');
  
  content = content.replace(gate3Regex, newGate3Content);
} else {
  console.log("Could not find Gate 3 member block!");
}

// 6. Update STEPS constant description
content = content.replace('desc: "First action"', 'desc: "Join a company"');

fs.writeFileSync(filePath, content);
console.log("Replaced successfully!");

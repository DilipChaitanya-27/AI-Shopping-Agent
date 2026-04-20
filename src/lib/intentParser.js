export function parseIntent(text) {
  const t = text.toLowerCase();

  return {
    budget: t.match(/\d+/) ? Number(t.match(/\d+/)[0]) : null,
    skin: t.includes("oily") ? "oily" :
          t.includes("dry") ? "dry" : null
  };
}
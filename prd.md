# Coding Standards

## React Conventions

### Named useEffect Callbacks
Semua `useEffect` **WAJIB** menggunakan named function, bukan anonymous arrow function.

**Benar:**
```tsx
useEffect(function autoStartAnimation() {
  if (autoplay) start();
  return function cancelAnimation() {
    animRef.current?.cancel();
  };
}, [to, duration, ease, autoplay, start]);
```

**Salah:**
```tsx
useEffect(() => {
  if (autoplay) start();
  return () => {
    animRef.current?.cancel();
  };
}, [to, duration, ease, autoplay, start]);
```

**Alasan:**
- React DevTools menampilkan nama function → debugging lebih cepat
- Stack trace lebih jelas saat ada error
- Code lebih readable, developer baru langsung paham tujuan effect

**Penamaan:**
- Effect function: `function <verbNoun>()` (contoh: `observeViewport`, `fetchData`, `closeOnEscape`)
- Cleanup function: `function <cleanupNoun>()` (contoh: `disconnectObserver`, `abortFetch`, `removeEventListener`)

### Named Event Handlers
Event handler yang didefinisikan inline juga sebaiknya diberi nama jika cukup kompleks.

**Benar:**
```tsx
function handleClose() {
  setOpen(false);
}

return <button onClick={handleClose}>Tutup</button>;
```

**Boleh inline (simple):**
```tsx
return <button onClick={() => setOpen(false)}>Tutup</button>;
```

## Animation Convention
- Gunakan `useAnimeCounter` dari `@/hooks/animation/useAnimeCounter` untuk animasi angka
- Gunakan `useAnimeOnScroll` dari `@/hooks/animation/useAnimeOnScroll` untuk animasi scroll-triggered
- Gunakan `animePresets` dari `@/hooks/animation/animePresets` untuk preset animasi (fadeUp, scaleIn, dll)
- `autoplay: true` (default) untuk animasi yang langsung jalan saat mount
- `autoplay: false` + manual trigger untuk animasi yang menunggu event tertentu

## Type Safety
- Dilarang menggunakan `any`
- Gunakan `unknown`, `Record<string, unknown>`, atau generic type yang sesuai
- Interface untuk props, type untuk data structures

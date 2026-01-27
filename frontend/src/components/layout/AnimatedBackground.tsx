/**
 * Static gradient background
 * Clean, modern visual without performance-heavy animations
 */
export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-dark-950" />

      {/* Static gradient orbs - no animations */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-accent-500))',
          top: '-15%',
          left: '-10%',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: 'linear-gradient(225deg, var(--color-accent-500), var(--color-primary-700))',
          bottom: '-10%',
          right: '-5%',
        }}
      />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, var(--color-dark-950) 70%)',
        }}
      />
    </div>
  );
}

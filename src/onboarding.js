export function setupOnboarding(onStartCallback) {
    const overlay = document.getElementById('onboarding');
    const startBtn = document.getElementById('btn-start');
    const tipClose = document.getElementById('tip-close');

    const hasSeenOnboarding = localStorage.getItem('lightStudioOnboardingUPCA');

    if (hasSeenOnboarding) {
        overlay.classList.add('hidden');
        if (onStartCallback) onStartCallback();
    }

    startBtn?.addEventListener('click', () => {
        overlay.classList.add('hidden');
        localStorage.setItem('lightStudioOnboardingUPCA', 'true');
        if (onStartCallback) onStartCallback();
    });

    tipClose?.addEventListener('click', () => {
        document.getElementById('floating-tip').classList.add('hidden');
    });
}

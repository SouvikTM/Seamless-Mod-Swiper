// StorageService.js
// Handles local persistence and export

export const StorageService = {
    saveProgress: (approved, rejected) => {
        localStorage.setItem('sms_approved', JSON.stringify(approved));
        localStorage.setItem('sms_rejected', JSON.stringify(rejected));
    },

    loadProgress: () => {
        return {
            approved: JSON.parse(localStorage.getItem('sms_approved') || '[]'),
            rejected: JSON.parse(localStorage.getItem('sms_rejected') || '[]')
        };
    },

    exportApproved: (approvedMods) => {
        // TODO: Generate and download .txt file
        const content = approvedMods.map(m => `${m.name} - ${m.url}`).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'approved_mods.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
};

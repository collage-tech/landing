// Locale management
class LocaleManager {
    constructor() {
        this.translations = null;
        this.currentLocale = this.detectLocale();
        this.pageType = this.detectPageType();
        this.init();
    }

    async init() {
        document.documentElement.lang = this.currentLocale;
        
        try {
            await this.loadTranslations();
            this.applyTranslations();
            this.setupLanguageSwitcher();
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    async loadTranslations() {
        const response = await fetch('translations.json');
        if (!response.ok) {
            throw new Error('Failed to load translations.json');
        }
        this.translations = await response.json();
    }

    detectPageType() {
        const path = window.location.pathname;
        if (path.includes('privacy-policy')) return 'privacyPolicy';
        if (path.includes('terms-of-use')) return 'termsOfUse';
        return 'index';
    }

    detectLocale() {
        // Check if language is saved in localStorage
        const savedLocale = localStorage.getItem('preferredLocale');
        if (savedLocale && this.isLocaleSupported(savedLocale)) {
            return savedLocale;
        }

        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        
        return this.isLocaleSupported(langCode) ? langCode : 'en';
    }

    isLocaleSupported(locale) {
        return locale === 'en' || locale === 'ru';
    }

    async setLocale(locale) {
        if (!this.isLocaleSupported(locale)) return;
        
        this.currentLocale = locale;
        localStorage.setItem('preferredLocale', locale);
        document.documentElement.lang = locale;
        this.applyTranslations();
        this.updateLanguageSwitcher();
    }

    getTranslation(key) {
        if (!this.translations) return key;

        // First try page-specific translations
        const pageTranslations = this.translations[this.pageType];
        if (pageTranslations && pageTranslations[this.currentLocale]) {
            const translation = pageTranslations[this.currentLocale][key];
            if (translation) return translation;
        }

        // Then try common translations
        const commonTranslations = this.translations.common;
        if (commonTranslations && commonTranslations[this.currentLocale]) {
            const translation = commonTranslations[this.currentLocale][key];
            if (translation) return translation;
        }

        return key;
    }

    applyTranslations() {
        if (!this.translations) return;

        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });
    }

    setupLanguageSwitcher() {
        const switcher = document.getElementById('language-switcher');
        if (!switcher) return;

        const button = switcher.querySelector('.lang-switcher-btn');
        const dropdown = switcher.querySelector('.lang-dropdown');
        
        if (!button || !dropdown) return;

        // Toggle dropdown
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!switcher.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Handle language selection
        const options = dropdown.querySelectorAll('.lang-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const locale = option.getAttribute('data-locale');
                if (locale) {
                    this.setLocale(locale);
                    dropdown.classList.remove('active');
                }
            });
        });

        this.updateLanguageSwitcher();
    }

    updateLanguageSwitcher() {
        const switcher = document.getElementById('language-switcher');
        if (!switcher) return;

        const currentLang = switcher.querySelector('.current-lang');
        const currentFlag = switcher.querySelector('.current-flag');
        
        if (currentLang) {
            currentLang.textContent = this.currentLocale === 'ru' ? 'RU' : 'EN';
        }
        if (currentFlag) {
            currentFlag.textContent = this.currentLocale === 'ru' ? '🇷🇺' : '🇬🇧';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LocaleManager();
    });
} else {
    new LocaleManager();
}

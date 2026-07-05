const currentYear = document.querySelector("#current-year");
const revealItems = document.querySelectorAll(
    ".hero-copy, .hero-card, .content-block, .highlight-band, .process-section, .projects-section, .timeline article, .tools-section, .contact-card"
);
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const navLinks = document.querySelectorAll("#site-nav a");
const copyButtons = document.querySelectorAll("[data-copy]");
const contactFeedback = document.querySelector("#contact-feedback");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

const setMenuOpen = (isOpen) => {
    if (!navToggle || !siteNav) {
        return;
    }

    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    siteNav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
};

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        setMenuOpen(!isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));

    document.addEventListener("keydown", (event) => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";

        if (event.key === "Escape" && isOpen) {
            setMenuOpen(false);
            navToggle.focus();
        }
    });
}

const copyToClipboard = async (value) => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(value);
            return;
        } catch (error) {
            // Fall back to the textarea path below when the async clipboard is denied.
        }
    }

    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    field.style.top = "0";

    const activeElement = document.activeElement;

    try {
        document.body.appendChild(field);
        field.focus();
        field.select();

        if (!document.execCommand("copy")) {
            throw new Error("Clipboard fallback failed");
        }
    } finally {
        field.remove();

        if (activeElement && typeof activeElement.focus === "function") {
            activeElement.focus();
        }
    }
};

copyButtons.forEach((button) => {
    const defaultTooltip = button.dataset.tooltip || "Copiar";

    button.addEventListener("click", async () => {
        const value = button.dataset.copy;

        if (!value) {
            return;
        }

        try {
            await copyToClipboard(value);
            button.dataset.tooltip = "E-mail copiado";
            button.classList.add("is-copied");
            if (contactFeedback) {
                contactFeedback.textContent = "E-mail copiado para a área de transferência.";
            }
        } catch (error) {
            button.dataset.tooltip = `Copie: ${value}`;
            button.classList.add("is-copied");
            if (contactFeedback) {
                contactFeedback.textContent = `Não foi possível copiar automaticamente. E-mail: ${value}.`;
            }
        }

        window.setTimeout(() => {
            button.dataset.tooltip = defaultTooltip;
            button.classList.remove("is-copied");
            if (contactFeedback) {
                contactFeedback.textContent = "";
            }
        }, 2200);
    });
});

if ("IntersectionObserver" in window && revealItems.length > 0) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.16,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealItems.forEach((item, index) => {
        item.style.setProperty("--reveal-delay", `${Math.min(index * 70, 560)}ms`);
        item.classList.add("reveal");
        observer.observe(item);
    });
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

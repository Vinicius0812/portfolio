const currentYear = document.querySelector("#current-year");
const revealItems = document.querySelectorAll(
    ".hero-copy, .hero-card, .content-block, .highlight-band article, .project-card, .timeline article, .pill-grid span, .contact-card"
);
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");
const navLinks = document.querySelectorAll("#site-nav a");
const copyButtons = document.querySelectorAll("[data-copy]");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!isOpen));
        siteNav.classList.toggle("is-open", !isOpen);
        document.body.classList.toggle("nav-open", !isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navToggle.setAttribute("aria-expanded", "false");
            siteNav.classList.remove("is-open");
            document.body.classList.remove("nav-open");
        });
    });
}

const copyToClipboard = async (value) => {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return;
    }

    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
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
        } catch (error) {
            button.dataset.tooltip = "Não foi possível copiar";
            button.classList.add("is-copied");
        }

        window.setTimeout(() => {
            button.dataset.tooltip = defaultTooltip;
            button.classList.remove("is-copied");
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
